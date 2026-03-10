import { create } from 'zustand'
import { generateSeedCard, hybridize, getHybridCost, RARITY, TRAITS, BASE_STRAINS } from './seedCards'

// RWA-backed crop types — each represents a real-world asset class
export const CROP_TYPES = {
  coffee: {
    name: 'Cafe Colombiano',
    emoji: '☕',
    costUSD: 10,
    rwaAllocation: 7.5,
    gameAllocation: 2.5,
    yieldMonthly: 0.80,
    growthTime: 30,
    color: '#6F4E37',
    rwaDescription: 'Planta de cafe arabica en finca colombiana',
    stages: ['seed', 'sprout', 'growing', 'ready']
  },
  vineyard: {
    name: 'Vinedo',
    emoji: '🍇',
    costUSD: 25,
    rwaAllocation: 18.75,
    gameAllocation: 6.25,
    yieldMonthly: 2.10,
    growthTime: 45,
    color: '#722F37',
    rwaDescription: 'Participacion fraccionada en vinedo',
    stages: ['seed', 'sprout', 'growing', 'ready']
  },
  solar: {
    name: 'Panel Solar',
    emoji: '☀️',
    costUSD: 50,
    rwaAllocation: 37.5,
    gameAllocation: 12.5,
    yieldMonthly: 4.50,
    growthTime: 60,
    color: '#1a73e8',
    rwaDescription: 'Fraccion de panel solar en granja energetica',
    stages: ['seed', 'sprout', 'growing', 'ready']
  },
  cacao: {
    name: 'Cacao',
    emoji: '🫘',
    costUSD: 15,
    rwaAllocation: 11.25,
    gameAllocation: 3.75,
    yieldMonthly: 1.20,
    growthTime: 35,
    color: '#3E2723',
    rwaDescription: 'Planta de cacao fino de aroma',
    stages: ['seed', 'sprout', 'growing', 'ready']
  }
}

// Pest types
export const PEST_TYPES = [
  { name: 'Oruga', color: '#8bc34a', speed: 0.015, damage: 10, reward: 0.10 },
  { name: 'Escarabajo', color: '#4a2800', speed: 0.01, damage: 15, reward: 0.15 },
  { name: 'Langosta', color: '#cddc39', speed: 0.025, damage: 20, reward: 0.25 },
]

// Weather types
export const WEATHER_TYPES = {
  sunny:   { name: 'Soleado',  growthMod: 1.0, pestChance: 0.02 },
  rain:    { name: 'Lluvia',   growthMod: 1.5, pestChance: 0.01 },
  drought: { name: 'Sequia',   growthMod: 0.5, pestChance: 0.04 },
  storm:   { name: 'Tormenta', growthMod: 0.3, pestChance: 0.0  },
}

const createEmptyPlots = () => {
  const plots = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      plots.push({
        id: `plot-${row}-${col}`,
        row, col,
        plant: null,
        position: [col * 3 - 3, 0.05, row * 3 - 3]
      })
    }
  }
  return plots
}

let pestIdCounter = 0

