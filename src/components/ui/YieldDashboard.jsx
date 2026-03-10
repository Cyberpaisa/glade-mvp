import { useGameStore, CROP_TYPES } from '../../store/gameStore'
import { RARITY } from '../../store/seedCards'
import { useGladeContract } from '../../hooks/useGladeContract'

const YieldDashboard = () => {
  const showYieldDashboard = useGameStore(s => s.showYieldDashboard)
  const toggleYieldDashboard = useGameStore(s => s.toggleYieldDashboard)
  const rwaPoolTotal = useGameStore(s => s.rwaPoolTotal)
  const gamePoolTotal = useGameStore(s => s.gamePoolTotal)
  const accumulatedYield = useGameStore(s => s.accumulatedYield)
  const stakingRewards = useGameStore(s => s.stakingRewards)
  const stakedCards = useGameStore(s => s.stakedCards)
  const plots = useGameStore(s => s.plots)

  const { economyStats } = useGladeContract()

  if (!showYieldDashboard) return null

  const activePlants = plots.filter(p => p.plant).map(p => ({
    ...p,
    config: CROP_TYPES[p.plant.type],
    cardInfo: p.plant.card
  }))

  return (
    <div className="plant-menu-overlay" onClick={toggleYieldDashboard}>
      <div className="plant-menu" onClick={e => e.stopPropagation()} style={{ minWidth: 420 }}>
        <h2>GLADE Yield Dashboard</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: 'rgba(46,204,113,0.1)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontFamily: 'Space Mono', color: '#2ecc71', fontWeight: 700 }}>${rwaPoolTotal.toFixed(2)}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>RWA Pool (75%)</div>
          </div>
          <div style={{ background: 'rgba(52,152,219,0.1)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontFamily: 'Space Mono', color: '#3498db', fontWeight: 700 }}>${gamePoolTotal.toFixed(2)}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Game Pool (25%)</div>
          </div>
          <div style={{ background: 'rgba(241,196,15,0.1)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontFamily: 'Space Mono', color: '#f1c40f', fontWeight: 700 }}>${accumulatedYield.toFixed(2)}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Total Yield</div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: '#a8e6cf', marginBottom: 8 }}>Activos Plantados:</div>
        {activePlants.length > 0 ? activePlants.map((p, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
            <span>
              {p.config.emoji} {p.config.name}
              {p.cardInfo && <span style={{ color: RARITY[p.cardInfo.rarity]?.color, marginLeft: 6, fontSize: 11 }}>[{RARITY[p.cardInfo.rarity]?.name}]</span>}
            </span>
            <span style={{ color: '#2ecc71', fontFamily: 'Space Mono' }}>
              ${p.config.rwaAllocation} → ${(p.config.yieldMonthly * (p.cardInfo?.yieldMult || 1)).toFixed(2)}/mes
            </span>
          </div>
        )) : <div style={{ color: '#666', fontSize: 13, textAlign: 'center', padding: 12 }}>No tienes activos plantados</div>}

        {stakedCards.length > 0 && (
          <>
            <div style={{ fontSize: 13, color: '#f1c40f', marginTop: 12, marginBottom: 8 }}>Staking Activo:</div>
            {stakedCards.map((card, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'rgba(241,196,15,0.05)', borderRadius: 8, marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: RARITY[card.rarity]?.color }}>[{RARITY[card.rarity]?.name}] {card.name}</span>
                <span style={{ color: '#f1c40f', fontFamily: 'Space Mono' }}>{(card.stakingYield * 100).toFixed(0)}%/tick</span>
              </div>
            ))}
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Rewards: ${stakingRewards.toFixed(2)} gUSD (del Game Pool)</div>
          </>
        )}

        <div style={{ marginTop: 12, padding: 10, background: gamePoolTotal < 1 ? 'rgba(231,76,60,0.1)' : 'rgba(52,152,219,0.05)', borderRadius: 8, fontSize: 11 }}>
          <span style={{ color: gamePoolTotal < 1 ? '#e74c3c' : '#3498db' }}>
            Game Pool: ${gamePoolTotal.toFixed(2)} {gamePoolTotal < 1 ? '(bajo)' : ''}
          </span>
        </div>

        {economyStats && (
          <div style={{ marginTop: 12, padding: 12, background: 'rgba(232,65,66,0.08)', borderRadius: 10, border: '1px solid rgba(232,65,66,0.2)' }}>
            <div style={{ fontSize: 12, color: '#E84142', fontWeight: 600, marginBottom: 8 }}>⛓ On-chain Stats (Fuji)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, fontSize: 11, fontFamily: 'Space Mono' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#2ecc71' }}>${economyStats.rwa}</div>
                <div style={{ color: '#666', marginTop: 2 }}>RWA Pool</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#3498db' }}>${economyStats.game}</div>
                <div style={{ color: '#666', marginTop: 2 }}>Game Pool</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#f1c40f' }}>{economyStats.seeds}</div>
                <div style={{ color: '#666', marginTop: 2 }}>Seeds minted</div>
              </div>
            </div>
          </div>
        )}
        {!economyStats && (
          <div style={{ marginTop: 12, padding: 12, background: 'rgba(232,65,66,0.08)', borderRadius: 10, border: '1px solid rgba(232,65,66,0.2)' }}>
            <div style={{ fontSize: 12, color: '#E84142', fontWeight: 600, marginBottom: 4 }}>Powered by Avalanche C-Chain</div>
            <div style={{ fontSize: 11, color: '#888' }}>75% al fondo RWA, 25% al juego. Pest rewards y staking salen del Game Pool.</div>
          </div>
        )}

        <button className="btn-cancel" onClick={toggleYieldDashboard} style={{ width: '100%', marginTop: 12 }}>Cerrar</button>
      </div>
    </div>
  )
}

export default YieldDashboard
