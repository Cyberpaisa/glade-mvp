import React from 'react'
import { useGameStore, CROP_TYPES } from '../../store/gameStore'
const PlantMenu = () => {
  const showPlantMenu = useGameStore(s => s.showPlantMenu)
  const selectedPlotId = useGameStore(s => s.selectedPlotId)
  const selectedCropType = useGameStore(s => s.selectedCropType)
  const usdcBalance = useGameStore(s => s.usdcBalance)
  const setSelectedCropType = useGameStore(s => s.setSelectedCropType)
  const buySeed = useGameStore(s => s.buySeed)
  const closePlantMenu = useGameStore(s => s.closePlantMenu)

  if (!showPlantMenu) return null
  const crop = CROP_TYPES[selectedCropType]
  const canAfford = usdcBalance >= crop.costUSD
  const handleBuy = () => { if (canAfford && selectedPlotId) buySeed(selectedPlotId, selectedCropType) }
  return (
    <div className="plant-menu-overlay" onClick={closePlantMenu}>
      <div className="plant-menu" onClick={e => e.stopPropagation()}>
        <h2>Comprar Semilla RWA</h2>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#a8e6cf', marginBottom: 16, fontFamily: 'Space Mono' }}>75% respaldado por activo real | 25% economia in-game</div>
        <div className="seed-options">
          {Object.entries(CROP_TYPES).map(([key, c]) => (
            <div key={key} className={`seed-option ${selectedCropType === key ? 'selected' : ''}`} onClick={() => setSelectedCropType(key)}>
              <span className="seed-emoji">{c.emoji}</span>
              <div className="seed-name">{c.name}</div>
              <div className="seed-cost">${c.costUSD} USDC</div>
              <div className="seed-yield">Yield: ${c.yieldMonthly}/mes</div>
              <div className="seed-time">{c.growthTime}s demo</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(46,204,113,0.08)', borderRadius: 10, padding: 10, marginBottom: 14, fontSize: 12, fontFamily: 'Space Mono' }}>
          <div style={{ color: '#2ecc71' }}>Split: ${crop.rwaAllocation} RWA Pool | ${crop.gameAllocation} Game</div>
          <div style={{ color: '#888', marginTop: 4 }}>{crop.rwaDescription}</div>
        </div>
        <div className="plant-menu-actions">
          <button className="btn-cancel" onClick={closePlantMenu}>Cancelar</button>
          <button className="btn-plant" onClick={handleBuy} disabled={!canAfford}>
            {canAfford ? `Invertir $${crop.costUSD}` : `Necesitas $${crop.costUSD}`}
          </button>
        </div>
      </div>
    </div>
  )
}
export default PlantMenu
