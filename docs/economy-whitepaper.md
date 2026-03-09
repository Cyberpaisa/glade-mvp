# GLADE Economy Whitepaper v2

## Abstract

GLADE is a 3D farming game on Avalanche C-Chain where every in-game purchase is backed by Real World Assets. Unlike traditional Play-to-Earn games that rely on inflationary tokenomics, GLADE generates yield from actual productive assets — coffee farms, vineyards, solar panels, and cacao plantations.

---

## The Problem

Most Play-to-Earn games suffer from unsustainable tokenomics: rewards are funded by new player deposits (Ponzi dynamics), leading to inevitable collapse when growth slows. The value proposition is circular — players earn because other players join.

## The GLADE Solution: RWA-Backed Yield

GLADE breaks this cycle by anchoring every in-game asset to a real-world productive investment. The smart contract enforces a 75/25 split on every seed purchase:

| Allocation | Percentage | Purpose |
|-----------|-----------|---------|
| RWA Pool | 75% | Invested in real-world productive assets |
| Game Pool | 25% | Funds in-game economy, rewards, packs, staking |

---

## Core Economy

### Currency: gUSD

gUSD is a testnet ERC-20 stablecoin simulating USDC. In production, gUSD would be replaced by actual USDC on Avalanche C-Chain.

- Starting balance: $100 gUSD (demo)
- Faucet: 100 gUSD per hour (testnet only)

### The 75/25 Split

Every seed purchase triggers an automatic split:

```
Player buys Coffee Seed ($10 gUSD)
         │
         ├── 75% ($7.50) ──► RWA Pool
         │                      │
         │                      ├── Invested in coffee farm
         │                      └── Generates $0.80/month real yield
         │
         └── 25% ($2.50) ──► Game Pool
                                │
                                ├── Pest kill rewards ($0.10-$0.25)
                                ├── Staking rewards (Rare+ cards)
                                ├── Card pack purchases ($2/$6)
                                └── Hybridization costs ($3+ gUSD)
```

**Critical rule**: The 75/25 split ONLY applies when planting a seed on a farm plot. All other transactions (packs, hybrids, rewards) use the Game Pool exclusively.

### Asset Classes

| Asset | Cost | RWA (75%) | Game (25%) | Monthly Yield | APY (est.) | Real-World Backing |
|-------|------|-----------|------------|--------------|------------|-------------------|
| Coffee | $10 | $7.50 | $2.50 | $0.80 | ~9.6% | Arabica coffee plantation |
| Cacao | $15 | $11.25 | $3.75 | $1.20 | ~9.6% | Fine cacao plantation |
| Vineyard | $25 | $18.75 | $6.25 | $2.10 | ~10.1% | Fractional vineyard share |
| Solar Panel | $50 | $37.50 | $12.50 | $4.50 | ~10.8% | Solar farm energy credits |

---

## Game Pool Economy

The Game Pool (25% of all seed purchases) funds the entire in-game economy:

### Inflows (money entering Game Pool)

| Source | Amount | Trigger |
|--------|--------|---------|
| Seed purchase (25%) | $2.50 - $12.50 | Every time a player plants |
| Card pack sales | $2 or $6 | 100% goes to Game Pool |
| Hybridization fee | $3+ gUSD | Based on parent card rarity |

### Outflows (money leaving Game Pool)

| Destination | Amount | Trigger |
|-------------|--------|---------|
| Pest kill rewards | $0.10 - $0.25 | Player clicks a pest |
| Staking rewards | 1%-5% per tick | Rare+ cards staked |
| (Future) Seasonal events | Variable | Timed events |

### Sustainability Check

The Game Pool is self-sustaining as long as:
- New seed purchases continue (primary inflow)
- Pack/hybrid purchases supplement the pool
- Outflows (pest/staking) are capped at available balance
- Dashboard shows Game Pool health indicator

---

## Seed Card System

### Acquisition

| Method | Cost | Cards | Pool |
|--------|------|-------|------|
| Basic Pack | $2 gUSD | 1 random card | Game Pool |
| Premium Pack | $6 gUSD | 3 random cards | Game Pool |
| Hybridization | $3+ gUSD | 1 hybrid card | Game Pool |

### Rarity Distribution

| Rarity | Basic Pack Odds | Premium Pack Odds | Color |
|--------|----------------|-------------------|-------|
| Common | 85% | 60% | #888 gray |
| Rare | 12% | 30% | #3498db blue |
| Epic | 2.5% | 8% | #9b59b6 purple |
| Legendary | 0.5% | 2% | #f1c40f gold |

### Card Stats

Each card has 4 stats (scale 1-200):
- **YLD (Yield)**: Multiplies harvest amount
- **SPD (Speed)**: Modifies growth time
- **RES (Resilience)**: Reduces pest/storm damage
- **POT (Potential)**: Affects hybrid offspring quality

