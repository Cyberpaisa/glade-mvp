# CLAUDE.md — GLADE Project Intelligence File
# ══════════════════════════════════════════════
# This file is the SINGLE SOURCE OF TRUTH for any AI assistant
# (Claude Code, Cursor, Copilot, ChatGPT, etc.) working on this project.
#
# ANY developer opening this project with an AI assistant should
# point the AI to this file FIRST. Claude Code reads it automatically.
#
# Last updated: 2026-03-09
# Updated by: Juan (@Cyber_paisa)
# ══════════════════════════════════════════════

## 🧠 PROJECT IDENTITY

**Name:** GLADE — "Where Digital Farming Becomes Real Yield"
**Type:** Browser-based 3D farming game with RWA-backed economy
**Blockchain:** Avalanche C-Chain (Fuji Testnet for MVP)
**Competition:** Avalanche Build Games 2026 ($1M prize pool)
**Team:** @Cyber_paisa (Juan, lead dev), Daniel (Game Designer/Economist), Anthony (Game Dev), Josué/Kevin (Web3), John (Backend)
**Repo:** https://github.com/Cyberpaisa/glade-mvp
**Live:** glade-mvp.vercel.app (when deployed)

## 🎯 CORE THESIS (Never lose sight of this)

Traditional Play-to-Earn games are implicit Ponzi schemes — value depends on
new players entering, not real productivity. When players exit > enter, the
token crashes and the game dies (Axie Infinity, StepN, etc.).

**GLADE solves this with a 75/25 split:**
- When a player buys a seed ($10 Coffee), the smart contract AUTOMATICALLY splits:
  - 75% ($7.50) → RWA Pool (invested in real coffee farms, vineyards, solar panels)
  - 25% ($2.50) → Game Pool (in-game economy, rewards, packs)
- Yields come from REAL asset returns, not new player deposits
- If the game dies, players still own productive assets generating yield

**This is the #1 differentiator. Every feature, design decision, and
technical choice must serve this thesis.**

## 📊 CURRENT STATUS

### Stage: MVP (Build Games Stage 2)
### Completion: ~95%

| Component | Status | Notes |
|---|---|---|
| 3D Farm Environment | ✅ Done | React Three Fiber, 9 plots, trees, barn, windmill, solar panels, day/night |
| Plant/Harvest Mechanics | ✅ Done | 4 crops, 4 growth stages, progress bars, golden glow, health system |
| Game State (Zustand) | ✅ Done | Full economy sim: buySeed, harvest, cards, weather, pests, staking |
| Card System | ✅ Done | Packs ($2/$6), rarities, 8 traits, staking, hybrid lab |
| Weather System | ✅ Done | Sun, rain, drought, storm with gameplay effects + visual FX |
| Pest System | ✅ Done | 3 pest types, click-to-kill, gUSD rewards from game pool |
| Tutorial/Onboarding | ✅ Done | 9-step tutorial overlay with localStorage persistence |
| Smart Contracts (Solidity) | ✅ Compiled | GladeToken.sol (ERC-20) + GladeFarm.sol (ERC-721 + 75/25) |
| Wallet Connect (wagmi) | ✅ Done | Direct wagmi (injected), real MetaMask connect, AVAX balance |
| Contract Hooks | ✅ Done | useGladeContract.js — faucet, buySeed, claimYield, approve |
| Frontend ↔ Contract | ✅ Done | PlantMenu calls buySeedOnChain, GameUI has faucet button, TX links to SnowTrace |
| Vercel Deploy | ✅ Done | glade-mvp.vercel.app — auto-deploys from GitHub |
| Contract Deployment (Fuji) | ⚠️ Pending | Contracts compile, need PRIVATE_KEY in .env to deploy |
| Video Walkthrough | ⚠️ Pending | 5 min max showing gameplay + TX on SnowTrace |
| Visual Polish | ✅ Done | Particles, butterflies, fog, day/night, weather FX, WASD player |
| Documentation | ✅ Done | README (player+dev guide), Whitepaper v2, Architecture v2 |
| GitHub Releases | ✅ Done | v1.0.0 (full game), v2.0.0 (wallet + contracts) |

