import { useGameStore } from '../../store/gameStore'

const GameUI = () => {
  const usdcBalance = useGameStore(s => s.usdcBalance)
  const walletConnected = useGameStore(s => s.walletConnected)
  const walletAddress = useGameStore(s => s.walletAddress)
  const rwaPoolTotal = useGameStore(s => s.rwaPoolTotal)
  const gamePoolTotal = useGameStore(s => s.gamePoolTotal)
  const accumulatedYield = useGameStore(s => s.accumulatedYield)
  const totalPlanted = useGameStore(s => s.totalPlanted)
  const totalHarvested = useGameStore(s => s.totalHarvested)
  const pestsKilled = useGameStore(s => s.pestsKilled)
  const seedCards = useGameStore(s => s.seedCards)
  const stakedCards = useGameStore(s => s.stakedCards)
  const setWalletConnected = useGameStore(s => s.setWalletConnected)
  const setWalletDisconnected = useGameStore(s => s.setWalletDisconnected)
  const toggleYieldDashboard = useGameStore(s => s.toggleYieldDashboard)
  const toggleCollection = useGameStore(s => s.toggleCollection)
  const toggleLab = useGameStore(s => s.toggleLab)
  const reopenTutorial = useGameStore(s => s.reopenTutorial)

  const handleWalletClick = () => {
    if (walletConnected) { setWalletDisconnected() }
    else { const addr = '0x' + Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''); setWalletConnected(addr) }
  }
  const shortenAddr = (a) => a ? `${a.slice(0,6)}...${a.slice(-4)}` : ''

  return (
    <div className="game-hud">
      <div className="hud-left">
        <div className="game-logo">
          <span className="logo-icon">🌱</span>
          <h1>GLADE</h1>
          <span style={{ fontSize: 11, color: '#a8e6cf', marginLeft: 4, alignSelf: 'flex-end', marginBottom: 4 }}>Real Yield Farm</span>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
          <div className="seed-balance">
            <span className="seed-icon">💵</span>
            <div>
              <div className="seed-amount">${usdcBalance.toFixed(2)}</div>
              <div className="seed-label">gUSD Balance</div>
            </div>
          </div>
        </div>
        <div className="stats-bar">
          <div className="stat-item" onClick={toggleYieldDashboard} style={{ cursor: 'pointer' }}>
            <span className="stat-icon">🏦</span>
            <span className="stat-value">${rwaPoolTotal.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🎮</span>
            <span className="stat-value">${gamePoolTotal.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💰</span>
            <span className="stat-value">${accumulatedYield.toFixed(2)}</span>
          </div>
        </div>
        <div className="stats-bar" style={{ marginTop: 4 }}>
          <div className="stat-item"><span className="stat-icon">🌱</span><span className="stat-value">{totalPlanted}</span></div>
          <div className="stat-item"><span className="stat-icon">🎉</span><span className="stat-value">{totalHarvested}</span></div>
          <div className="stat-item"><span className="stat-icon">🐛</span><span className="stat-value">{pestsKilled}</span></div>
        </div>
        <div className="hud-actions">
          <button className="hud-action-btn collection" onClick={toggleCollection}>
            🃏 Cards ({seedCards.length})
          </button>
          <button className="hud-action-btn lab" onClick={toggleLab}>
            🧬 Lab
          </button>
          <button className="hud-action-btn help" onClick={reopenTutorial}>
            ?
          </button>
        </div>
        {stakedCards.length > 0 && (
          <div style={{ marginTop: 4, fontSize: 11, color: '#f1c40f', fontFamily: 'Space Mono' }}>
            📌 {stakedCards.length} card{stakedCards.length > 1 ? 's' : ''} staked
          </div>
        )}
      </div>
      <div className="hud-right">
        <button className={`wallet-btn ${walletConnected ? 'connected' : ''}`} onClick={handleWalletClick}>
          {walletConnected ? <><span>🟢</span><span>{shortenAddr(walletAddress)}</span></> : <><span>🔗</span><span>Connect Wallet</span></>}
        </button>
        <div className="avax-badge">Avalanche C-Chain | Fuji Testnet</div>
        <div style={{ fontSize: 10, color: '#888', textAlign: 'center', marginTop: 4, fontFamily: 'Space Mono' }}>75% RWA | 25% Game</div>
      </div>
    </div>
  )
}

export default GameUI
