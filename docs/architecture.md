# GLADE Architecture v2

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React 18 + React Three Fiber + Zustand + @react-three/cannon│
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  3D World    │  │  Game UI     │  │   Web3 Layer       │  │
│  │  Experience  │  │  HUD/Menus   │  │   RainbowKit       │  │
│  │  Physics     │  │  Cards/Lab   │  │   wagmi + viem     │  │
│  │  Weather     │  │  Dashboard   │  │                    │  │
│  │  Player      │  │  Tutorial    │  │                    │  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│              AVALANCHE C-CHAIN (Fuji Testnet)                │
│  ┌──────────────────┐  ┌─────────────────────────────────┐  │
│  │  GladeToken.sol   │  │  GladeFarm.sol                  │  │
│  │  (ERC-20 gUSD)    │  │  (ERC-721 + Game Logic)         │  │
│  │  faucet / mint     │  │  buySeed / claimYield           │  │
│  │                    │  │  75/25 auto-split               │  │
│  └──────────────────┘  └─────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                    RWA ALLOCATION (75%)                       │
│  Coffee farms, vineyards, solar panels, cacao plantations    │
│  Managed by regulated custodian (future: Centrifuge/Ondo)    │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Planting a Seed (Direct Purchase)

```
User clicks plot → PlantMenu opens → Selects crop → buySeed()
  │
  ├── usdcBalance -= crop.costUSD
  ├── rwaPoolTotal += crop.costUSD * 0.75
  ├── gamePoolTotal += crop.costUSD * 0.25
  ├── plot.plant = { type, stage: 'seed', plantedAt, health: 100 }
  └── notification: "Planted {crop} — ${rwa} RWA | ${game} Game"
```

### Planting with a Card

```
User clicks plot → PlantMenu → "Usar Carta" tab → Selects card → plantWithCard()
  │
  ├── Same 75/25 split as direct purchase
  ├── Card stats applied (yieldMult, growthTime)
  ├── Card traits stored on plant
  ├── Card removed from inventory (consumed)
  └── plot.plant = { type, card: { ...cardData }, ... }
```

### Growth Cycle

```
updatePlantGrowth() [called every second]
  │
  ├── For each plant:
  │   ├── elapsed = (now - plantedAt) / 1000
  │   ├── baseGrowth = card ? card.growthTime : config.growthTime
  │   ├── weatherMod = WEATHER_TYPES[weather].growthMod
  │   │   (skipped if card has "allWeather" trait)
  │   ├── adjustedTime = baseGrowth / weatherMod
  │   ├── progress = elapsed / adjustedTime
  │   └── stage = seed (0-25%) → sprout (25-50%) → growing (50-99%) → ready (100%)
  │
  └── Storm damage: health -= 2 (if storm, unless "allWeather")
```

### Harvest

```
User clicks ready plant → harvestPlant()
  │
  ├── baseYield = crop.yieldMonthly
  ├── healthMod = plant.health / 100
  ├── cardYieldMult = card ? card.yieldMultiplier / 100 : 1
  ├── finalYield = baseYield * healthMod * cardYieldMult
  ├── if card has "doubleHarvest" trait → 20% chance of 2x
  ├── usdcBalance += finalYield
  ├── totalEarnings += finalYield
  └── plot.plant = null (cleared)
```

---

## State Management (Zustand)

### Store Structure: `gameStore.js`

```javascript
{
  // Wallet
  walletConnected: false,
  walletAddress: '',

  // Economy
  usdcBalance: 100,
  rwaPoolTotal: 0,
  gamePoolTotal: 0,
  totalEarnings: 0,

  // Farm
  plots: [{ id, position, plant: null }],  // 9 plots in 3x3 grid

  // Time & Weather
  timeOfDay: 0,         // 0-1 day cycle
  weather: 'sunny',     // sunny | rain | drought | storm
  dayCount: 1,

  // Pests
  pests: [],            // { id, type, position, health }
  pestsKilled: 0,

  // Cards
  seedCards: [],         // player's card inventory
  stakedCards: [],       // cards earning passive yield
  stakingRewards: 0,

  // UI State
  showPlantMenu: false,
  showCollection: false,
  showLab: false,
  showYieldDashboard: false,
  showTutorial: true,
  tutorialStep: 0,

  // Player
  playerPosition: [0, 0, 4],
}
```

### Key Constants

```javascript
CROP_TYPES = { coffee, vineyard, solar, cacao }
PEST_TYPES = { oruga, escarabajo, langosta }
WEATHER_TYPES = { sunny, rain, drought, storm }
```

---

## Component Architecture

### 3D Scene (`Experience.jsx`)

