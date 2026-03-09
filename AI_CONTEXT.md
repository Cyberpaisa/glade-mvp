# AI_CONTEXT.md — GLADE Project Intelligence
# ═══════════════════════════════════════════
# 
# 📋 HOW TO USE THIS FILE:
#
# IF you're an AI reading this automatically (Claude Code, VSCode Copilot,
# Cursor, Windsurf) → proceed, you have full context below.
#
# IF you're a DEVELOPER pasting this into ChatGPT, Gemini, Grok,
# Perplexity, or any other AI chat:
#   1. Copy this ENTIRE file
#   2. Paste it as the FIRST message in your conversation
#   3. Then ask your question
#   4. The AI will have full context of the project
#
# IF you're a DEVELOPER starting a NEW AI coding session:
#   Paste this and say: "Read this context. Then help me with [your task]"
#
# Last updated: 2026-03-09
# ═══════════════════════════════════════════

## 🧠 WHAT IS THIS PROJECT?

**GLADE** — "Where Digital Farming Becomes Real Yield"

A browser-based 3D farming game on Avalanche blockchain. The innovation:
when a player buys a seed, the smart contract AUTOMATICALLY splits the payment
75% to a Real World Asset fund and 25% to the game economy. Yields come from
real productive assets (coffee farms, vineyards, solar panels), NOT from new
players entering. This solves the Ponzi death spiral of Play-to-Earn games.

**Competition:** Avalanche Build Games 2026 ($1M prize pool)
**Stage:** MVP (Stage 2)
**Team:** @Cyber_paisa (Juan, lead), Daniel (design), Anthony (game dev), Josué/Kevin (web3)
**Repo:** https://github.com/Cyberpaisa/glade-mvp

## 🔧 TECH STACK

| Layer | Technology | Why |
|---|---|---|
| 3D Engine | Three.js + React Three Fiber | Fast iteration, small bundle, native web |
| UI | React 18 | Component-based, hooks |
| State | Zustand | Simple, fast, perfect for game state |
| Web3 | wagmi + viem | React hooks for wallet, Avalanche support |
| Blockchain | Avalanche C-Chain (Fuji Testnet 43113) | Low fees, fast finality, RWA ecosystem |
| Contracts | Solidity 0.8.20 + OpenZeppelin | Industry standard, auditable |
| Build Tool | Vite | Fastest dev server |
| Contract Tool | Hardhat | JS-native, team familiar |
| Deploy | Vercel (frontend), Hardhat (contracts) | Free tier, fast |

## 🏗️ ARCHITECTURE

```
BROWSER (React + Vite)
├── Three.js / R3F → 3D farm world (9 plots, trees, barn, windmill)
├── Zustand Store → Game state (economy, plots, cards, weather, pests)
└── wagmi/viem → Wallet + contract calls
         │
         │ JSON-RPC
         ▼
AVALANCHE FUJI TESTNET (Chain ID 43113)
├── GladeToken.sol (ERC-20 "gUSD") → claimFaucet(), balanceOf()
└── GladeFarm.sol (ERC-721 + Game) → buySeed(75/25 split), claimYield()
```

## 📁 KEY FILES (Where to find what)

```
glade-mvp/
├── CLAUDE.md                    ← Full AI context (Claude Code reads this)
├── AGENTS.md                    ← VSCode Copilot agent context
├── AI_CONTEXT.md                ← THIS FILE (universal, paste into any AI)
├── .cursorrules                 ← Cursor AI auto-reads
├── .github/copilot-instructions.md ← GitHub Copilot auto-reads
├── .windsurfrules              ← Windsurf AI auto-reads
│
├── src/
│   ├── store/gameStore.js       ← ⭐ THE BRAIN: all game state & economy logic
│   ├── store/seedCards.js       ← Card system (rarities, traits, hybridization)
│   ├── contracts/
│   │   ├── GladeToken.sol       ← ERC-20 with faucet
│   │   └── GladeFarm.sol        ← ⭐ CORE: buySeed(75/25) + claimYield + ERC-721
│   ├── hooks/
│   │   ├── useWallet.js         ← Wallet connect (wagmi)
│   │   └── useGladeContract.js  ← ⭐ Frontend ↔ contract bridge
│   ├── components/
│   │   ├── environment/         ← 3D world (FarmPlot, Trees, Decorations, Effects)
│   │   ├── ui/                  ← HUD (GameUI, PlantMenu, YieldDashboard, Cards)
│   │   └── web3/WalletProvider.jsx ← wagmi config for Fuji
│   ├── App.jsx                  ← Root: Canvas + UI overlays + game loop
│   ├── Experience.jsx           ← 3D scene: ground, sky, physics, plots
│   └── styles.css               ← All styling (CSS variables)
│
├── scripts/deploy.js            ← Hardhat deploy to Fuji
├── hardhat.config.cjs           ← Hardhat config (CommonJS, Fuji network)
└── docs/
    ├── architecture.md
    └── economy-whitepaper.md
```

