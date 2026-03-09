# GLADE Architecture

## System Overview

```
┌──────────────────────────────────────────────────┐
│                   FRONTEND                        │
│  React 18 + React Three Fiber + Zustand           │
│  ┌───────────┐  ┌───────────┐  ┌──────────────┐  │
│  │  3D Farm   │  │  Game UI  │  │   Wallet     │  │
│  │  (WebGL)   │  │  (HUD)    │  │ (RainbowKit) │  │
│  └───────────┘  └───────────┘  └──────────────┘  │
└──────────────────────┬───────────────────────────┘
                       │ wagmi + viem
┌──────────────────────┴───────────────────────────┐
│             AVALANCHE C-CHAIN (Fuji)              │
│  ┌─────────────────┐  ┌───────────────────────┐  │
│  │  GladeToken.sol  │  │  GladeFarm.sol        │  │
│  │  (ERC-20 gUSD)   │  │  (ERC-721 + Game)     │  │
│  │  faucet / mint    │  │  buySeed / claimYield │  │
│  └─────────────────┘  └───────────────────────┘  │
└──────────────────────────────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────┐
│              RWA ALLOCATION (75%)                  │
│  Coffee farms, vineyards, solar panels, cacao      │
│  Managed by regulated custodian off-chain          │
└──────────────────────────────────────────────────┘
```

## Payment Flow

1. Player clicks a farm plot and selects a seed (e.g., Coffee $10)
2. Smart contract `GladeFarm.buySeed()` executes on Avalanche C-Chain
3. Payment automatically splits:
   - 75% ($7.50) -> RWA Pool (real-world asset fund)
   - 25% ($2.50) -> Game Pool (in-game economy)
4. Player receives an ERC-721 NFT representing their planted seed
5. After growth period, player calls `claimYield()` to harvest
6. Yield is generated from actual RWA returns (simulated in testnet)

## Tech Stack

| Component    | Technology                    |
|-------------|-------------------------------|
| 3D Rendering | Three.js + React Three Fiber |
| UI Framework | React 18                      |
| State        | Zustand                       |
| Physics      | @react-three/cannon           |
| Blockchain   | Avalanche C-Chain (EVM)       |
| Contracts    | Solidity 0.8.20 + OpenZeppelin|
| Web3 Client  | wagmi + viem + RainbowKit     |
| Build Tool   | Vite 5                        |
| Deploy       | Vercel (frontend), Hardhat (contracts) |

## Contract Design

### GladeToken (ERC-20)
- Testnet stablecoin (gUSD) simulating USDC
- Built-in faucet with 1-hour cooldown
- Players claim 100 gUSD per faucet call

### GladeFarm (ERC-721 + Game Logic)
- Each planted seed mints an NFT to the player
- 4 seed types with different costs, growth times, and yields
- `buySeed()` enforces the 75/25 split automatically
- `isReady()` checks if growth period has elapsed
- `claimYield()` marks seed as harvested and emits yield event
- `getEconomyStats()` returns total RWA deposited, game deposited, seeds planted
