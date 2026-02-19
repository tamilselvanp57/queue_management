import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navigation, X, Bell } from 'lucide-react'
import Header from '../../components/common/Header'
import TokenDisplay from '../../components/queue/TokenDisplay'
import QueueProgress from '../../components/queue/QueueProgress'
import AlertBanner from '../../components/queue/AlertBanner'
import { useQueueSocket } from '../../hooks/useQueueSocket'
import axios from '../../services/axiosConfig'
import toast from 'react-hot-toast'

const TokenPage = () => {
  const { tokenId } = useParams()
  const navigate = useNavigate()
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const { queueData } = useQueueSocket(token?.place?._id)

  useEffect(() => {
    fetchTokenStatus()
    const interval = setInterval(fetchTokenStatus, 10000) // Update every 10s
    return () => clearInterval(interval)
  }, [tokenId])

  const fetchTokenStatus = async () => {
    try {
      const { data } = await axios.get(`/queue/status/${tokenId}`)
      setToken(data)
      setLoading(false)
    } catch (error) {
      toast.error('Failed to load token status')
    }
  }

  const handleLeaveQueue = async () => {
    if (!confirm('Are you sure you want to leave the queue?')) return
    
    try {
      await axios.delete(`/queue/leave/${tokenId}`)
      toast.success('Left queue successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to leave queue')
    }
  }

  const handleNavigate = () => {
    const { latitude, longitude } = token.place.location.coordinates
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${longitude},${latitude}`, '_blank')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  const peopleAhead = token.queuePosition - 1

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {peopleAhead <= 2 && (
          <AlertBanner
            type={peopleAhead === 0 ? 'final' : 'ready'}
            message={
              peopleAhead === 0
                ? "It's your turn! Please proceed to the counter."
                : `Your turn is coming up! ${peopleAhead} ${peopleAhead === 1 ? 'person' : 'people'} ahead.`
            }
          />
        )}

        <TokenDisplay
          tokenNumber={token.displayNumber}
          status={token.status}
        />

        <div className="mt-6">
          <QueueProgress
            currentPosition={token.queuePosition}
            totalInQueue={queueData?.queueLength || token.queuePosition}
            estimatedWaitTime={token.estimatedWaitTime}
            currentToken={queueData?.currentToken || token.place.currentToken}
          />
        </div>

        <div className="card mt-6">
          <h3 className="text-xl font-bold mb-4">{token.place.name}</h3>
          <p className="text-gray-600 mb-4">{token.place.address}</p>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleNavigate}
              className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
            >
              <Navigation className="w-5 h-5" />
              <span>Navigate</span>
            </button>
            
            <button
              onClick={handleLeaveQueue}
              className="flex items-center justify-center space-x-2 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600"
            >
              <X className="w-5 h-5" />
              <span>Leave Queue</span>
            </button>
          </div>
        </div>

        <div className="card mt-6 bg-blue-50 border-2 border-blue-200">
          <div className="flex items-start space-x-3">
            <Bell className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Smart Alerts Enabled</h4>
              <p className="text-sm text-blue-700">
                We'll notify you when it's time to leave based on your location and travel time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TokenPage