### Traits

Cards can have 0-2 traits that modify gameplay:

| Trait | Effect | Positive? |
|-------|--------|-----------|
| Fast Growth | -20% growth time | Yes |
| High Yield | +30% harvest yield | Yes |
| Resilient | Reduced damage from pests/storms | Yes |
| All Weather | Immune to weather growth penalties | Yes |
| Double Harvest | 20% chance of 2x yield | Yes |
| Glowing | Visual glow + point light | Cosmetic |
| Fragile | +50% damage taken | No |
| Slow Growth | +30% growth time | No |

### Planting with Cards

When you plant using a card instead of buying directly:
1. You still pay the base crop cost (75/25 split applies)
2. The card's YLD stat modifies your harvest yield (100 = 1x, 150 = 1.5x)
3. Card traits apply (Double Harvest, All Weather, etc.)
4. The card is consumed (used up)

---

## Hybridization

Players can combine 2 cards in the Hybrid Lab:

### Cost
`$3 gUSD * average_rarity_multiplier`

| Parent Rarities | Multiplier | Cost |
|----------------|------------|------|
| Common + Common | 1x | $3 |
| Common + Rare | 1.5x | $4.50 |
| Rare + Rare | 2x | $6 |
| Rare + Epic | 2.5x | $7.50 |
| Epic + Epic | 3x | $9 |

### Offspring Rules

- Stats are averaged from both parents with random variation (+-20%)
- Traits are inherited with 50% chance from each parent
- New random trait possible (10% chance)
- Rarity can upgrade: ~15% chance to go one tier higher than parents' average
- Hybrid names combine parent strain names (e.g., "CafeCacao" or "VineSolar")

---

## Staking

Cards with Rare rarity or above can be staked to earn passive gUSD:

| Rarity | Yield per Tick | Estimated Daily |
|--------|---------------|----------------|
| Rare | 1% | Varies by Game Pool |
| Epic | 3% | Varies by Game Pool |
| Legendary | 5% | Varies by Game Pool |

- Rewards come from the Game Pool
- Capped at available Game Pool balance
- Cards cannot be used for planting while staked
- Unstake anytime to retrieve card

---

## Weather System

Weather changes daily and affects all growing plants:

| Weather | Growth Modifier | Pest Rate | Special Effect |
|---------|----------------|-----------|----------------|
| Sunny | 1.0x (normal) | Normal | — |
| Rain | 1.5x (faster) | Low | Rain particles visible |
| Drought | 0.5x (slower) | High | — |
| Storm | 0.3x (very slow) | Normal | Lightning flashes, damages plants |

- Cards with "All Weather" trait ignore negative weather modifiers
- Cards with "Resilient" trait take less storm damage
- Check the Weather HUD (top-left) for current conditions

---

## Pest Defense

Three pest types roam the farm:

| Pest | Reward | Damage | Behavior |
|------|--------|--------|----------|
| Oruga (Caterpillar) | $0.10 gUSD | Low | Slow, easy to click |
| Escarabajo (Beetle) | $0.15 gUSD | Medium | Medium speed |
| Langosta (Locust) | $0.25 gUSD | High | Fast, harder to catch |

- Pests spawn periodically (more during drought)
- Click to kill and earn gUSD from Game Pool
- Unattended pests damage nearby plants (reduce health)
- Plant health affects harvest yield (health% = yield modifier)

---

## Day/Night Cycle

The game features a dynamic day/night cycle:
- Full cycle: ~8 minutes real time
- Dawn → Day → Dusk → Night
- Lighting, sky color, and ambient sound change dynamically
- Weather overlays during storms/rain

---

## Risk Factors

- RWA yields are estimates and may vary with market conditions
- Smart contracts are unaudited (testnet prototype)
- Regulatory considerations for tokenized RWAs
- Custodial risk for off-chain assets
- Game Pool can deplete if outflows exceed inflows

---

## Roadmap

1. **MVP (Current)**: Simulated RWA yields on Fuji testnet, full game mechanics
2. **Phase 2**: Integration with real RWA protocols (Centrifuge, Goldfinch, Ondo)
3. **Phase 3**: Mainnet launch with audited contracts on Avalanche C-Chain
4. **Phase 4**: Dedicated Avalanche L1 for GLADE ecosystem
5. **Phase 5**: Mobile app, multiplayer farms, seasonal events

---

## Avalanche C-Chain Advantages

- Low fees (~$0.01 per transaction) — viable for micro-transactions
- Fast finality (~2 seconds) — real-time gaming experience
- EVM compatible — standard Solidity, wagmi, viem tooling
- Growing RWA ecosystem (Securitize, Ondo, Avalanche Evergreen)
- Subnet/L1 capability for future dedicated game chain
