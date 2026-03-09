import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { injected } from 'wagmi/connectors'

export function useWallet() {
  const { address, isConnected, chain } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })

  const connectWallet = () => {
    connect({ connector: injected() })
  }

  return {
    address,
    isConnected,
    chain,
    balance: balance ? parseFloat(balance.formatted).toFixed(4) : '0',
    connectWallet,
    disconnect,
    isPending,
  }
}
