# GLADE Economy Whitepaper

## The Problem

Most Play-to-Earn games suffer from unsustainable tokenomics: rewards are funded by new player deposits (Ponzi dynamics), leading to inevitable collapse when growth slows.

## The GLADE Solution: RWA-Backed Yield

GLADE introduces a farming game where in-game purchases are backed by Real World Assets (RWA). Instead of printing tokens from nothing, yields come from actual productive assets.

## Core Mechanic: The 75/25 Split

Every seed purchase in GLADE is automatically split by the smart contract:

| Allocation | Percentage | Purpose |
|-----------|-----------|---------|
| RWA Pool  | 75%       | Invested in real-world productive assets |
| Game Pool | 25%       | Funds in-game economy and rewards |

### Example: Coffee Seed ($10 USDC)
- $7.50 -> RWA Pool (fractional ownership of Colombian coffee farm)
- $2.50 -> Game Pool (in-game liquidity, rewards, operations)

## Asset Classes

| Asset | Cost | Monthly Yield | APY (est.) | Real-World Backing |
|-------|------|---------------|------------|-------------------|
| Coffee | $10 | $0.80 | ~9.6% | Arabica coffee plantation |
| Vineyard | $25 | $2.10 | ~10.1% | Fractional vineyard share |
| Solar Panel | $50 | $4.50 | ~10.8% | Solar farm energy credits |
| Cacao | $15 | $1.20 | ~9.6% | Fine cacao plantation |

## Why It Works

1. **Non-Ponzi**: Yields come from real asset returns, not new deposits
2. **Transparent**: All splits executed on-chain via smart contracts
3. **Scalable**: More players = more capital deployed to productive assets
4. **Sustainable**: RWA yields are based on real economic activity
5. **Fun**: 3D farming game makes DeFi accessible and engaging

## Token Flow

```
Player buys Coffee Seed ($10 USDC)
         │
         ├── 75% ($7.50) ──► RWA Pool
         │                      │
         │                      ├── Invested in coffee farm
         │                      │
         │                      └── Generates $0.80/month real yield
         │
         └── 25% ($2.50) ──► Game Pool
                                │
                                ├── In-game rewards
                                ├── Seasonal events
                                └── Platform operations
```

## Yield Distribution

When a plant reaches maturity (growth time elapsed), the player can harvest:
- Yield is calculated from actual RWA returns
- Distributed in USDC (or gUSD on testnet)
- Smart contract verifies growth time before allowing claim

## Risk Factors

- RWA yields are estimates and may vary
- Smart contracts are unaudited (testnet prototype)
- Regulatory considerations for tokenized RWAs
- Custodial risk for off-chain assets

## Avalanche C-Chain Advantages

- Low fees (~$0.01 per transaction)
- Fast finality (~2 seconds)
- EVM compatible (Solidity, wagmi, viem)
- Growing RWA ecosystem on Avalanche
- Subnet capability for future game-specific chain

## Roadmap

1. **MVP (Current)**: Simulated RWA yields on Fuji testnet
2. **Phase 2**: Integration with real RWA protocols (e.g., Centrifuge, Goldfinch)
3. **Phase 3**: Mainnet launch with audited contracts
4. **Phase 4**: Dedicated Avalanche L1 for GLADE ecosystem
