# GLADE

**Where Digital Farming Becomes Real Yield**

3D farming game on Avalanche C-Chain with economy backed by Real World Assets (RWA).

[![Avalanche](https://img.shields.io/badge/Avalanche-C--Chain-E84142?style=flat-square&logo=avalanche&logoColor=white)](https://www.avax.network/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square&logo=solidity)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React_Three_Fiber-3D-61DAFB?style=flat-square&logo=react)](https://docs.pmnd.rs/react-three-fiber)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## What is GLADE?

GLADE is a browser-based 3D farming game where every seed you plant is backed by a real-world asset. When you buy a Coffee seed for $10, the smart contract automatically splits the payment:

- **75% ($7.50)** goes to the RWA Pool (invested in real coffee farms, vineyards, solar panels)
- **25% ($2.50)** stays in the Game Pool (funds in-game economy)

Yields come from actual asset returns — not from new player deposits. This is not a Ponzi.

## Quick Start

```bash
git clone https://github.com/Cyberpaisa/glade.git
cd glade
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start farming.

## How to Play

1. Click any empty farm plot to open the seed menu
2. Choose an RWA-backed seed (Coffee, Vineyard, Solar, Cacao)
3. Review the 75/25 split and click "Invest"
4. Watch your plant grow through 4 visual stages
5. Click a fully grown plant to harvest and claim yield
6. Open the Yield Dashboard to track your RWA portfolio

## RWA Crop Economics

| Seed | Cost | RWA (75%) | Game (25%) | Monthly Yield | Growth |
|------|------|-----------|------------|--------------|--------|
| Coffee | $10 | $7.50 | $2.50 | $0.80 | 30s |
| Vineyard | $25 | $18.75 | $6.25 | $2.10 | 45s |
| Solar Panel | $50 | $37.50 | $12.50 | $4.50 | 60s |
| Cacao | $15 | $11.25 | $3.75 | $1.20 | 35s |

Growth times are accelerated for demo. Real yields based on underlying asset performance.

## Smart Contracts

### GladeToken (ERC-20)
- Testnet stablecoin (gUSD) simulating USDC
- Built-in faucet: claim 100 gUSD every hour

### GladeFarm (ERC-721 + Game Logic)
- `buySeed()` — Enforces 75/25 split on-chain, mints NFT to player
- `claimYield()` — Harvests plant after growth period
- `getEconomyStats()` — Returns total RWA deposited, game pool, seeds planted

### Compile and Deploy

```bash
npx hardhat compile --config hardhat.config.cjs
npx hardhat run scripts/deploy.js --network fuji --config hardhat.config.cjs
```

## Architecture

```
┌──────────────────────────────────────────────┐
│                  FRONTEND                     │
│  React 18 + React Three Fiber + Zustand       │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ 3D Farm  │  │  Game UI │  │   Wallet    │  │
│  │ (WebGL)  │  │  (HUD)   │  │ (RainbowKit)│  │
│  └──────────┘  └──────────┘  └────────────┘  │
└─────────────────────┬────────────────────────┘
                      │ wagmi + viem
┌─────────────────────┴────────────────────────┐
│            AVALANCHE C-CHAIN (Fuji)           │
│  ┌────────────────┐  ┌────────────────────┐  │
│  │ GladeToken.sol │  │  GladeFarm.sol     │  │
│  │ (ERC-20 gUSD)  │  │  (ERC-721 + Game)  │  │
│  │ faucet / mint  │  │  75/25 split       │  │
│  └────────────────┘  └────────────────────┘  │
└──────────────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │   RWA POOL (75%)        │
         │   Coffee, Vineyard,     │
         │   Solar, Cacao          │
         └─────────────────────────┘
```

## Project Structure

```
glade-mvp/
├── src/
│   ├── contracts/           # Solidity smart contracts
│   │   ├── GladeToken.sol   # ERC-20 testnet stablecoin
│   │   └── GladeFarm.sol    # ERC-721 farming + 75/25 split
│   ├── components/
│   │   ├── environment/     # 3D scene (plots, trees, barn, windmill, solar)
│   │   ├── ui/              # HUD, plant menu, yield dashboard
│   │   └── web3/            # WalletProvider (RainbowKit + wagmi)
│   ├── hooks/
│   │   └── useGladeContract.js  # Contract interaction hooks
│   ├── store/
│   │   └── gameStore.js     # Zustand state + RWA crop definitions
│   ├── App.jsx
│   ├── Experience.jsx       # 3D scene manager
│   └── main.jsx
├── scripts/
│   └── deploy.js            # Hardhat deployment
├── docs/
│   ├── architecture.md
│   └── economy-whitepaper.md
└── hardhat.config.cjs
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| 3D Engine | Three.js + React Three Fiber |
| UI | React 18 |
| State | Zustand |
| Physics | @react-three/cannon |
| Blockchain | Avalanche C-Chain (Fuji) |
| Contracts | Solidity 0.8.20 + OpenZeppelin |
| Web3 | wagmi + viem + RainbowKit |
| Build | Vite 5 |

## Why Avalanche?

- Sub-second finality for real-time gaming
- Low fees ($0.01/tx) make micro-transactions viable
- Growing RWA ecosystem (Securitize, Ondo, etc.)
- Subnet/L1 capability for dedicated game chain
- EVM compatible — standard Solidity tooling

## Documentation

- [Architecture](docs/architecture.md) — System design and contract details
- [Economy Whitepaper](docs/economy-whitepaper.md) — RWA model, yield mechanics, tokenomics

## Security

Smart contracts are **not audited**. This is a prototype for Avalanche Build Games 2026. Do not use with real funds.

## Team

Built by [@Cyber_paisa](https://github.com/Cyberpaisa) for [Avalanche Build Games 2026](https://build.avax.network/build-games).

## License

MIT
