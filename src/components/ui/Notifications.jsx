import React, { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
const Notifications = () => {
  const notifications = useGameStore(s => s.notifications)
  const clearNotification = useGameStore(s => s.clearNotification)
  useEffect(() => {
    notifications.forEach(n => { setTimeout(() => clearNotification(n.id), 3500) })
  }, [notifications, clearNotification])
  return (
    <div className="notifications">
      {notifications.slice(-3).map(n => (
        <div key={n.id} className={`notification ${n.type}`}>{n.message}</div>
      ))}
    </div>
  )
}
export default Notifications
