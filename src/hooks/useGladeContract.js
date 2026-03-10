import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useState, useEffect } from 'react'

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
  const { address } = useAccount()
  const contractsDeployed = !!(TOKEN_ADDRESS && FARM_ADDRESS)

  // ── Read: gUSD balance on-chain ──────────────────────────────────────────
  const { data: gUSDRaw, refetch: refetchBalance } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: GLADE_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: contractsDeployed && !!address },
  })

  // ── Read: economy stats on-chain ─────────────────────────────────────────
  const { data: economyStatsRaw, refetch: refetchStats } = useReadContract({
    address: FARM_ADDRESS,
    abi: GLADE_FARM_ABI,
    functionName: 'getEconomyStats',
    query: { enabled: contractsDeployed },
  })

  const gUSDBalance = gUSDRaw != null ? parseFloat(formatEther(gUSDRaw)) : null
  const gUSDBalanceFormatted = gUSDBalance != null ? gUSDBalance.toFixed(2) : null

  const economyStats = economyStatsRaw
    ? {
        rwa: parseFloat(formatEther(economyStatsRaw[0])).toFixed(2),
        game: parseFloat(formatEther(economyStatsRaw[1])).toFixed(2),
        seeds: Number(economyStatsRaw[2]),
      }
    : null

  // ── Write: faucet ─────────────────────────────────────────────────────────
  const { writeContract: writeFaucet, data: faucetHash, isPending: isFaucetPending } = useWriteContract()
  const { isSuccess: isFaucetSuccess } = useWaitForTransactionReceipt({ hash: faucetHash })

  useEffect(() => {
    if (isFaucetSuccess) {
      refetchBalance()
    }
  }, [isFaucetSuccess])

  const claimFaucet = () => {
    if (!TOKEN_ADDRESS) return
    writeFaucet({ address: TOKEN_ADDRESS, abi: GLADE_TOKEN_ABI, functionName: 'claimFaucet' })
  }

  // ── Write: approve + buySeed (2-step) ────────────────────────────────────
  const [pendingSeedTypeId, setPendingSeedTypeId] = useState(null)
  const [buyStep, setBuyStep] = useState('idle') // 'idle' | 'approving' | 'buying' | 'done'

  const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending } = useWriteContract()
  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash })

  const { writeContract: writeBuy, data: buyHash, isPending: isBuyPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isBuySuccess } = useWaitForTransactionReceipt({ hash: buyHash })

  // Step 2: after approve confirmed → call buySeed
  useEffect(() => {
    if (isApproveSuccess && pendingSeedTypeId !== null && buyStep === 'approving') {
      setBuyStep('buying')
      writeBuy({
        address: FARM_ADDRESS,
        abi: GLADE_FARM_ABI,
        functionName: 'buySeed',
        args: [BigInt(pendingSeedTypeId)],
      })
      setPendingSeedTypeId(null)
    }
  }, [isApproveSuccess, pendingSeedTypeId, buyStep])

  // After buySeed confirmed → refetch balance + stats
  useEffect(() => {
    if (isBuySuccess) {
      setBuyStep('done')
      refetchBalance()
      refetchStats()
    }
  }, [isBuySuccess])

  /**
   * approveAndBuySeed — full on-chain purchase flow:
   * 1. approve(FARM_ADDRESS, cost)
   * 2. buySeed(seedTypeId)  ← runs after approve confirmed
   *
   * @param {number} seedTypeId  — contract seed index (0-3)
   * @param {number} cost        — seed cost in gUSD (e.g. 10)
   */
  const approveAndBuySeed = (seedTypeId, cost) => {
    if (!TOKEN_ADDRESS || !FARM_ADDRESS) return
    setBuyStep('approving')
    setPendingSeedTypeId(seedTypeId)
    writeApprove({
      address: TOKEN_ADDRESS,
      abi: GLADE_TOKEN_ABI,
      functionName: 'approve',
      args: [FARM_ADDRESS, parseEther(cost.toString())],
    })
  }

  const resetBuyStep = () => setBuyStep('idle')

  const claimYieldOnChain = (tokenId) => {
    if (!FARM_ADDRESS) return
    writeBuy({
      address: FARM_ADDRESS,
      abi: GLADE_FARM_ABI,
      functionName: 'claimYield',
      args: [BigInt(tokenId)],
    })
  }

  const isPending = isApprovePending || isBuyPending
  const txHash = buyHash || approveHash

  return {
    contractsDeployed,
    gUSDBalance,
    gUSDBalanceFormatted,
    economyStats,
    refetchBalance,
    refetchStats,
    // faucet
    claimFaucet,
    isFaucetPending,
    faucetHash,
    isFaucetSuccess,
    // buy flow
    approveAndBuySeed,
    buyStep,        // 'idle' | 'approving' | 'buying' | 'done'
    resetBuyStep,
    isPending,
    isConfirming,
    isBuySuccess,
    txHash,
    // yield
    claimYieldOnChain,
  }
}
