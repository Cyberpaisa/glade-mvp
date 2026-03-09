import { useState, useCallback } from 'react'
import { useGameStore } from '../../store/gameStore'
import SeedCard from './SeedCard'

const CardCollection = () => {
  const showCollection = useGameStore(s => s.showCollection)
  const toggleCollection = useGameStore(s => s.toggleCollection)
  const seedCards = useGameStore(s => s.seedCards)
  const stakedCards = useGameStore(s => s.stakedCards)
  const usdcBalance = useGameStore(s => s.usdcBalance)
  const stakingRewards = useGameStore(s => s.stakingRewards)
  const gamePoolTotal = useGameStore(s => s.gamePoolTotal)
  const buySeedPack = useGameStore(s => s.buySeedPack)
  const stakeCard = useGameStore(s => s.stakeCard)
  const unstakeCard = useGameStore(s => s.unstakeCard)
  const [tab, setTab] = useState('cards')
  const [selectedCard, setSelectedCard] = useState(null)
  const [shopMsg, setShopMsg] = useState(null)

  const handleBuyPack = useCallback((tier) => {
    const cost = tier === 'basic' ? 2 : 6
    if (usdcBalance < cost) {
      setShopMsg({ type: 'error', text: `Necesitas $${cost} gUSD. Tu balance: $${usdcBalance.toFixed(2)}` })
    } else {
      buySeedPack(tier)
      const count = tier === 'basic' ? 1 : 3
      setShopMsg({ type: 'success', text: `Compraste ${count} carta${count > 1 ? 's' : ''}! Ve a la tab "Cards" para verla${count > 1 ? 's' : ''}.` })
    }
    setTimeout(() => setShopMsg(null), 3500)
  }, [usdcBalance, buySeedPack])

  if (!showCollection) return null

  const sortedCards = [...seedCards].sort((a, b) => {
    const order = { legendary: 0, epic: 1, rare: 2, common: 3 }
    return order[a.rarity] - order[b.rarity]
  })

  return (
    <div className="collection-overlay" onClick={toggleCollection}>
      <div className="collection-panel" onClick={e => e.stopPropagation()}>
        <div className="collection-header">
          <h2>RWA Seed Collection</h2>
          <div className="collection-tabs">
            <button className={tab === 'cards' ? 'active' : ''} onClick={() => setTab('cards')}>
              Cards ({seedCards.length})
            </button>
            <button className={tab === 'staked' ? 'active' : ''} onClick={() => setTab('staked')}>
              Staked ({stakedCards.length})
            </button>
            <button className={tab === 'shop' ? 'active' : ''} onClick={() => setTab('shop')}>
              Shop
            </button>
          </div>
          <button className="close-btn" onClick={toggleCollection}>X</button>
        </div>

        {tab === 'cards' && (
          <div className="collection-body">
            {sortedCards.length === 0 ? (
              <div className="empty-collection">No tienes cartas. Compra un pack en la tienda!</div>
            ) : (
              <div className="card-grid">
                {sortedCards.map(card => (
                  <div key={card.id} className="card-wrapper">
                    <SeedCard card={card} selected={selectedCard === card.id}
                      onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)} />
                    {selectedCard === card.id && (
                      <div className="card-actions">
                        {card.stakingYield > 0 && (
                          <button className="btn-stake" onClick={() => { stakeCard(card.id); setSelectedCard(null) }}>
                            Stake ({(card.stakingYield * 100).toFixed(0)}%)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'staked' && (
          <div className="collection-body">
            <div className="staking-summary">
              <span>Rewards totales: ${stakingRewards.toFixed(2)} gUSD</span>
              <span>Game Pool: ${gamePoolTotal.toFixed(2)}</span>
              <span>Stakes activos: {stakedCards.length}</span>
            </div>
            {stakedCards.length === 0 ? (
              <div className="empty-collection">Stakea cartas Rare+ para ganar gUSD pasivamente del Game Pool.</div>
            ) : (
              <div className="card-grid">
                {stakedCards.map(card => (
                  <div key={card.id} className="card-wrapper">
                    <SeedCard card={card} />
                    <button className="btn-unstake" onClick={() => unstakeCard(card.id)}>Unstake</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'shop' && (
          <div className="collection-body">
            <div style={{ background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 12, lineHeight: 1.5 }}>
              <strong style={{ color: '#2ecc71' }}>Como funciona:</strong>
              <span style={{ color: '#ccc' }}> Compra un pack para obtener cartas con rareza aleatoria. Las cartas mejoran tu yield al plantar. Cartas Rare+ se pueden stakear para ganar gUSD pasivo. Haz click en un pack para comprarlo.</span>
            </div>
            {shopMsg && (
              <div style={{
                background: shopMsg.type === 'success' ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                border: `1px solid ${shopMsg.type === 'success' ? 'rgba(46,204,113,0.5)' : 'rgba(231,76,60,0.5)'}`,
                color: shopMsg.type === 'success' ? '#2ecc71' : '#e74c3c',
                borderRadius: 8, padding: '10px 14px', marginBottom: 12,
                fontSize: 13, fontWeight: 600, textAlign: 'center',
                animation: 'fadeIn 0.3s ease'
              }}>
                {shopMsg.text}
              </div>
            )}
            <div className="shop-packs">
              <div className="shop-pack" onClick={() => handleBuyPack('basic')} style={{ cursor: 'pointer' }}>
                <div className="pack-visual basic">?</div>
                <div className="pack-name">Basic Pack</div>
                <div className="pack-desc">1 carta RWA aleatoria</div>
                <div className="pack-price">$2 gUSD</div>
                <div className="pack-rates">85% Common / 12% Rare / 2.5% Epic / 0.5% Legendary</div>
              </div>
              <div className="shop-pack" onClick={() => handleBuyPack('premium')} style={{ cursor: 'pointer' }}>
                <div className="pack-visual premium">?</div>
                <div className="pack-name">Premium Pack</div>
                <div className="pack-desc">3 cartas con mejores odds</div>
                <div className="pack-price">$6 gUSD</div>
                <div className="pack-rates">60% Common / 30% Rare / 8% Epic / 2% Legendary</div>
              </div>
            </div>
            <div className="shop-balance">Balance: ${usdcBalance.toFixed(2)} gUSD</div>
            <div style={{ fontSize: 11, color: '#888', textAlign: 'center', marginTop: 6 }}>
              El costo del pack va 100% al Game Pool
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CardCollection