export const useGameStore = create((set, get) => ({
  // Wallet
  walletConnected: false,
  walletAddress: null,

  // Economy (gUSD)
  usdcBalance: 100,
  rwaPoolTotal: 0,
  gamePoolTotal: 0,
  accumulatedYield: 0,

  // Farm
  plots: createEmptyPlots(),
  selectedPlotId: null,
  selectedCropType: 'coffee',

  // Weather & Time
  weather: 'sunny',
  timeOfDay: 0,
  dayCount: 1,

  // Pests
  pests: [],
  pestsKilled: 0,

  // Card collection
  seedCards: [],
  selectedCardForPlant: null,
  showCollection: false,
  showLab: false,
  labCardA: null,
  labCardB: null,

  // Staking
  stakedCards: [],
  stakingRewards: 0,

  // Tutorial
  showTutorial: !localStorage.getItem('glade_tutorial_done'),
  tutorialStep: 0,

  // Player
  playerPosition: [0, 0, 10],

  // UI
  showPlantMenu: false,
  showYieldDashboard: false,
  notifications: [],
  totalPlanted: 0,
  totalHarvested: 0,

  // === ACTIONS ===

  // Wallet
  setWalletConnected: (address) => set({ walletConnected: true, walletAddress: address }),
  setWalletDisconnected: () => set({ walletConnected: false, walletAddress: null }),

  // Player
  setPlayerPosition: (pos) => set({ playerPosition: pos }),

  // Plot selection
  selectPlot: (plotId) => {
    const plot = get().plots.find(p => p.id === plotId)
    if (plot && !plot.plant) set({ selectedPlotId: plotId, showPlantMenu: true })
  },
  setSelectedCropType: (type) => set({ selectedCropType: type }),
  closePlantMenu: () => set({ showPlantMenu: false, selectedPlotId: null, selectedCardForPlant: null }),
  toggleYieldDashboard: () => set(s => ({ showYieldDashboard: !s.showYieldDashboard })),

  // Buy seed (direct, no card) — 75/25 split applies
  // skipLocalBalance: true when on-chain tx handles payment (wallet connected)
  buySeed: (plotId, cropType, skipLocalBalance = false) => {
    const state = get()
    const crop = CROP_TYPES[cropType]
    if (!crop) return false
    if (!skipLocalBalance && state.usdcBalance < crop.costUSD) return false
    const plot = state.plots.find(p => p.id === plotId)
    if (!plot || plot.plant) return false

    set({
      usdcBalance: skipLocalBalance ? state.usdcBalance : state.usdcBalance - crop.costUSD,
      rwaPoolTotal: state.rwaPoolTotal + crop.rwaAllocation,
      gamePoolTotal: state.gamePoolTotal + crop.gameAllocation,
      totalPlanted: state.totalPlanted + 1,
      showPlantMenu: false,
      selectedPlotId: null,
      plots: state.plots.map(p =>
        p.id === plotId
          ? { ...p, plant: { type: cropType, plantedAt: Date.now(), stage: 'seed', health: 100, card: null } }
          : p
      ),
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `${crop.emoji} Compraste ${crop.name} — $${crop.rwaAllocation} RWA | $${crop.gameAllocation} Game`,
        type: 'buy'
      }]
    })
    return true
  },

  // Plant with card — 75/25 split on base crop cost, card modifies yield
  plantWithCard: (plotId, cardId) => {
    const state = get()
    const card = state.seedCards.find(c => c.id === cardId)
    if (!card) return false

    const plot = state.plots.find(p => p.id === plotId)
    if (!plot || plot.plant) return false

    // Determine which RWA crop this card maps to
    const cropKey = card.isHybrid ? (card.parentStrain || 'coffee') : card.strainKey
    const crop = CROP_TYPES[cropKey]
    if (!crop) return false

    if (state.usdcBalance < crop.costUSD) return false

    // Apply trait modifiers
    let growthTime = card.stats.growthTime
    let yieldMult = card.stats.yield / 100 // percentage to multiplier
    let pestResist = 1.0
    let glows = false

    for (const traitKey of card.traits) {
      const trait = TRAITS[traitKey]
      if (!trait) continue
      if (trait.effect.growthMod) growthTime = Math.round(growthTime * trait.effect.growthMod)
      if (trait.effect.yieldMod) yieldMult *= trait.effect.yieldMod
      if (trait.effect.pestResist !== undefined) pestResist = trait.effect.pestResist
      if (trait.effect.glow) glows = true
    }

    set({
      usdcBalance: state.usdcBalance - crop.costUSD,
      rwaPoolTotal: state.rwaPoolTotal + crop.rwaAllocation,
      gamePoolTotal: state.gamePoolTotal + crop.gameAllocation,
      totalPlanted: state.totalPlanted + 1,
      showPlantMenu: false,
      showCollection: false,
      selectedPlotId: null,
      selectedCardForPlant: null,
      seedCards: state.seedCards.filter(c => c.id !== cardId),
      plots: state.plots.map(p =>
        p.id === plotId
          ? {
              ...p,
              plant: {
                type: cropKey,
                plantedAt: Date.now(),
                stage: 'seed',
                health: 100,
                card: { ...card, growthTime, yieldMult, pestResist, glows },
              }
            }
          : p
      ),
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `${crop.emoji} [${RARITY[card.rarity].name}] ${card.name} plantada — $${crop.rwaAllocation} RWA`,
        type: 'buy'
      }]
    })
    return true
  },

  // Harvest plant — applies health + card modifiers
  harvestPlant: (plotId) => {
    const state = get()
    const plot = state.plots.find(p => p.id === plotId)
    if (!plot || !plot.plant || plot.plant.stage !== 'ready') return false
    const crop = CROP_TYPES[plot.plant.type]

    // Health affects yield
    const healthMod = plot.plant.health >= 80 ? 1.0 : plot.plant.health / 100

    // Card rarity multiplier
    const cardYieldMult = plot.plant.card ? plot.plant.card.yieldMult : 1.0

    // Double harvest trait check
    let doubleHarvest = false
    if (plot.plant.card?.traits) {
      const hasDH = plot.plant.card.traits.includes('doubleHarvest')
      if (hasDH && Math.random() < 0.25) doubleHarvest = true
    }

    const baseYield = crop.yieldMonthly * healthMod * cardYieldMult
    const finalYield = Math.round((doubleHarvest ? baseYield * 2 : baseYield) * 100) / 100

    set({
      accumulatedYield: state.accumulatedYield + finalYield,
      usdcBalance: state.usdcBalance + finalYield,
      totalHarvested: state.totalHarvested + 1,
      plots: state.plots.map(p =>
        p.id === plotId ? { ...p, plant: null } : p
      ),
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `💰 ${crop.name} → +$${finalYield.toFixed(2)} gUSD${doubleHarvest ? ' (2x!)' : ''}${plot.plant.card ? ` [${RARITY[plot.plant.card.rarity].name}]` : ''}`,
        type: 'harvest'
      }]
    })
    return true
  },

  // Weather & time
  updateTimeAndWeather: () => {
    const state = get()
    let newTime = state.timeOfDay + 0.002
    let newDay = state.dayCount
    let newWeather = state.weather

    if (newTime >= 1) {
      newTime = 0
      newDay += 1
      const weathers = Object.keys(WEATHER_TYPES)
      newWeather = weathers[Math.floor(Math.random() * weathers.length)]
    }

    set({ timeOfDay: newTime, dayCount: newDay, weather: newWeather })
  },

  // Plant growth with weather modifier
  updatePlantGrowth: () => {
    const state = get()
    const now = Date.now()
    const weatherConfig = WEATHER_TYPES[state.weather]
    const isStorm = state.weather === 'storm'

    set({
      plots: state.plots.map(plot => {
        if (!plot.plant || plot.plant.stage === 'ready') return plot

        const crop = CROP_TYPES[plot.plant.type]
        const elapsed = (now - plot.plant.plantedAt) / 1000

        // Use card growthTime if available, else crop default
        const baseGrowth = plot.plant.card ? plot.plant.card.growthTime : crop.growthTime

        // Weather modifier (skip if card has allWeather trait)
        const isWeatherImmune = plot.plant.card?.traits?.includes('allWeather')
        const growthMod = isWeatherImmune ? 1.0 : weatherConfig.growthMod
        const adjustedTime = baseGrowth / growthMod

        const progress = elapsed / adjustedTime

        let stage = 'seed'
        if (progress >= 1) stage = 'ready'
        else if (progress >= 0.66) stage = 'growing'
        else if (progress >= 0.33) stage = 'sprout'

        // Storm damage
        let health = plot.plant.health
        if (isStorm && !isWeatherImmune && Math.random() < 0.005) {
          health = Math.max(0, health - 5)
        }

        return { ...plot, plant: { ...plot.plant, stage, health } }
      })
    })
  },

  // Pest system
  spawnPest: () => {
    const state = get()
    const occupiedPlots = state.plots.filter(p => p.plant && p.plant.stage !== 'seed')
    if (occupiedPlots.length === 0) return

    const weatherConfig = WEATHER_TYPES[state.weather]
    if (Math.random() > weatherConfig.pestChance) return
    if (state.pests.length >= 5) return

    const targetPlot = occupiedPlots[Math.floor(Math.random() * occupiedPlots.length)]
    const pestType = PEST_TYPES[Math.floor(Math.random() * PEST_TYPES.length)]

    const angle = Math.random() * Math.PI * 2
    const spawnDist = 8

    set({
      pests: [...state.pests, {
        id: ++pestIdCounter,
        type: pestType,
        targetPlotId: targetPlot.id,
        progress: 0,
        hp: 100,
        spawnX: targetPlot.position[0] + Math.cos(angle) * spawnDist,
        spawnZ: targetPlot.position[2] + Math.sin(angle) * spawnDist,
      }]
    })
  },

  updatePests: () => {
    const state = get()
    if (state.pests.length === 0) return

    const updatedPests = []
    const updatedPlots = [...state.plots]
    const newNotifications = []

    for (const pest of state.pests) {
      const newProgress = pest.progress + pest.type.speed

      if (newProgress >= 1) {
        const plotIdx = updatedPlots.findIndex(p => p.id === pest.targetPlotId)
        if (plotIdx >= 0 && updatedPlots[plotIdx].plant) {
          // Apply pest resistance from card
          const plant = updatedPlots[plotIdx].plant
          const resistMod = plant.card?.pestResist || 1.0
          const damage = Math.round(pest.type.damage * resistMod)
          const newHealth = plant.health - damage

          if (newHealth <= 0) {
            updatedPlots[plotIdx] = { ...updatedPlots[plotIdx], plant: null }
            newNotifications.push({
              id: Date.now() + Math.random(),
              message: `${pest.type.name} destruyo tu planta!`,
              type: 'pest'
            })
          } else {
            updatedPlots[plotIdx] = {
              ...updatedPlots[plotIdx],
              plant: { ...plant, health: newHealth }
            }
          }
        }
      } else {
        updatedPests.push({ ...pest, progress: newProgress })
      }
    }

    set({
      pests: updatedPests,
      plots: updatedPlots,
      notifications: [...state.notifications, ...newNotifications]
    })
  },

  killPest: (pestId) => {
    const state = get()
    const pest = state.pests.find(p => p.id === pestId)
    if (!pest) return

    // Reward comes from game pool
    const reward = Math.min(pest.type.reward, state.gamePoolTotal)

    set({
      pests: state.pests.filter(p => p.id !== pestId),
      usdcBalance: state.usdcBalance + reward,
      gamePoolTotal: state.gamePoolTotal - reward,
      pestsKilled: state.pestsKilled + 1,
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `Eliminaste ${pest.type.name} (+$${reward.toFixed(2)} gUSD)`,
        type: 'defense'
      }]
    })
  },

  // Card collection
  toggleCollection: () => set(s => ({ showCollection: !s.showCollection, showLab: false })),
  toggleLab: () => set(s => ({ showLab: !s.showLab, showCollection: false })),
  selectCardForPlant: (cardId) => set({ selectedCardForPlant: cardId }),

  // Buy seed pack — cost goes to game pool
  buySeedPack: (tier = 'basic') => {
    const state = get()
    const cost = tier === 'premium' ? 6 : 2
    if (state.usdcBalance < cost) return false

    const cards = []
    const strains = Object.keys(BASE_STRAINS)
    const count = tier === 'premium' ? 3 : 1

    for (let i = 0; i < count; i++) {
      const strain = strains[Math.floor(Math.random() * strains.length)]
      const roll = Math.random()
      let rarity = 'common'
      if (tier === 'premium') {
        if (roll < 0.02) rarity = 'legendary'
        else if (roll < 0.1) rarity = 'epic'
        else if (roll < 0.4) rarity = 'rare'
      } else {
        if (roll < 0.005) rarity = 'legendary'
        else if (roll < 0.03) rarity = 'epic'
        else if (roll < 0.15) rarity = 'rare'
      }
      cards.push(generateSeedCard(strain, rarity))
    }

    set({
      usdcBalance: state.usdcBalance - cost,
      gamePoolTotal: state.gamePoolTotal + cost,
      seedCards: [...state.seedCards, ...cards],
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `Pack ${tier}! ${cards.map(c => `[${RARITY[c.rarity].name}] ${c.name}`).join(', ')}`,
        type: cards.some(c => c.rarity === 'legendary' || c.rarity === 'epic') ? 'harvest' : 'buy'
      }]
    })
    return cards
  },

  // Hybridization lab
  setLabCard: (slot, cardId) => {
    if (slot === 'A') set({ labCardA: cardId })
    else set({ labCardB: cardId })
  },

  hybridizeCards: () => {
    const state = get()
    if (!state.labCardA || !state.labCardB) return false

    const cardA = state.seedCards.find(c => c.id === state.labCardA)
    const cardB = state.seedCards.find(c => c.id === state.labCardB)
    if (!cardA || !cardB) return false

    const cost = getHybridCost(cardA, cardB)
    if (state.usdcBalance < cost) return false

    const hybrid = hybridize(cardA, cardB)

    set({
      usdcBalance: state.usdcBalance - cost,
      gamePoolTotal: state.gamePoolTotal + cost,
      seedCards: [
        ...state.seedCards.filter(c => c.id !== cardA.id && c.id !== cardB.id),
        hybrid
      ],
      labCardA: null,
      labCardB: null,
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `Hibrido! [${RARITY[hybrid.rarity].name}] ${hybrid.name}`,
        type: hybrid.rarity === 'legendary' || hybrid.rarity === 'epic' ? 'harvest' : 'buy'
      }]
    })
    return hybrid
  },

  // Staking — rewards from game pool
  stakeCard: (cardId) => {
    const state = get()
    const card = state.seedCards.find(c => c.id === cardId)
    if (!card || card.stakingYield <= 0) return false

    set({
      seedCards: state.seedCards.filter(c => c.id !== cardId),
      stakedCards: [...state.stakedCards, { ...card, stakedAt: Date.now() }],
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `Staked [${RARITY[card.rarity].name}] ${card.name} (${(card.stakingYield * 100).toFixed(0)}% yield)`,
        type: 'buy'
      }]
    })
    return true
  },

  unstakeCard: (cardId) => {
    const state = get()
    const card = state.stakedCards.find(c => c.id === cardId)
    if (!card) return false

    set({
      stakedCards: state.stakedCards.filter(c => c.id !== cardId),
      seedCards: [...state.seedCards, card],
    })
    return true
  },

  collectStakingRewards: () => {
    const state = get()
    if (state.stakedCards.length === 0 || state.gamePoolTotal <= 0) return

    let totalYield = 0
    for (const card of state.stakedCards) {
      totalYield += card.stakingYield
    }

    // Reward: yield% * 0.01 gUSD per tick, capped by game pool
    const reward = Math.min(Math.round(totalYield * 1 * 100) / 100, state.gamePoolTotal)
    if (reward <= 0) return

    set({
      usdcBalance: state.usdcBalance + reward,
      gamePoolTotal: state.gamePoolTotal - reward,
      stakingRewards: state.stakingRewards + reward,
    })
  },

  // Tutorial
  nextTutorialStep: () => set(s => ({ tutorialStep: s.tutorialStep + 1 })),
  closeTutorial: () => {
    localStorage.setItem('glade_tutorial_done', 'true')
    set({ showTutorial: false, tutorialStep: 0 })
  },
  reopenTutorial: () => set({ showTutorial: true, tutorialStep: 0 }),

  // Notifications
  addNotification: (message, type = 'info', txHash = null) => set(s => ({
    notifications: [...s.notifications, { id: Date.now(), message, type, txHash }]
  })),
  clearNotification: (id) => set(s => ({
    notifications: s.notifications.filter(n => n.id !== id)
  }))
}))