### What's REAL vs MOCKUP right now:
- ✅ REAL: 3D farm, full gameplay loop, card system, weather, pests, tutorial, staking
- ✅ REAL: Smart contracts (compiled, ready to deploy on Fuji)
- ✅ REAL: Wallet connect (MetaMask via wagmi, shows address + AVAX balance)
- ✅ REAL: Contract hooks (faucet, buySeed, claimYield — activate when contracts deployed)
- ⚠️ PENDING: Contract deploy (need PRIVATE_KEY + AVAX on Fuji)
- ⚠️ MOCKUP: RWA Pool (numbers in UI, no real asset backing — OK for prototype)

## 🏗️ ARCHITECTURE

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

## 📁 FILE STRUCTURE (What goes where)

```
glade-mvp/
├── CLAUDE.md                    ← YOU ARE HERE. AI reads this first.
├── .cursorrules                 ← Symlink/copy of CLAUDE.md for Cursor AI
├── index.html                   ← Entry HTML
├── vite.config.js               ← Vite config (React plugin)
├── hardhat.config.cjs           ← Hardhat config (Fuji testnet)
├── package.json                 ← Dependencies (type: "module")
├── .env                         ← PRIVATE_KEY, VITE_GLADE_* addresses (NEVER commit)
├── .env.example                 ← Template for .env
├── .gitignore                   ← node_modules, dist, .env, cache, artifacts
├── README.md                    ← Public-facing docs
├── LICENSE                      ← MIT
│
├── src/
│   ├── main.jsx                 ← Entry: wraps App in WalletProvider
│   ├── App.jsx                  ← Canvas + KeyboardControls + UI overlays + game loop
│   ├── Experience.jsx           ← 3D scene: ground, sky, lighting, physics, plots
│   ├── styles.css               ← All UI styles (CSS variables, HUD, menus, notifications)
│   │
│   ├── store/
│   │   ├── gameStore.js         ← ⭐ MAIN STATE: economy, plots, cards, weather, pests
│   │   └── seedCards.js         ← Card generation, traits, hybridization logic
│   │
│   ├── contracts/
│   │   ├── GladeToken.sol       ← ERC-20 with faucet (gUSD stablecoin sim)
│   │   └── GladeFarm.sol        ← ERC-721 + buySeed(75/25) + claimYield
│   │
│   ├── components/
│   │   ├── environment/         ← 3D world
│   │   │   ├── FarmPlot.jsx     ← ⭐ Interactive plots: click→buy/harvest, growth viz
│   │   │   ├── Trees.jsx        ← Procedural trees + coffee trees
│   │   │   ├── Decorations.jsx  ← Barn, windmill, solar panels, flowers
│   │   │   ├── FarmSign.jsx     ← "GLADE — Real Yield Farm" entrance sign
│   │   │   ├── Effects.jsx      ← Floating particles, butterflies
│   │   │   ├── DynamicLighting.jsx  ← Day/night cycle
│   │   │   ├── Player.jsx       ← WASD character controller
│   │   │   ├── Pests.jsx        ← 3D pest meshes, click-to-kill
│   │   │   └── WeatherSystem.jsx ← Rain, storms, lightning FX
│   │   │
│   │   ├── ui/                  ← HUD and menus
│   │   │   ├── GameUI.jsx       ← ⭐ Main HUD: balance, RWA pool, wallet btn
│   │   │   ├── PlantMenu.jsx    ← ⭐ Seed purchase modal + plant-with-card
│   │   │   ├── YieldDashboard.jsx ← Portfolio: RWA pool, game pool, yield stats
│   │   │   ├── CardCollection.jsx ← Card grid, staking, pack shop
│   │   │   ├── HybridLab.jsx    ← Combine 2 cards → hybrid
│   │   │   ├── SeedCard.jsx     ← Card visual component
│   │   │   ├── WeatherHUD.jsx   ← Weather + time display
│   │   │   ├── Tutorial.jsx     ← 9-step onboarding
│   │   │   └── Notifications.jsx ← Toast notifications
│   │   │
│   │   └── web3/
│   │       └── WalletProvider.jsx ← wagmi + QueryClient + Fuji chain config
│   │
│   └── hooks/
│       ├── useWallet.js          ← useAccount, useConnect, useDisconnect wrapper
│       └── useGladeContract.js   ← ⭐ claimFaucet, buySeedOnChain, claimYield
│
├── scripts/
│   └── deploy.js                ← Hardhat deploy: GladeToken → GladeFarm
│
└── docs/
    ├── architecture.md          ← System design details
    └── economy-whitepaper.md    ← RWA model, yield mechanics, tokenomics
```