## 💰 ECONOMY MODEL (Sacred — do NOT change without approval)

### The 75/25 Split (Core Innovation)
```
Player buys $10 Coffee seed
  → Smart contract automatically splits:
     $7.50 (75%) → RWA Pool (invested in real coffee farm)
     $2.50 (25%) → Game Pool (in-game economy)
  → Player gets NFT (ERC-721) representing ownership
  → Real coffee farm generates yield
  → Smart contract distributes yield to NFT holder
```

### Crop Types
| Crop | Cost | RWA (75%) | Game (25%) | Yield/month | Growth (demo) |
|---|---|---|---|---|---|
| ☕ Coffee | $10 | $7.50 | $2.50 | $0.80 | 30s |
| 🫘 Cacao | $15 | $11.25 | $3.75 | $1.20 | 35s |
| 🍇 Vineyard | $25 | $18.75 | $6.25 | $2.10 | 45s |
| ☀️ Solar | $50 | $37.50 | $12.50 | $4.50 | 60s |

### Card System
| Rarity | Basic Pack ($2) | Premium Pack ($6) | Staking Yield |
|---|---|---|---|
| Common | 85% | 60% | — |
| Rare | 12% | 30% | 1%/tick |
| Epic | 2.5% | 8% | 3%/tick |
| Legendary | 0.5% | 2% | 5%/tick |

### Money Flow Rules
- buySeed() → 75% RWA + 25% Game (on-chain split)
- Card packs → 100% Game Pool
- Pest kill rewards ($0.10-$0.25) → from Game Pool
- Staking rewards → from Game Pool
- Hybridization ($3 * rarity) → to Game Pool
- Player starts with: $100 gUSD (testnet)

## 📊 CURRENT STATUS

### What's DONE ✅
- 3D farm environment (9 interactive plots, trees, barn, windmill, solar panels, day/night)
- Full gameplay: plant → grow (4 visual stages) → harvest (health + card modifiers)
- Card system: packs ($2/$6), 4 rarities, 8 traits, hybridization lab, staking
- Weather: sun, rain (1.5x growth), drought (0.5x), storm (damage) + visual FX
- Pests: 3 types, click-to-kill, earn gUSD from game pool
- Tutorial: 9-step onboarding with localStorage persistence
- WASD player character with physics
- Smart contracts: GladeToken.sol + GladeFarm.sol (written & compiled with Hardhat)
- Wallet connect: real MetaMask via wagmi (injected connector), shows address + AVAX balance
- Contract hooks: useGladeContract (faucet, buySeed, claimYield) — activate when deployed
- Frontend deployed: glade-mvp.vercel.app
- Documentation: README (player+dev guide), Whitepaper v2, Architecture v2
- GitHub releases: v1.0.0 (full game), v2.0.0 (wallet + contracts)

### What's PENDING ⚠️
- Deploy contracts to Avalanche Fuji (need PRIVATE_KEY in .env)
- Record 5-min video walkthrough

### What's MOCKUP (honest)
- RWA Pool: numbers in UI, no real asset backing (OK for prototype)
- Yield: simulated with timers (real would need Chainlink oracle)
- On-chain TX: only works if VITE_GLADE_* env vars are set with deployed contract addresses

