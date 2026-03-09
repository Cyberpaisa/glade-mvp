import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

const GLADE_TOKEN_ABI = [
  {
    inputs: [],
    name: 'claimFaucet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const GLADE_FARM_ABI = [
  {
    inputs: [{ name: 'seedTypeId', type: 'uint256' }],
    name: 'buySeed',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'claimYield',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getEconomyStats',
    outputs: [
      { name: 'rwa', type: 'uint256' },
      { name: 'game', type: 'uint256' },
      { name: 'seeds', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const TOKEN_ADDRESS = import.meta.env.VITE_GLADE_TOKEN_ADDRESS || null
const FARM_ADDRESS = import.meta.env.VITE_GLADE_FARM_ADDRESS || null

export function useGladeContract() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const contractsDeployed = !!(TOKEN_ADDRESS && FARM_ADDRESS)

  const claimFaucet = () => {
    if (!TOKEN_ADDRESS) return
    writeContract({
      address: TOKEN_ADDRESS,
      abi: GLADE_TOKEN_ABI,
      functionName: 'claimFaucet',
    })
  }

  const approveToken = (amount) => {
    if (!TOKEN_ADDRESS || !FARM_ADDRESS) return
    writeContract({
      address: TOKEN_ADDRESS,
      abi: GLADE_TOKEN_ABI,
      functionName: 'approve',
      args: [FARM_ADDRESS, parseEther(amount.toString())],
    })
  }

  const buySeedOnChain = (seedTypeId) => {
    if (!FARM_ADDRESS) return
    writeContract({
      address: FARM_ADDRESS,
      abi: GLADE_FARM_ABI,
      functionName: 'buySeed',
      args: [BigInt(seedTypeId)],
    })
  }

  const claimYieldOnChain = (tokenId) => {
    if (!FARM_ADDRESS) return
    writeContract({
      address: FARM_ADDRESS,
      abi: GLADE_FARM_ABI,
      functionName: 'claimYield',
      args: [BigInt(tokenId)],
    })
  }

  return {
    contractsDeployed,
    claimFaucet,
    approveToken,
    buySeedOnChain,
    claimYieldOnChain,
    txHash: hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}