## 💰 ECONOMY MODEL (Critical — do not break these numbers)

### Crop Types (defined in gameStore.js CROP_TYPES)
| Key | Name | Cost | RWA (75%) | Game (25%) | Yield/mo | Growth (demo) |
|---|---|---|---|---|---|---|
| coffee | Café Colombiano | $10 | $7.50 | $2.50 | $0.80 | 30s |
| cacao | Cacao | $15 | $11.25 | $3.75 | $1.20 | 35s |
| vineyard | Viñedo | $25 | $18.75 | $6.25 | $2.10 | 45s |
| solar | Panel Solar | $50 | $37.50 | $12.50 | $4.50 | 60s |

### Card Rarities (defined in seedCards.js)
| Rarity | Basic Pack Odds | Premium Pack Odds | Staking Yield |
|---|---|---|---|
| Common | 85% | 60% | — |
| Rare | 12% | 30% | 1%/tick |
| Epic | 2.5% | 8% | 3%/tick |
| Legendary | 0.5% | 2% | 5%/tick |

### Money Flows
- buySeed() → 75% rwaPool + 25% gamePool (ON-CHAIN split)
- Card packs ($2/$6) → 100% gamePool
- Pest rewards ($0.10-$0.25) → from gamePool
- Staking rewards → from gamePool
- Hybridization cost ($3 * rarity) → to gamePool

### Player starts with: $100 gUSD (testnet play money)

## 🔧 TECHNICAL DECISIONS & WHY

| Decision | Why |
|---|---|
| React Three Fiber over Unity WebGL | Faster iteration (seconds vs minutes), smaller bundle, native React/Web3 integration |
| Zustand over Redux | Less boilerplate, simpler API, perfect for game state |
| wagmi over ethers.js direct | React hooks for wallet, type-safe, built-in Avalanche support |
| Hardhat over Foundry | Team is more familiar with JS tooling |
| Vite over CRA/Next | Fastest dev server, ESM native, simple config |
| CSS variables over Tailwind | Smaller bundle, game UI needs custom styling not utility classes |
| ERC-721 for seeds over ERC-1155 | Simpler for MVP. Migrate to ERC-1155 in Stage 3 for efficiency |
| Procedural 3D over GLB models | Faster to iterate, no asset pipeline. GLB models can replace later |
| Fuji testnet over local | Judges need to verify TXs on SnowTrace |

## 📝 LESSONS LEARNED (Add to this as we go)

1. **wagmi v2 requires WagmiProvider wrapping the entire app** — don't try to use hooks outside provider
2. **Hardhat config must be .cjs (CommonJS)** because package.json has "type": "module"
3. **Contract ABIs**: After `npx hardhat compile`, ABIs are in `artifacts/src/contracts/ContractName.sol/ContractName.json`
4. **VITE env vars MUST start with VITE_** or they won't be available in frontend
5. **Float32Array in R3F**: When creating particle systems, array must be created in useMemo, not in render
6. **@react-three/cannon usePlane**: rotation must be [-Math.PI/2, 0, 0] for horizontal ground
7. **Zustand set()**: Always use functional form `set(state => ({...}))` when reading current state
8. **MetaMask on Fuji**: Users need to add network manually or use wagmi's switchChain
9. **SnowTrace Fuji**: https://testnet.snowtrace.io/tx/{hash} — use this URL format for TX links
10. **Never commit .env** — private keys go there. Always check .gitignore
11. **OpenZeppelin v5**: constructor for Ownable takes address param: `Ownable(msg.sender)`
12. **Build Games judging**: Execution > Innovation > Impact > Usability > Long-term potential

## 🚀 ROADMAP

### ✅ Stage 1: Idea (Feb 25) — COMPLETED
- 1-min video pitch
- Core concept: RWA-backed farming game