## 📝 LESSONS LEARNED (Reference these when debugging)

1. wagmi v2 requires WagmiProvider wrapping entire app
2. Hardhat config MUST be .cjs (CommonJS) because package.json is "type": "module"
3. After `npx hardhat compile`, ABIs are in artifacts/src/contracts/*.sol/*.json
4. VITE env vars MUST start with VITE_ or frontend can't access them
5. Float32Array for R3F particles must be in useMemo, not render
6. @react-three/cannon usePlane: rotation [-Math.PI/2, 0, 0] for horizontal
7. Zustand: use functional set() when reading current state
8. MetaMask needs manual Fuji network add or wagmi switchChain
9. SnowTrace Fuji TX link: https://testnet.snowtrace.io/tx/{hash}
10. Never commit .env (private keys)
11. OpenZeppelin v5: Ownable constructor takes address: Ownable(msg.sender)
12. Build Games judging: Execution > Innovation > Impact > Usability > Long-term

## 🚀 ROADMAP

**Stage 1 (Feb 25) ✅** — Idea pitch video
**Stage 2 (Mar 9) 🔧** — MVP: functional prototype + contracts + video
**Stage 3 (Mar 19)** — GTM: full on-chain integration, ERC-1155, marketplace, Chainlink oracle
**Stage 4 (Mar 27)** — Finals: live showcase, polished UX, Avalanche L1 proposal

## ⚡ COMMON DEVELOPMENT TASKS

### Add a new crop
1. Add to CROP_TYPES in `src/store/gameStore.js`
2. Add _addSeed() call in `src/contracts/GladeFarm.sol` constructor
3. Recompile: `npx hardhat compile --config hardhat.config.cjs`
4. Redeploy if on testnet

### Add a new UI panel
1. Create `src/components/ui/NewPanel.jsx`
2. Add show/hide boolean to gameStore.js
3. Import and render in `src/App.jsx`
4. Add styles to `src/styles.css`

### Add a 3D element
1. Create `src/components/environment/NewElement.jsx`
2. Import and add to `src/Experience.jsx`
3. Use castShadow/receiveShadow for consistency

### Connect a new contract function
1. Add ABI entry to `src/hooks/useGladeContract.js`
2. Create wrapper function in the hook
3. Call from UI component
4. Show TX hash + SnowTrace link on success

### Deploy to Fuji
```bash
# 1. Edit .env with your private key
# 2. Get AVAX from faucet: https://faucet.avax.network/
npx hardhat compile --config hardhat.config.cjs
npx hardhat run scripts/deploy.js --network fuji --config hardhat.config.cjs
# 3. Copy deployed addresses to .env as VITE_GLADE_TOKEN_ADDRESS and VITE_GLADE_FARM_ADDRESS
# 4. Rebuild: npm run build
# 5. Deploy frontend: vercel --prod
```

## 🔗 IMPORTANT LINKS

- Build Games: https://build.avax.network/build-games
- Fuji Faucet: https://faucet.avax.network/
- Fuji Explorer: https://testnet.snowtrace.io/
- Fuji RPC: https://api.avax-test.network/ext/bc/C/rpc
- wagmi Docs: https://wagmi.sh/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber/
- OpenZeppelin: https://docs.openzeppelin.com/contracts/5.x/
- Free 3D models: https://poly.pizza/ | https://kenney.nl/assets/

## 🤖 INSTRUCTIONS FOR AI

When helping with this project:
1. You now have full context. Don't ask "what's this project about?"
2. The 75/25 split is the core innovation. Protect it.
3. gameStore.js is the brain. Check it first for any logic questions.
4. This is an MVP. Favor shipping over perfection.
5. Avalanche Fuji testnet only (Chain ID 43113).
6. If you create/modify files, tell the developer to update AI_CONTEXT.md status.
7. When suggesting code, follow existing patterns (React hooks, Zustand, R3F).
8. For contract questions, reference GladeFarm.sol — it has the 75/25 logic.

---
*Copy this file into any AI chat for instant project context.*
*Maintained by the GLADE team. Update after every significant change.*
