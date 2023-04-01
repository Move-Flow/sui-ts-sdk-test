import React, { useEffect } from 'react';
import './App.css';

import {ConnectButton, useAccountBalance, SuiChainId} from '@suiet/wallet-kit';
import {useWallet} from '@suiet/wallet-kit';
import {TransactionBlock} from "@mysten/sui.js";

const sampleNft = new Map([
  ['sui:devnet', '0x37b32a726c348b9198ffc22f63a97cb36c01f257258af020cecea8a82575dd56::nft::mint'],
  ['sui:testnet', '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::nft::mint'],
])

function App() {
  const wallet = useWallet()

  useEffect(() => {
    if (!wallet.connected) return;
    console.log('connected wallet name: ', wallet.name)
    console.log('account address: ', wallet.account?.address)
    console.log('account publicKey: ', wallet.account?.publicKey)
  }, [wallet.connected])

  const { error, loading, balance } = useAccountBalance();
  console.log("balance", balance?.toString())

  // launch a move call for the connected account via wallet
  async function handleExecuteMoveCall(target: string | undefined) {
    if (!target) return;

    try {
      const tx = new TransactionBlock()
      tx.moveCall({
        target: target as any,
        arguments: [
          tx.pure('Suiet NFT'),
          tx.pure('Suiet Sample NFT'),
          tx.pure('https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4')
        ]
      })
      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });
      console.log('executeMoveCall success', resData);
      alert('executeMoveCall succeeded (see response in the console)');
    } catch (e) {
      console.error('executeMoveCall failed', e);
      alert('executeMoveCall failed (see response in the console)');
    }
  }

  return (
    <div className="App">
        <ConnectButton>Connect Wallet</ConnectButton>

      <div>{loading}</div>
      <div>Balance: {balance?.toString()}</div>

      <div className={'btn-group'} style={{margin: '8px 0'}}>
              {wallet.chain?.id === SuiChainId.TestNET ? (
                <button onClick={() => handleExecuteMoveCall(sampleNft.get('sui:testnet'))}>Testnet Mint NFT</button>
              ) : (
                <button onClick={() => handleExecuteMoveCall(sampleNft.get('sui:devnet'))}>Devnet Mint NFT</button>
              )}
      </div>

    </div>
  );
}

export default App;
