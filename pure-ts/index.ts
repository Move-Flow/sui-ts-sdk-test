import { JsonRpcProvider, Connection, Ed25519Keypair, PaginatedEvents, SuiAddress } from '@mysten/sui.js';
// Construct your connection:
const connection = new Connection({
  fullnode: 'https://fullnode.testnet.sui.io',
  faucet: 'https://faucet.devnet.sui.io/gas',
});

const sender = "0x4caa76bc098abc3bb92339909b06d648d17bf68bae891abe0c291bf3a4f06ac2";
const receiver = "0xe6b12a5ef66c79ccc22c6f730a66667c767e18b28aab84c68d140e206a7e4dfc";


const getStreamsByReceiver = async (provider: JsonRpcProvider, recvAddress: SuiAddress) => {
  const packageId = "0x0ec52c563ddc7db9b3ae5f6fad2420fcbf7899e0a2a744569584689a59c4759a";
  const eventType = `${packageId}::stream::StreamEvent`;
  const SuiEventFilter = {MoveEventType: eventType};
  // { 
  //   All: [
  //   {Sender: senderAddress},
  //   {MoveEventType: eventType}
  //   // MoveEventField: 
  //   ]
  // };

  const events: PaginatedEvents = await provider.queryEvents({
    query: SuiEventFilter,
    limit: 1,
    order: "descending",
  });
  console.log("events", JSON.parse(JSON.stringify(events?.data)));

  const streamIds: string[] = events?.data.map( (x) => x.parsedJson?.id );
  console.log("_streamIds", streamIds);

  const suiObjectDataOptions = {
    showType: true,
    showContent: true,
  };
  const streams = await provider.multiGetObjects({
    ids: streamIds,
    options: suiObjectDataOptions,
  });
  console.log("streams", streams);

  const allStreamPayloads = streams.map( (x) => JSON.parse(JSON.stringify(x.data?.content)) );
  console.log("eventPayloads", allStreamPayloads);

  const streamPayloads = allStreamPayloads.filter( (x) => x?.fields?.recipient.toLowerCase() == recvAddress.toLowerCase() );
  console.log("eventPayloads", streamPayloads);
}

(async () => {
  const keypair = Ed25519Keypair.generate();
  const address = keypair.getPublicKey().toSuiAddress();

  const provider = new JsonRpcProvider(connection);
  // get tokens from a custom faucet server
  // const received = await provider.requestSuiFromFaucet(address);
  // console.log("SUI token received:", received);
  const balance = await provider.getBalance({
    owner: address
  });
  console.log("SUI token balance:", balance);

  await getStreamsByReceiver(provider, sender);

  console.log("Please refer to https://github.com/MystenLabs/sui/tree/main/sdk/typescript#writing-apis for other API calls");
})();  