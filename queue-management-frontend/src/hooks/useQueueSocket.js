import { useEffect, useState, useContext } from 'react'
import { QueueContext } from '../context/QueueContext'

export const useQueueSocket = (placeId) => {
  const { socket, activeQueues, subscribeToQueue, unsubscribeFromQueue } = useContext(QueueContext)
  const [queueData, setQueueData] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!socket || !placeId) return

    setIsConnected(socket.connected)

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    subscribeToQueue(placeId)

    socket.on('token-called', (data) => {
      if (data.placeId === placeId) {
        setQueueData(prev => ({ ...prev, currentToken: data.tokenNumber }))
      }
    })

    socket.on('queue-update', (data) => {
      if (data.placeId === placeId) {
        setQueueData(data)
      }
    })

    return () => {
      unsubscribeFromQueue(placeId)
      socket.off('token-called')
      socket.off('queue-update')
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [placeId, socket])

  useEffect(() => {
    if (activeQueues[placeId]) {
      setQueueData(activeQueues[placeId])
    }
  }, [activeQueues, placeId])

  return { queueData, isConnected }
}
