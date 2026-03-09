import { create } from 'zustand'

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

export const useGameStore = create((set, get) => ({
  // Wallet
  walletConnected: false,
  walletAddress: null,

  // Economy
  usdcBalance: 100,
  rwaPoolTotal: 0,
  gamePoolTotal: 0,
  accumulatedYield: 0,

  // Farm
  plots: createEmptyPlots(),
  selectedPlotId: null,
  selectedCropType: 'coffee',

  // UI
  showPlantMenu: false,
  showYieldDashboard: false,
  notifications: [],
  totalPlanted: 0,
  totalHarvested: 0,

  // Actions
  setWalletConnected: (address) => set({ walletConnected: true, walletAddress: address }),
  setWalletDisconnected: () => set({ walletConnected: false, walletAddress: null }),

  selectPlot: (plotId) => {
    const plot = get().plots.find(p => p.id === plotId)
    if (plot && !plot.plant) set({ selectedPlotId: plotId, showPlantMenu: true })
  },

  setSelectedCropType: (type) => set({ selectedCropType: type }),
  closePlantMenu: () => set({ showPlantMenu: false, selectedPlotId: null }),
  toggleYieldDashboard: () => set(s => ({ showYieldDashboard: !s.showYieldDashboard })),

  buySeed: (plotId, cropType) => {
    const state = get()
    const crop = CROP_TYPES[cropType]
    if (!crop) return false
    if (state.usdcBalance < crop.costUSD) return false
    const plot = state.plots.find(p => p.id === plotId)
    if (!plot || plot.plant) return false

    set({
      usdcBalance: state.usdcBalance - crop.costUSD,
      rwaPoolTotal: state.rwaPoolTotal + crop.rwaAllocation,
      gamePoolTotal: state.gamePoolTotal + crop.gameAllocation,
      totalPlanted: state.totalPlanted + 1,
      showPlantMenu: false,
      selectedPlotId: null,
      plots: state.plots.map(p =>
        p.id === plotId
          ? { ...p, plant: { type: cropType, plantedAt: Date.now(), stage: 'seed' } }
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

  harvestPlant: (plotId) => {
    const state = get()
    const plot = state.plots.find(p => p.id === plotId)
    if (!plot || !plot.plant || plot.plant.stage !== 'ready') return false
    const crop = CROP_TYPES[plot.plant.type]

    set({
      accumulatedYield: state.accumulatedYield + crop.yieldMonthly,
      usdcBalance: state.usdcBalance + crop.yieldMonthly,
      totalHarvested: state.totalHarvested + 1,
      plots: state.plots.map(p =>
        p.id === plotId ? { ...p, plant: null } : p
      ),
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `💰 Tu ${crop.name} genero +$${crop.yieldMonthly} USDC de yield!`,
        type: 'harvest'
      }]
    })
    return true
  },

  updatePlantGrowth: () => {
    const state = get()
    const now = Date.now()
    set({
      plots: state.plots.map(plot => {
        if (!plot.plant || plot.plant.stage === 'ready') return plot
        const crop = CROP_TYPES[plot.plant.type]
        const elapsed = (now - plot.plant.plantedAt) / 1000
        const progress = elapsed / crop.growthTime
        let stage = 'seed'
        if (progress >= 1) stage = 'ready'
        else if (progress >= 0.66) stage = 'growing'
        else if (progress >= 0.33) stage = 'sprout'
        return { ...plot, plant: { ...plot.plant, stage } }
      })
    })
  },

  clearNotification: (id) => set(s => ({
    notifications: s.notifications.filter(n => n.id !== id)
  }))
}))