### 🔧 Stage 2: MVP (Mar 9) — NEARLY COMPLETE
- [x] 3D farm environment (day/night, weather FX, WASD player)
- [x] Plant/harvest gameplay (health, card modifiers, double harvest)
- [x] Card system (packs, rarities, 8 traits, hybrid lab, staking)
- [x] Weather + pests (4 weather types, 3 pest types, rewards)
- [x] Smart contracts written + compiled (Hardhat)
- [x] Tutorial/onboarding (9 steps, localStorage)
- [x] Wallet connect REAL (wagmi, MetaMask, AVAX balance)
- [x] Contract hooks (faucet, buySeed, claimYield on-chain)
- [x] Deploy frontend to Vercel (glade-mvp.vercel.app)
- [x] Documentation (README, Whitepaper v2, Architecture v2)
- [x] GitHub releases (v1.0.0, v2.0.0)
- [ ] Deploy contracts to Fuji (need PRIVATE_KEY) ← MANUAL
- [ ] 5-min video walkthrough ← MANUAL

### 📋 Stage 3: GTM & Vision (Mar 19)
- [ ] Full wagmi integration (all actions on-chain)
- [ ] ERC-1155 migration for gas efficiency
- [ ] Chainlink oracle for real asset price feeds
- [ ] Marketplace (trade crops/cards between players)
- [ ] Go-to-market strategy document
- [ ] Pitch deck

### 🏆 Stage 4: Finals (Mar 27)
- [ ] Live showcase presentation
- [ ] Polished UI/UX
- [ ] Real RWA integration research (SPV, legal structure)
- [ ] Avalanche L1 subnet proposal for dedicated game chain

## 🤖 INSTRUCTIONS FOR AI ASSISTANTS

When working on this project, follow these rules:

1. **Read this file first.** It has everything you need.
2. **The 75/25 split is sacred.** Never change the economic model without explicit approval.
3. **Don't overengineer.** This is an MVP for a competition. Ship > Perfect.
4. **Avalanche Fuji testnet only.** Chain ID 43113. RPC: https://api.avax-test.network/ext/bc/C/rpc
5. **Test in browser.** This is a web game. Everything must work in Chrome/Firefox.
6. **Keep bundle small.** No heavy libraries. React Three Fiber + Zustand + wagmi is the stack.
7. **If adding features, update this file.** Keep CLAUDE.md as the single source of truth.
8. **Smart contract changes require recompile + redeploy.** Run `npx hardhat compile --config hardhat.config.cjs`
9. **Frontend env vars start with VITE_**. Other vars won't be available in browser.
10. **When in doubt, check gameStore.js** — it's the brain of the application.

### Common tasks:

**Add a new crop type:**
→ Add to CROP_TYPES in src/store/gameStore.js
→ Add to _addSeed() in src/contracts/GladeFarm.sol constructor
→ Recompile + redeploy contracts

**Add a new UI panel:**
→ Create in src/components/ui/NewPanel.jsx
→ Add show/hide state to gameStore.js
→ Import and render in src/App.jsx
→ Style in src/styles.css

**Add a new 3D element:**
→ Create in src/components/environment/NewElement.jsx
→ Import and add to Experience.jsx
→ Use castShadow/receiveShadow for visual consistency

**Connect a new contract function:**
→ Add ABI entry to src/hooks/useGladeContract.js
→ Add wrapper function in the hook
→ Call from UI component

## 👥 TEAM CONTACTS

| Role | Person | Focus |
|---|---|---|
| Lead Dev / Web3 | Juan (@Cyber_paisa) | Smart contracts, integration, architecture |
| Game Designer | Daniel | Economy design, coordination, documentation |
| Game Dev | Anthony | Visual/3D, Unity migration (Stage 3+) |
| Web3 Dev | Josué/Kevin | Smart contracts, testing |
| Backend | John | API, deployment, infrastructure |

## 📎 IMPORTANT LINKS

- **Build Games Portal:** https://build.avax.network/build-games
- **Fuji Faucet:** https://faucet.avax.network/
- **Fuji Explorer:** https://testnet.snowtrace.io/
- **Fuji RPC:** https://api.avax-test.network/ext/bc/C/rpc
- **OpenZeppelin Contracts:** https://docs.openzeppelin.com/contracts/5.x/
- **wagmi Docs:** https://wagmi.sh/
- **React Three Fiber:** https://docs.pmnd.rs/react-three-fiber/
- **Avalanche Docs:** https://docs.avax.network/
- **Poly Pizza (free 3D models):** https://poly.pizza/
- **Kenney Assets (CC0):** https://kenney.nl/assets/

---
*This file is maintained by the team and should be updated after every significant change.*
*Any AI assistant reading this: you now have full context. Build with confidence.*
