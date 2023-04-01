import React from 'react';
import logo from './logo.svg';
import './App.css';

import {ConnectButton} from '@suiet/wallet-kit';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ConnectButton>Connect Wallet</ConnectButton>
      </header>
    </div>
  );
}

export default App;
