import { useState, useEffect } from 'react'
import { useGameStore, CROP_TYPES } from '../../store/gameStore'
import { useGladeContract } from '../../hooks/useGladeContract'
import { useWallet } from '../../hooks/useWallet'
import SeedCard from './SeedCard'

// Contract seed index order (matches GladeFarm.sol constructor)
// 0: Cafe Colombiano, 1: Vinedo, 2: Panel Solar, 3: Cacao
const SEED_TYPE_MAP = { coffee: 0, vineyard: 1, solar: 2, cacao: 3 }

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
  const addNotification = useGameStore(s => s.addNotification)
  const [tab, setTab] = useState('direct')

  const { isConnected } = useWallet()
  const {
    approveAndBuySeed,
    contractsDeployed,
    buyStep,
    resetBuyStep,
    isPending,
    isConfirming,
    isBuySuccess,
    txHash,
  } = useGladeContract()

  // ⚠️ Hooks must be before any early return (Rules of Hooks)
  useEffect(() => {
    if (isBuySuccess && txHash) {
      addNotification('⛓ Semilla comprada on-chain', 'tx', txHash)
    }
  }, [isBuySuccess])

  if (!showPlantMenu) return null

  const crop = CROP_TYPES[selectedCropType]

  // Always use local balance for UI affordability check
  // On-chain contract enforces the real payment independently
  const canAfford = usdcBalance >= crop.costUSD

  const handleBuy = () => {
    if (!canAfford || !selectedPlotId) return

    // Deduct local balance + plant in 3D world immediately
    buySeed(selectedPlotId, selectedCropType)
    closePlantMenu()

    // On-chain in background: approve → buySeed (real payment)
    if (isConnected && contractsDeployed) {
      approveAndBuySeed(SEED_TYPE_MAP[selectedCropType] ?? 0, crop.costUSD)
    }
  }

  const handleClose = () => {
    resetBuyStep()
    closePlantMenu()
  }

  const plantableCards = seedCards.filter(c => {
    const cropKey = c.isHybrid ? (c.parentStrain || 'coffee') : c.strainKey
    return CROP_TYPES[cropKey]
  })

  const handlePlantCard = (cardId) => {
    if (selectedPlotId) plantWithCard(selectedPlotId, cardId)
  }

  // Label for the buy button depending on on-chain state
  const buyLabel = () => {
    if (!canAfford) return `Necesitas $${crop.costUSD} gUSD`
    if (buyStep === 'approving' || isApprovePending) return '⏳ Aprobando gUSD...'
    if (buyStep === 'buying' || (isPending && buyStep !== 'approving')) return '⏳ Firmando TX...'
    if (isConfirming) return '⏳ Confirmando...'
    return `Invertir $${crop.costUSD}`
  }

  const isApprovePending = buyStep === 'approving' && isPending

  return (
    <div className="plant-menu-overlay" onClick={handleClose}>
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

            {/* On-chain flow indicator */}
            {isConnected && contractsDeployed && (
              <div style={{ fontSize: 11, marginBottom: 8, fontFamily: 'Space Mono', textAlign: 'center' }}>
                {buyStep === 'idle' && (
                  <span style={{ color: '#3498db' }}>⛓ Fuji: approve → buySeed (2 firmas)</span>
                )}
                {buyStep === 'approving' && (
                  <span style={{ color: '#f39c12' }}>🔐 Firma 1/2: aprobando gUSD para GladeFarm...</span>
                )}
                {buyStep === 'buying' && (
                  <span style={{ color: '#f39c12' }}>🌱 Firma 2/2: ejecutando buySeed on-chain...</span>
                )}
                {isConfirming && buyStep === 'buying' && (
                  <span style={{ color: '#f39c12' }}>⏳ Confirmando en Avalanche Fuji...</span>
                )}
                {isBuySuccess && (
                  <span style={{ color: '#2ecc71' }}>✅ Semilla comprada on-chain</span>
                )}
              </div>
            )}

            {txHash && (
              <div style={{ fontSize: 11, textAlign: 'center', marginBottom: 8, fontFamily: 'Space Mono' }}>
                <a href={`https://testnet.snowtrace.io/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ color: '#3498db' }}>
                  Ver TX en SnowTrace ↗
                </a>
              </div>
            )}

            <div className="plant-menu-actions">
              <button className="btn-cancel" onClick={handleClose}>Cancelar</button>
              <button
                className="btn-plant"
                onClick={handleBuy}
                disabled={!canAfford || isPending || isConfirming}
              >
                {buyLabel()}
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
            <button className="btn-cancel" onClick={handleClose} style={{ width: '100%', marginTop: 8 }}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlantMenu
