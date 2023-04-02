import React from 'react';
import './App.css';

import { ConnectButton, useWalletKit } from "@mysten/wallet-kit";
import { formatAddress, TransactionBlock } from "@mysten/sui.js";

const sampleNft = new Map([
  ['sui:devnet', '0x37b32a726c348b9198ffc22f63a97cb36c01f257258af020cecea8a82575dd56::nft::mint'],
  ['sui:testnet', '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::nft::mint'],
])


function App() {
  const { currentAccount, signAndExecuteTransactionBlock } = useWalletKit();
  const address = currentAccount ? currentAccount.address : " ";
  console.log(currentAccount?.address);
  
  const handleClick = async () => {
    try{
      const tx = new TransactionBlock();
      const _target = sampleNft.get('sui:devnet');
      tx.moveCall({
        target: `${_target}` as any,
        arguments: [
          tx.pure("some name"),
          tx.pure("some description"),
          tx.pure(
            "https://cdn.britannica.com/94/194294-138-B2CF7780/overview-capybara.jpg?w=800&h=450&c=crop"
          ),
        ],
      });
      const resData = await signAndExecuteTransactionBlock({ transactionBlock: tx });
      console.log('executeMoveCall success', resData);
      alert('executeMoveCall succeeded (see response in the console)');  
    } catch (e) {
      console.error('executeMoveCall failed', e);
      alert('executeMoveCall failed (see response in the console)');      
    }

  };

  return (
    <div className="App">
    <ConnectButton
      connectText={"Connect Wallet"}
      connectedText={`Connected: ${formatAddress(address)}`}
    />
      <div>
        <button onClick={handleClick} disabled={!(currentAccount?.address)}>
          Send Transaction
        </button>
      </div>
    </div>
  );
}

export default App;
