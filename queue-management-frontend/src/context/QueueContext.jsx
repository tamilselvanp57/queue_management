import { createContext, useState, useEffect } from 'react'
import { initSocket, connectSocket, disconnectSocket } from '../services/socket'

export const QueueContext = createContext()

export const QueueProvider = ({ children }) => {
  const [activeQueues, setActiveQueues] = useState({})
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketInstance = initSocket()
    setSocket(socketInstance)
    connectSocket()

    socketInstance.on('queue-update', (data) => {
      setActiveQueues(prev => ({
        ...prev,
        [data.placeId]: data
      }))
    })

    return () => disconnectSocket()
  }, [])

  const subscribeToQueue = (placeId) => {
    socket?.emit('join-queue', placeId)
  }

  const unsubscribeFromQueue = (placeId) => {
    socket?.emit('leave-queue', placeId)
  }

  return (
    <QueueContext.Provider value={{ activeQueues, subscribeToQueue, unsubscribeFromQueue, socket }}>
      {children}
    </QueueContext.Provider>
  )
}
