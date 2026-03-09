import React from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme, getDefaultConfig } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const avalancheFuji = {
  id: 43113,
  name: 'Avalanche Fuji',
  nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  rpcUrls: { default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] } },
  blockExplorers: { default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' } },
  testnet: true,
}

const config = getDefaultConfig({
  appName: 'GLADE',
  projectId: 'glade-mvp-demo',
  chains: [avalancheFuji],
  transports: { [avalancheFuji.id]: http() },
})

const queryClient = new QueryClient()

const WalletProvider = ({ children }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider theme={darkTheme({ accentColor: '#2ecc71', borderRadius: 'medium' })}>
        {children}
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)

export default WalletProvider
