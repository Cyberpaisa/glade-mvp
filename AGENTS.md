# AGENTS.md — GLADE Project Context for AI Agents
# ═══════════════════════════════════════════════
# VSCode Copilot, Cline, Aider, and any AI agent in VSCode
# reads this file AUTOMATICALLY from project root.
#
# For complete project context, always reference CLAUDE.md
# ═══════════════════════════════════════════════

## Project: GLADE — "Where Digital Farming Becomes Real Yield"

Browser-based 3D farming game on Avalanche C-Chain with RWA-backed economy.
When a player buys a seed, the smart contract splits: 75% → Real World Asset Pool,
25% → Game Economy Pool. Yields come from real assets, not new players.

## Stack
- Frontend: React 18 + React Three Fiber + Zustand + Vite
- Web3: wagmi + viem (Avalanche Fuji Testnet, Chain ID 43113)
- Contracts: Solidity 0.8.20 + OpenZeppelin + Hardhat
- State: Zustand (gameStore.js is the brain of the app)

## Key Files
- `CLAUDE.md` → FULL project context (architecture, economy, status, lessons, roadmap)
- `src/store/gameStore.js` → All game state and economy logic
- `src/store/seedCards.js` → Card system (rarities, traits, hybridization)
- `src/contracts/GladeToken.sol` → ERC-20 gUSD token with faucet
- `src/contracts/GladeFarm.sol` → ERC-721 + buySeed(75/25) + claimYield
- `src/hooks/useGladeContract.js` → Frontend ↔ contract interaction
- `src/hooks/useWallet.js` → Wallet connect via wagmi
- `src/Experience.jsx` → 3D scene manager
- `src/components/environment/FarmPlot.jsx` → Interactive farm plots

## Rules
1. The 75/25 RWA split is SACRED. Never change without explicit approval.
2. This is an MVP for Avalanche Build Games ($1M competition). Ship > Perfect.
3. Frontend env vars MUST start with `VITE_` (Vite requirement).
4. Contract changes require: `npx hardhat compile --config hardhat.config.cjs`
5. Hardhat config is `.cjs` because package.json has `"type": "module"`.
6. Test on Avalanche Fuji (43113), RPC: https://api.avax-test.network/ext/bc/C/rpc
7. Keep bundle small. No heavy deps. Current stack is sufficient.
8. After changes, update `CLAUDE.md` status section.

## Current Status (update this!)
- 3D farm: ✅ Done (day/night, weather FX, WASD player)
- Gameplay (plant/harvest/cards/weather/pests): ✅ Done
- Smart contracts: ✅ Written & compiled (Hardhat)
- Wallet connect (wagmi): ✅ Done (MetaMask, AVAX balance, chain display)
- Contract hooks: ✅ Done (faucet, buySeed, claimYield, TX links)
- Frontend deploy: ✅ Done (glade-mvp.vercel.app)
- Documentation: ✅ Done (README, Whitepaper v2, Architecture v2)
- GitHub releases: ✅ Done (v1.0.0, v2.0.0)
- Contract deployment (Fuji): ⚠️ Pending (need PRIVATE_KEY)
- Video walkthrough: ⚠️ Pending

## Common Tasks
- Add new crop: `gameStore.js` CROP_TYPES + `GladeFarm.sol` _addSeed()
- Add UI panel: create in `src/components/ui/`, state in `gameStore.js`, render in `App.jsx`
- Add 3D element: create in `src/components/environment/`, add to `Experience.jsx`
- Connect contract fn: add ABI to `useGladeContract.js`, call from component
