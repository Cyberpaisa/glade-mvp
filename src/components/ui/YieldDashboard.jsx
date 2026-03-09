import React from 'react'
import { useGameStore, CROP_TYPES } from '../../store/gameStore'
const YieldDashboard = () => {
  const showYieldDashboard = useGameStore(s => s.showYieldDashboard)
  const toggleYieldDashboard = useGameStore(s => s.toggleYieldDashboard)
  const rwaPoolTotal = useGameStore(s => s.rwaPoolTotal)
  const gamePoolTotal = useGameStore(s => s.gamePoolTotal)
  const accumulatedYield = useGameStore(s => s.accumulatedYield)
  const plots = useGameStore(s => s.plots)

  if (!showYieldDashboard) return null
  const activePlants = plots.filter(p => p.plant).map(p => ({ ...p, config: CROP_TYPES[p.plant.type] }))
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
        <div style={{ fontSize: 13, color: '#a8e6cf', marginBottom: 12 }}>Activos Reales Respaldando tu Granja:</div>
        {activePlants.length > 0 ? activePlants.map((p, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
            <span>{p.config.emoji} {p.config.name}</span>
            <span style={{ color: '#2ecc71', fontFamily: 'Space Mono' }}>${p.config.rwaAllocation} invertido → ${p.config.yieldMonthly}/mes</span>
          </div>
        )) : <div style={{ color: '#666', fontSize: 13, textAlign: 'center', padding: 20 }}>No tienes activos plantados aun</div>}
        <div style={{ marginTop: 16, padding: 12, background: 'rgba(232,65,66,0.08)', borderRadius: 10, border: '1px solid rgba(232,65,66,0.2)' }}>
          <div style={{ fontSize: 12, color: '#E84142', fontWeight: 600, marginBottom: 4 }}>Powered by Avalanche C-Chain</div>
          <div style={{ fontSize: 11, color: '#888' }}>Cada compra ejecuta un smart contract que divide automaticamente: 75% al fondo de activos reales, 25% a la economia del juego. Los rendimientos se distribuyen en USDC.</div>
        </div>
        <button className="btn-cancel" onClick={toggleYieldDashboard} style={{ width: '100%', marginTop: 12 }}>Cerrar</button>
      </div>
    </div>
  )
}
export default YieldDashboard
