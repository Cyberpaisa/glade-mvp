import React from 'react'
import ReactDOM from 'react-dom/client'
import WalletProvider from './components/web3/WalletProvider'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>
)
