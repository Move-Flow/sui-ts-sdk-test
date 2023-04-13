import { JsonRpcProvider, Connection, Ed25519Keypair, PaginatedEvents, SuiAddress } from '@mysten/sui.js';
// Construct your connection:
// const connection = new Connection({
//   fullnode: 'https://fullnode.testnet.sui.io',
//   faucet: 'https://faucet.devnet.sui.io/gas',
// });
const connection = new Connection({
  fullnode: 'https://fullnode.devnet.sui.io',
  faucet: 'https://faucet.devnet.sui.io/gas',
});

const sender = "0x58e3511aa31f0bd694d95ad6148e33cb45c52356eca673847c51dd3b13a66983";
const receiver = "0x0d761eeee7593abb700b8cb5cae0e02080b797d250e07f342044c78cc5b31947";


const getStreamsBySender = async (provider: JsonRpcProvider, senderAddress: SuiAddress) => {
  const SuiEventFilter = {Sender: senderAddress}; 
  const events: PaginatedEvents = await provider.queryEvents({
    query: SuiEventFilter,
    limit: 10,
    order: "descending",
  });
  console.log("events", JSON.parse(JSON.stringify(events?.data[0])), events?.data.length);

  const _streamIds: string[] = events?.data.map( (x) => x.parsedJson?.id );
  const streamIds = [...new Set(_streamIds)];
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

  const streamPayloads = streams.map( (x) => JSON.parse(JSON.stringify(x.data?.content)) );
  console.log("streamPayloads", streamPayloads);
}

const getStreamsByReceiver = async (provider: JsonRpcProvider, recvAddress: SuiAddress): Promise<any[]> => {
  const packageId = "0xeb9b58b9ef88e2320eb447400cf1c514b2f12a38ef7daf36b5d4fa26ac0cf03a";
  const eventType = `${packageId}::stream::StreamEvent`;
  const SuiEventFilter = { MoveEventType: eventType }; 

  // const SuiEventFilter = { MoveEventField: {
  //   path: "/sender",
  //   value: sender.toLowerCase()
  // }};
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
  console.log("events", JSON.parse(JSON.stringify(events?.data[0])));

  const _streamIds: string[] = events?.data.map( (x) => x.parsedJson?.id );
  const streamIds = [...new Set(_streamIds)];
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
  console.log("allStreamPayloads", allStreamPayloads);

  const streamPayloads = allStreamPayloads.filter( (x) => x?.fields?.recipient.toLowerCase() == recvAddress.toLowerCase() );
  console.log("streamPayloads", streamPayloads);

  return streamPayloads;
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
  // await getStreamsBySender(provider, sender);

  console.log("Please refer to https://github.com/MystenLabs/sui/tree/main/sdk/typescript#writing-apis for other API calls");
})();  