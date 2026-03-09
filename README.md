# GLADE

**Where Digital Farming Becomes Real Yield**

3D farming game on Avalanche C-Chain where every seed you plant is backed by a Real World Asset. Plant, collect cards, hybridize, defend from pests, stake, and earn real yield.

[![Play Now](https://img.shields.io/badge/Play_Now-glade--mvp.vercel.app-2ecc71?style=for-the-badge)](https://glade-mvp.vercel.app)

[![Avalanche](https://img.shields.io/badge/Avalanche-C--Chain-E84142?style=flat-square&logo=avalanche&logoColor=white)](https://www.avax.network/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.27-363636?style=flat-square&logo=solidity)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React_Three_Fiber-3D-61DAFB?style=flat-square&logo=react)](https://docs.pmnd.rs/react-three-fiber)
[![wagmi](https://img.shields.io/badge/wagmi-Web3-purple?style=flat-square)](https://wagmi.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## What is GLADE?

GLADE is a browser-based 3D farming game where every seed you plant is backed by a real-world asset. When you buy a Coffee seed for $10, the smart contract automatically splits the payment:

- **75% ($7.50)** → RWA Pool (invested in real coffee farms, vineyards, solar panels)
- **25% ($2.50)** → Game Pool (in-game economy, rewards, packs, staking)

Yields come from actual asset returns — not from new player deposits. This is not a Ponzi.

> Built for [Avalanche Build Games 2026](https://build.avax.network/build-games) ($1M prize pool)

---

## Screenshots

| Farm View | Card Collection | Hybrid Lab |
|-----------|----------------|------------|
| 3D farm with 9 plots, day/night cycle, weather effects | Seed cards with rarities, traits, staking | Combine 2 cards to create hybrids |

---

## Player Starter Kit

### Getting Started (5 minutes)

1. **Open the game** at [glade-mvp.vercel.app](https://glade-mvp.vercel.app)
2. **Read the tutorial** — it appears on first load (click `?` in the HUD to reopen)
3. **You start with $100 gUSD** — this is testnet play money
4. **Connect MetaMask** (optional) — click "Connect Wallet" for on-chain features

### Your First Farm

| Step | Action | What Happens |
|------|--------|-------------|
| 1 | Click an empty plot | Opens the seed purchase menu |
| 2 | Choose a seed (Coffee $10 recommended) | 75% goes to RWA Pool, 25% to Game Pool |
| 3 | Watch it grow (30s demo) | Progress bar shows growth % |
| 4 | Click when ready (golden glow) | You harvest yield in gUSD |

### Controls

| Key | Action |
|-----|--------|
| `W A S D` | Move your farmer character |
| `Click + Drag` | Rotate camera |
| `Scroll` | Zoom in/out |
| `Click plot` | Buy seed / Harvest plant |
| `Click pest` | Kill pest (earn gUSD) |

### Game Features

| Feature | How to Access | What It Does |
|---------|--------------|-------------|
| **Seed Cards** | Click `Cards` in HUD | Buy packs ($2 or $6), collect cards with rarities and traits |
| **Hybrid Lab** | Click `Lab` in HUD | Combine 2 cards to create hybrids with better stats |
| **Staking** | Cards tab > click card > Stake | Rare+ cards earn passive gUSD from Game Pool |
| **Weather** | Top-left HUD | Sun (1x), Rain (1.5x growth), Drought (0.5x), Storm (damages plants) |
| **Pests** | Click bugs on farm | Kill pests before they damage plants, earn $0.10-$0.25 |
| **Plant with Card** | Plot menu > "Usar Carta" tab | Use a card to boost your planted crop's yield |
| **Wallet** | Top-right HUD | Connect MetaMask, see AVAX balance, on-chain TX |
| **Faucet** | Top-right (when wallet connected) | Claim 100 gUSD from smart contract |

### Card Rarities

| Rarity | Basic Pack ($2) | Premium Pack ($6) | Staking Yield |
|--------|-----------------|-------------------|---------------|
| Common | 85% | 60% | — |
| Rare | 12% | 30% | 1% per tick |
| Epic | 2.5% | 8% | 3% per tick |
| Legendary | 0.5% | 2% | 5% per tick |

### Card Traits

| Trait | Effect |
|-------|--------|
| Fast Growth | Reduces grow time by 20% |
| High Yield | +30% harvest yield |
| Resilient | Takes less pest/storm damage |
| All Weather | Immune to weather penalties |
| Double Harvest | 20% chance of 2x yield |
| Glowing | Visual glow effect + light |
| Fragile | Takes more damage (negative) |
| Slow Growth | Slower growth (negative) |

### Tips for Profitability

1. **Solar Panel ($50)** has the best yield: $4.50/month (~10.8% APY)
2. **Buy Premium Packs ($6)** for better card odds (2% Legendary vs 0.5%)
3. **Stake Rare+ cards** for passive gUSD income from the Game Pool
4. **Hybridize cards** in the Lab — hybrids can upgrade rarity
5. **Kill pests quickly** — they damage your plants and reduce harvest yield
6. **Watch the weather** — plant during Rain (1.5x growth speed), avoid Storm
7. **Use cards with "High Yield" or "Double Harvest" traits** when planting

---

## RWA Crop Economics

| Seed | Cost | RWA (75%) | Game (25%) | Monthly Yield | APY | Growth (demo) |
|------|------|-----------|------------|---------------|-----|---------------|
| ☕ Coffee | $10 | $7.50 | $2.50 | $0.80 | ~9.6% | 30s |
| 🫘 Cacao | $15 | $11.25 | $3.75 | $1.20 | ~9.6% | 35s |
| 🍇 Vineyard | $25 | $18.75 | $6.25 | $2.10 | ~10.1% | 45s |
| ☀️ Solar Panel | $50 | $37.50 | $12.50 | $4.50 | ~10.8% | 60s |

Growth times are accelerated for demo. Real yields based on underlying asset performance.

### Economy Rules

- **75/25 split** only applies when planting on a plot
- **Card packs** ($2/$6) go 100% to Game Pool
- **Pest rewards** ($0.10-$0.25) come from Game Pool
- **Staking rewards** come from Game Pool
- **Hybridization cost** ($3 base * rarity multiplier) goes to Game Pool

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│              BROWSER (React + Vite)              │
│                                                  │
│  ┌────────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Three.js   │  │ Zustand  │  │ wagmi/viem  │  │
│  │ R3F + Drei │  │ Store    │  │ Wallet +    │  │
│  │ 3D World   │  │ Game     │  │ Contract    │  │
│  │            │  │ State    │  │ Hooks       │  │
│  └────────────┘  └──────────┘  └──────┬──────┘  │
│                                       │          │
└───────────────────────────────────────┼──────────┘
                                        │ JSON-RPC
┌───────────────────────────────────────┼──────────┐
│         AVALANCHE C-CHAIN (Fuji 43113)│          │
│                                       ▼          │
│  ┌──────────────────┐  ┌────────────────────┐    │
│  │ GladeToken.sol   │  │ GladeFarm.sol      │    │
│  │ ERC-20 "gUSD"    │  │ ERC-721 + Game     │    │
│  │ - claimFaucet()  │  │ - buySeed()        │    │
│  │ - balanceOf()    │  │   → 75% to rwaPool │    │
│  │ - approve()      │  │   → 25% to gamePool│    │
│  │                  │  │ - claimYield()      │    │
│  │                  │  │ - getEconomyStats() │    │
│  └──────────────────┘  └────────────────────┘    │
└──────────────────────────────────────────────────┘
```

---

## Developer Guide

### Quick Start

```bash
git clone https://github.com/Cyberpaisa/glade-mvp.git
cd glade-mvp
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Project Structure

```
glade-mvp/
├── CLAUDE.md                       # AI context (Claude Code auto-reads)
├── AI_CONTEXT.md                   # Universal AI context (paste into any AI)
├── AGENTS.md                       # VSCode Copilot/Cline agents context
├── .cursorrules                    # Cursor AI auto-reads
├── .github/copilot-instructions.md # GitHub Copilot auto-reads
├── .windsurfrules                  # Windsurf AI auto-reads
│
├── src/
│   ├── main.jsx                    # Entry: wraps App in WalletProvider
│   ├── App.jsx                     # Canvas + UI overlays + game loops
│   ├── Experience.jsx              # 3D scene manager
│   ├── styles.css                  # All UI styles (CSS variables)
│   │
│   ├── store/
│   │   ├── gameStore.js            # Zustand state (economy, plots, weather, cards)
│   │   └── seedCards.js            # Card generation, hybridization, traits
│   │
│   ├── contracts/
│   │   ├── GladeToken.sol          # ERC-20 gUSD stablecoin with faucet
│   │   └── GladeFarm.sol           # ERC-721 + buySeed(75/25) + claimYield
│   │
│   ├── components/
│   │   ├── environment/            # 3D scene components
│   │   │   ├── FarmPlot.jsx        # Interactive plots with health/growth
│   │   │   ├── Trees.jsx           # Procedural trees
│   │   │   ├── Decorations.jsx     # Barn, windmill, solar panels
│   │   │   ├── FarmSign.jsx        # Entrance sign
│   │   │   ├── Effects.jsx         # Particles, butterflies
│   │   │   ├── DynamicLighting.jsx # Day/night cycle + weather lighting
│   │   │   ├── Player.jsx          # WASD character with physics
│   │   │   ├── Pests.jsx           # 3D pest meshes, click-to-kill
│   │   │   └── WeatherSystem.jsx   # Rain, storms, lightning
│   │   ├── ui/                     # HUD and menus
│   │   │   ├── GameUI.jsx          # Main HUD (balance, wallet, stats)
│   │   │   ├── PlantMenu.jsx       # Seed purchase + plant-with-card + on-chain TX
│   │   │   ├── YieldDashboard.jsx  # Portfolio tracker + staking
│   │   │   ├── CardCollection.jsx  # Card collection, staking, shop
│   │   │   ├── HybridLab.jsx       # Card hybridization lab
│   │   │   ├── SeedCard.jsx        # Card visual component
│   │   │   ├── WeatherHUD.jsx      # Weather/time display
│   │   │   ├── Tutorial.jsx        # 9-step onboarding
│   │   │   └── Notifications.jsx   # Toast notifications
│   │   └── web3/
│   │       └── WalletProvider.jsx  # wagmi + QueryClient + Fuji chain
│   │
│   └── hooks/
│       ├── useWallet.js            # Wallet connect/disconnect/balance
│       └── useGladeContract.js     # Contract calls (faucet, buySeed, claimYield)
│
├── scripts/
│   └── deploy.js                   # Hardhat deployment to Fuji
├── docs/
│   ├── architecture.md             # System design + data flow
│   └── economy-whitepaper.md       # RWA model + card economy
├── hardhat.config.cjs              # Hardhat config (Fuji testnet)
└── .env.example                    # Template for environment variables
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| 3D Engine | Three.js + React Three Fiber + Drei |
| UI | React 18 |
| State | Zustand |
| Physics | @react-three/cannon |
| Blockchain | Avalanche C-Chain (Fuji Testnet, 43113) |
| Contracts | Solidity 0.8.27 + OpenZeppelin 5.x |
| Web3 | wagmi + viem (injected connector) |
| Build | Vite |
| Deploy | Vercel (frontend), Hardhat (contracts) |

### Key Store Actions (gameStore.js)

| Action | Description |
|--------|-------------|
| `buySeed(plotId, cropType)` | Buy seed with 75/25 split |
| `plantWithCard(plotId, cardId)` | Plant using a card (75/25 + card modifiers) |
| `harvestPlant(plotId)` | Harvest ready plant (applies health + card multiplier) |
| `buySeedPack(tier)` | Buy basic/premium card pack (100% Game Pool) |
| `hybridizeCards()` | Combine 2 cards into hybrid ($3 * rarity) |
| `stakeCard(cardId)` / `unstakeCard(cardId)` | Stake/unstake Rare+ cards |
| `killPest(pestId)` | Kill pest, earn gUSD reward |
| `updateTimeAndWeather()` | Tick day/night cycle + weather |
| `spawnPest()` / `updatePests()` | Pest lifecycle management |

### Smart Contracts

#### GladeToken (ERC-20)
- Testnet stablecoin (gUSD) simulating USDC
- Built-in faucet: claim 100 gUSD every hour
- Solidity 0.8.27 + OpenZeppelin ERC20 + Ownable

#### GladeFarm (ERC-721 + Game Logic)
- `buySeed()` — Enforces 75/25 split on-chain, mints NFT
- `claimYield()` — Harvests after growth period
- `getEconomyStats()` — Returns RWA/game pool totals
- 4 seed types initialized in constructor

#### Compile & Deploy

```bash
# Compile
npx hardhat compile --config hardhat.config.cjs

# Deploy to Fuji (requires PRIVATE_KEY in .env)
npx hardhat run scripts/deploy.js --network fuji --config hardhat.config.cjs
```

### Environment Variables

```env
# Contract deployment (MetaMask private key for Fuji)
PRIVATE_KEY=your_private_key_here

# Contract addresses (set after deploying)
VITE_GLADE_TOKEN_ADDRESS=0x_deployed_token_address
VITE_GLADE_FARM_ADDRESS=0x_deployed_farm_address
```

### AI Context Files

This repo includes context files for every major AI coding assistant:

| File | AI Tool | Auto-read? |
|------|---------|-----------|
| `CLAUDE.md` | Claude Code | Yes |
| `AI_CONTEXT.md` | Any AI (paste manually) | No |
| `AGENTS.md` | VSCode Copilot, Cline, Aider | Yes |
| `.cursorrules` | Cursor AI | Yes |
| `.github/copilot-instructions.md` | GitHub Copilot | Yes |
| `.windsurfrules` | Windsurf AI | Yes |

---

## Why Avalanche?

- **Sub-second finality** for real-time gaming
- **Low fees** ($0.01/tx) make micro-transactions viable
- **Growing RWA ecosystem** (Securitize, Ondo, Avalanche Evergreen)
- **Subnet/L1 capability** for dedicated game chain
- **EVM compatible** — standard Solidity tooling

## Documentation

- [Architecture](docs/architecture.md) — System design, contract details, data flow
- [Economy Whitepaper](docs/economy-whitepaper.md) — RWA model, yield mechanics, card economy
- [AI Context](AI_CONTEXT.md) — Full project context for any AI assistant

## Roadmap

| Stage | Date | Status | Focus |
|-------|------|--------|-------|
| 1. Idea | Feb 25 | ✅ Done | 1-min pitch video |
| 2. MVP | Mar 9 | ✅ Done | Functional prototype + wallet + contracts |
| 3. GTM | Mar 19 | Upcoming | Full on-chain, ERC-1155, marketplace, Chainlink |
| 4. Finals | Mar 27 | Upcoming | Live showcase, polished UX, L1 proposal |

## Security

Smart contracts are **not audited**. This is a prototype for Avalanche Build Games 2026. Do not use with real funds.

## Team

| Role | Person | Focus |
|------|--------|-------|
| Lead Dev / Web3 | Juan ([@Cyber_paisa](https://github.com/Cyberpaisa)) | Smart contracts, integration, architecture |
| Game Designer | Daniel | Economy design, coordination, documentation |
| Game Dev | Anthony | Visual/3D, Unity migration (Stage 3+) |
| Web3 Dev | Josue/Kevin | Smart contracts, testing |
| Backend | John | API, deployment, infrastructure |

Built for [Avalanche Build Games 2026](https://build.avax.network/build-games)

## License

MIT
