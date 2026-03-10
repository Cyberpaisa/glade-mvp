import React, { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'

const Notifications = () => {
  const notifications = useGameStore(s => s.notifications)
  const clearNotification = useGameStore(s => s.clearNotification)

  useEffect(() => {
    notifications.forEach(n => {
      setTimeout(() => clearNotification(n.id), n.type === 'tx' ? 8000 : 3500)
    })
  }, [notifications, clearNotification])

  return (
    <div className="notifications">
      {notifications.slice(-3).map(n => (
        <div key={n.id} className={`notification ${n.type}`}>
          {n.txHash ? (
            <>
              {n.message}{' '}
              <a
                href={`https://testnet.snowtrace.io/tx/${n.txHash}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#3498db', fontFamily: 'Space Mono', fontSize: 10 }}
              >
                {n.txHash.slice(0, 8)}...{n.txHash.slice(-6)} ↗
              </a>
            </>
          ) : n.message}
        </div>
      ))}
    </div>
  )
}

export default Notifications
