import { RARITY, TRAITS, BASE_STRAINS } from '../../store/seedCards'
import { CROP_TYPES } from '../../store/gameStore'

const elementColors = {
  fire: '#e74c3c',
  earth: '#8B6914',
  water: '#3498db',
}

const SeedCard = ({ card, onClick, selected, compact = false }) => {
  const rarityConfig = RARITY[card.rarity]
  const cropKey = card.isHybrid ? (card.parentStrain || 'coffee') : card.strainKey
  const crop = CROP_TYPES[cropKey]
  const strain = BASE_STRAINS[card.strainKey] || BASE_STRAINS[cropKey]
  const yieldUSD = strain ? (card.stats.yield / 100 * strain.baseYield).toFixed(2) : '?'

  if (compact) {
    return (
      <div className={`seed-card-compact ${selected ? 'selected' : ''}`} onClick={onClick}
        style={{ borderColor: rarityConfig.border }}>
        <div className="card-rarity-dot" style={{ background: rarityConfig.color }} />
        <span className="card-compact-name">{card.name}</span>
        <span className="card-compact-yield">${yieldUSD}</span>
      </div>
    )
  }

  return (
    <div className={`seed-card ${card.rarity} ${selected ? 'selected' : ''}`} onClick={onClick}
      style={{ borderColor: rarityConfig.border, background: `linear-gradient(145deg, rgba(0,0,0,0.9), ${rarityConfig.color}22)` }}>
      <div className="card-rarity-banner" style={{ background: rarityConfig.color }}>
        {rarityConfig.name}
      </div>
      <div className="card-visual" style={{ background: `radial-gradient(circle, ${card.color}44, transparent)` }}>
        <div className="card-orb" style={{
          background: `radial-gradient(circle, ${card.color}, ${card.color}88)`,
          boxShadow: `0 0 20px ${card.color}66`,
        }} />
        {crop && <span className="card-crop-emoji">{crop.emoji}</span>}
      </div>
      <div className="card-name">{card.name}</div>
      {card.isHybrid && <div className="card-hybrid-tag">HYBRID</div>}
      <div className="card-stats">
        <div className="card-stat">
          <span className="stat-label">YLD</span>
          <span className="stat-num" style={{ color: '#f1c40f' }}>${yieldUSD}</span>
        </div>
        <div className="card-stat">
          <span className="stat-label">SPD</span>
          <span className="stat-num" style={{ color: '#2ecc71' }}>{card.stats.growthTime}s</span>
        </div>
        <div className="card-stat">
          <span className="stat-label">RES</span>
          <span className="stat-num" style={{ color: '#3498db' }}>{card.stats.resilience}</span>
        </div>
        <div className="card-stat">
          <span className="stat-label">POT</span>
          <span className="stat-num" style={{ color: '#e74c3c' }}>{card.stats.potency}</span>
        </div>
      </div>
      {card.traits.length > 0 && (
        <div className="card-traits">
          {card.traits.map(traitKey => {
            const trait = TRAITS[traitKey]
            return trait ? (
              <div key={traitKey} className="card-trait" title={trait.desc}>
                {trait.icon} {trait.name}
              </div>
            ) : null
          })}
        </div>
      )}
      <div className="card-element" style={{ color: elementColors[card.element] || '#aaa' }}>
        {card.element} {crop ? `• ${crop.name}` : ''}
      </div>
      {card.stakingYield > 0 && (
        <div className="card-staking">{(card.stakingYield * 100).toFixed(0)}% staking</div>
      )}
    </div>
  )
}

export default SeedCard
