# GLADE — AI Coding Instructions

## Project Identity
GLADE is a browser-based 3D farming game on Avalanche C-Chain where every seed purchase
is backed by Real World Assets via an automatic 75/25 smart contract split.
Built for Avalanche Build Games 2026 ($1M prize pool).

## For COMPLETE context, read `CLAUDE.md` in project root.
It contains: architecture diagram, file structure with purposes, economy model,
all crop/card configurations, technical decisions, 12 lessons learned, roadmap,
and explicit AI instructions with common task guides.

## Quick Reference

### Stack
React 18, React Three Fiber, Zustand, wagmi, viem, Vite, Hardhat, Solidity 0.8.20

### Chain
Avalanche Fuji Testnet | Chain ID: 43113 | RPC: https://api.avax-test.network/ext/bc/C/rpc

### Critical Files
| File | Purpose |
|---|---|
| `CLAUDE.md` | Full AI context — read this first |
| `src/store/gameStore.js` | Game state, economy, all actions |
| `src/contracts/GladeFarm.sol` | Core contract: buySeed(75/25), claimYield |
| `src/hooks/useGladeContract.js` | Frontend ↔ blockchain bridge |
| `src/components/environment/FarmPlot.jsx` | Interactive 3D farm plots |
| `src/components/ui/GameUI.jsx` | Main HUD |

### Coding Conventions
- React functional components with hooks only
- Zustand for state (no Redux, no Context API for game state)
- CSS variables in src/styles.css (no Tailwind)
- ESM imports (package.json has "type": "module")
- Hardhat config is .cjs (CommonJS required by Hardhat)
- Contract ABIs in artifacts/ after compile
- Frontend env vars MUST start with VITE_

### Economy (NEVER change without approval)
- buySeed: 75% → RWA Pool, 25% → Game Pool
- Coffee: $10 cost, $0.80/mo yield, 30s growth
- Cacao: $15 cost, $1.20/mo yield, 35s growth
- Vineyard: $25 cost, $2.10/mo yield, 45s growth
- Solar: $50 cost, $4.50/mo yield, 60s growth
- Card packs: $2 basic, $6 premium → 100% Game Pool
