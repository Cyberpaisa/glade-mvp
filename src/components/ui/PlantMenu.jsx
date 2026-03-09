import { useState } from 'react'
import { useGameStore, CROP_TYPES } from '../../store/gameStore'
import { useGladeContract } from '../../hooks/useGladeContract'
import SeedCard from './SeedCard'

const SEED_TYPE_MAP = { coffee: 0, cacao: 1, vineyard: 2, solar: 3 }

const PlantMenu = () => {
  const showPlantMenu = useGameStore(s => s.showPlantMenu)
  const selectedPlotId = useGameStore(s => s.selectedPlotId)
  const selectedCropType = useGameStore(s => s.selectedCropType)
  const usdcBalance = useGameStore(s => s.usdcBalance)
  const seedCards = useGameStore(s => s.seedCards)
  const setSelectedCropType = useGameStore(s => s.setSelectedCropType)
  const buySeed = useGameStore(s => s.buySeed)
  const plantWithCard = useGameStore(s => s.plantWithCard)
  const closePlantMenu = useGameStore(s => s.closePlantMenu)
  const [tab, setTab] = useState('direct')

  const { buySeedOnChain, contractsDeployed, txHash, isPending, isConfirming } = useGladeContract()

  if (!showPlantMenu) return null

  const crop = CROP_TYPES[selectedCropType]
  const canAfford = usdcBalance >= crop.costUSD

  const handleBuy = () => {
    if (!canAfford || !selectedPlotId) return
    buySeed(selectedPlotId, selectedCropType)
    if (contractsDeployed) {
      buySeedOnChain(SEED_TYPE_MAP[selectedCropType] || 0)
    }
  }

  const plantableCards = seedCards.filter(c => {
    const cropKey = c.isHybrid ? (c.parentStrain || 'coffee') : c.strainKey
    return CROP_TYPES[cropKey]
  })

  const handlePlantCard = (cardId) => {
    if (selectedPlotId) plantWithCard(selectedPlotId, cardId)
  }

  return (
    <div className="plant-menu-overlay" onClick={closePlantMenu}>
      <div className="plant-menu" onClick={e => e.stopPropagation()}>
        <h2>Comprar Semilla RWA</h2>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#a8e6cf', marginBottom: 12, fontFamily: 'Space Mono' }}>
          75% activo real | 25% economia in-game
        </div>

        <div className="plant-menu-tabs">
          <button className={tab === 'direct' ? 'active' : ''} onClick={() => setTab('direct')}>
            Compra Directa
          </button>
          <button className={tab === 'cards' ? 'active' : ''} onClick={() => setTab('cards')}>
            Usar Carta ({plantableCards.length})
          </button>
        </div>

        {tab === 'direct' && (
          <>
            <div className="seed-options">
              {Object.entries(CROP_TYPES).map(([key, c]) => (
                <div key={key} className={`seed-option ${selectedCropType === key ? 'selected' : ''}`} onClick={() => setSelectedCropType(key)}>
                  <span className="seed-emoji">{c.emoji}</span>
                  <div className="seed-name">{c.name}</div>
                  <div className="seed-cost">${c.costUSD} gUSD</div>
                  <div className="seed-yield">Yield: ${c.yieldMonthly}/mes</div>
                  <div className="seed-time">{c.growthTime}s demo</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(46,204,113,0.08)', borderRadius: 10, padding: 10, marginBottom: 14, fontSize: 12, fontFamily: 'Space Mono' }}>
              <div style={{ color: '#2ecc71' }}>Split: ${crop.rwaAllocation} RWA | ${crop.gameAllocation} Game</div>
              <div style={{ color: '#888', marginTop: 4 }}>{crop.rwaDescription}</div>
            </div>
            {contractsDeployed && (
              <div style={{ fontSize: 11, color: '#3498db', textAlign: 'center', marginBottom: 8, fontFamily: 'Space Mono' }}>
                ⛓ On-chain TX via Avalanche Fuji
              </div>
            )}
            {txHash && (
              <div style={{ fontSize: 11, textAlign: 'center', marginBottom: 8, fontFamily: 'Space Mono' }}>
                {isConfirming ? (
                  <span style={{ color: '#f39c12' }}>⏳ Confirmando TX...</span>
                ) : (
                  <span style={{ color: '#2ecc71' }}>
                    ✅ TX: <a href={`https://testnet.snowtrace.io/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ color: '#3498db' }}>{txHash.slice(0, 10)}...{txHash.slice(-6)}</a>
                  </span>
                )}
              </div>
            )}
            <div className="plant-menu-actions">
              <button className="btn-cancel" onClick={closePlantMenu}>Cancelar</button>
              <button className="btn-plant" onClick={handleBuy} disabled={!canAfford || isPending}>
                {isPending ? 'Firmando...' : canAfford ? `Invertir $${crop.costUSD}` : `Necesitas $${crop.costUSD}`}
              </button>
            </div>
          </>
        )}

        {tab === 'cards' && (
          <div className="plant-card-tab">
            {plantableCards.length === 0 ? (
              <div className="empty-collection" style={{ padding: 20 }}>
                No tienes cartas. Compra packs en la Coleccion (boton Cards).
              </div>
            ) : (
              <div className="card-grid" style={{ maxHeight: 300, overflow: 'auto' }}>
                {plantableCards.map(card => {
                  const cropKey = card.isHybrid ? (card.parentStrain || 'coffee') : card.strainKey
                  const cardCrop = CROP_TYPES[cropKey]
                  const canAffordCard = usdcBalance >= (cardCrop?.costUSD || 0)
                  return (
                    <div key={card.id} className="card-wrapper">
                      <SeedCard card={card} />
                      <button className="btn-plant" style={{ width: '100%', marginTop: 4, fontSize: 12 }}
                        disabled={!canAffordCard}
                        onClick={() => handlePlantCard(card.id)}>
                        Plantar (${cardCrop?.costUSD} gUSD)
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
            <div style={{ textAlign: 'center', fontSize: 11, color: '#888', marginTop: 8 }}>
              Costo base del cultivo con split 75/25. La carta modifica el yield.
            </div>
            <button className="btn-cancel" onClick={closePlantMenu} style={{ width: '100%', marginTop: 8 }}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlantMenu
