import { JsonRpcProvider, Connection, Ed25519Keypair } from '@mysten/sui.js';
// Construct your connection:
const connection = new Connection({
  fullnode: 'https://fullnode.devnet.sui.io',
  faucet: 'https://faucet.devnet.sui.io/gas',
});
(async () => {
  const keypair = Ed25519Keypair.generate();
  const address = keypair.getPublicKey().toSuiAddress();

  // connect to a custom RPC server
  const provider = new JsonRpcProvider(connection);
  // get tokens from a custom faucet server
  const received = await provider.requestSuiFromFaucet(address);
  console.log(received);
})();  