```
Experience
├── fog (distance-based)
├── DynamicLighting (day/night + weather)
├── Physics (gravity)
│   ├── Ground (terrain + grass patches)
│   ├── FarmGround (soil area)
│   └── FarmPlot[] (interactive plots)
│       ├── PlantMesh (seed → sprout → growing → ready)
│       ├── GrowthProgress (HTML progress bar)
│       └── HealthBar (HTML health indicator)
├── Fence (wooden fence posts)
├── Trees (procedural trees)
├── Decorations (barn, windmill, solar panels, scarecrow)
├── FarmSign (entrance sign)
├── Player (WASD character with capsule physics)
├── Pests (click-to-kill 3D bugs)
├── WeatherSystem (rain particles, storm lightning)
├── FloatingParticles (ambient particles)
├── Butterflies (animated butterflies)
└── OrbitControls (camera control)
```

### UI Layer (`App.jsx`)

```
App
├── Canvas (3D scene)
│   └── Experience
├── GameUI (HUD overlay)
│   ├── Balance display
│   ├── Action buttons (Dashboard, Cards, Lab, ?)
│   ├── Pest counter
│   └── Staking indicator
├── PlantMenu (seed purchase modal)
├── YieldDashboard (portfolio tracker)
├── CardCollection (cards, staking, shop)
├── HybridLab (card fusion)
├── WeatherHUD (weather/time display)
├── Tutorial (onboarding modal)
└── Notifications (toast messages)
```

### Game Loops (intervals in App.jsx)

| Loop | Interval | Action |
|------|----------|--------|
| Weather tick | 1000ms | `updateTimeAndWeather()` — day/night + weather change |
| Growth tick | 1000ms | `updatePlantGrowth()` — advance plant stages |
| Pest spawn | 2000ms | `spawnPest()` — create new pests |
| Pest move | 100ms | `updatePests()` — move pests, apply damage |
| Staking | 1000ms | `collectStakingRewards()` — accrue gUSD |

---

## Smart Contracts

### GladeToken.sol (ERC-20)

```solidity
// Testnet stablecoin simulating USDC
function faucet() external              // Claim 100 gUSD (1hr cooldown)
function balanceOf(address) view        // Check balance
function approve(address, uint256)      // Approve GladeFarm to spend
```

### GladeFarm.sol (ERC-721 + Game Logic)

```solidity
function buySeed(uint8 seedType) external  // Buy seed, auto 75/25 split
function claimYield(uint256 tokenId)       // Harvest after growth period
function isReady(uint256 tokenId) view     // Check if harvestable
function getEconomyStats() view            // (rwaTotal, gameTotal, seedCount)
```

### Deployment

```bash
# Compile
npx hardhat compile --config hardhat.config.cjs

# Deploy to Fuji testnet
npx hardhat run scripts/deploy.js --network fuji --config hardhat.config.cjs

# Verify on Snowtrace
npx hardhat verify --network fuji CONTRACT_ADDRESS
```

---

## Card System (`seedCards.js`)

### Generation

```javascript
generateSeedCard(rarity) → {
  id, name, rarity, strainKey, element,
  yieldMultiplier,  // 80-200 (100 = 1x base)
  growthTime,       // modified seconds
  resilience,       // 50-200
  potential,        // 50-200
  traits: [],       // 0-2 traits
  stakingYield,     // 0 (common), 0.01-0.05 (rare+)
}
```

### Hybridization

```javascript
hybridize(cardA, cardB) → {
  // Stats averaged with +-20% variation
  // Traits inherited 50% chance each + 10% new trait
  // Rarity: ~15% chance to upgrade
  // Name: combines parent strains
  isHybrid: true,
  parentStrain: parentA.strainKey,
}
```

---

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| 3D Rendering | Three.js + React Three Fiber | latest |
| UI Framework | React | 18/19 |
| State | Zustand | 5.x |
| Physics | @react-three/cannon | latest |
| Sky/Environment | @react-three/drei | latest |
| Blockchain | Avalanche C-Chain (Fuji) | — |
| Contracts | Solidity + OpenZeppelin | 0.8.20 |
| Web3 Client | wagmi + viem + RainbowKit | latest |
| Build Tool | Vite | 7.x |
| Frontend Deploy | Vercel | — |
| Contract Deploy | Hardhat | — |

---

## Environment Variables

```env
VITE_WALLET_CONNECT_PROJECT_ID=     # WalletConnect project ID
VITE_GLADE_TOKEN_ADDRESS=           # Deployed GladeToken contract
VITE_GLADE_FARM_ADDRESS=            # Deployed GladeFarm contract
```

---

## Future Considerations

- **Code splitting**: Bundle is ~1.7MB; dynamic imports for CardCollection, HybridLab
- **Persistence**: Currently in-memory; add localStorage or backend sync
- **Multiplayer**: Shared farm state via WebSocket or on-chain
- **Mobile**: Touch controls, responsive UI scaling
- **RWA integration**: Centrifuge/Ondo/Goldfinch for real asset tokenization
- **Avalanche L1**: Dedicated subnet for low-latency game transactions
