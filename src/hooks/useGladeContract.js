import { useReadContract, useWriteContract, useAccount } from 'wagmi'

// ABI stubs — replace with actual ABI after compile
const GLADE_FARM_ABI = [
  { name: 'buySeed', type: 'function', inputs: [{ name: 'seedTypeId', type: 'uint256' }], outputs: [{ type: 'uint256' }], stateMutability: 'nonpayable' },
  { name: 'claimYield', type: 'function', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { name: 'isReady', type: 'function', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ type: 'bool' }], stateMutability: 'view' },
  { name: 'getEconomyStats', type: 'function', inputs: [], outputs: [{ name: 'rwa', type: 'uint256' }, { name: 'game', type: 'uint256' }, { name: 'seeds', type: 'uint256' }], stateMutability: 'view' },
]

const GLADE_TOKEN_ABI = [
  { name: 'claimFaucet', type: 'function', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { name: 'balanceOf', type: 'function', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { name: 'approve', type: 'function', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }], stateMutability: 'nonpayable' },
]

// Replace with deployed addresses
const FARM_ADDRESS = '0x0000000000000000000000000000000000000000'
const TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'

export function useGladeContract() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const buySeed = async (seedTypeId) => {
    return writeContractAsync({
      address: FARM_ADDRESS,
      abi: GLADE_FARM_ABI,
      functionName: 'buySeed',
      args: [BigInt(seedTypeId)],
    })
  }

  const claimYield = async (tokenId) => {
    return writeContractAsync({
      address: FARM_ADDRESS,
      abi: GLADE_FARM_ABI,
      functionName: 'claimYield',
      args: [BigInt(tokenId)],
    })
  }

  const claimFaucet = async () => {
    return writeContractAsync({
      address: TOKEN_ADDRESS,
      abi: GLADE_TOKEN_ABI,
      functionName: 'claimFaucet',
    })
  }

  return { buySeed, claimYield, claimFaucet }
}
