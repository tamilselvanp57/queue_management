import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useGeolocation } from '../../hooks/useGeolocation'
import axios from '../../services/axiosConfig'
import toast from 'react-hot-toast'

const JoinQueueButton = ({ place }) => {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { location } = useGeolocation()
  const navigate = useNavigate()

  const handleJoinQueue = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!location) {
      toast.error('Please enable location access')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post('/queue/join', {
        placeId: place._id,
        userLocation: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        }
      })

      toast.success(`Joined queue! Token: ${data.displayNumber}`)
      navigate(`/token/${data._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join queue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleJoinQueue}
      disabled={loading}
      className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
    >
      {loading ? (
        'Joining...'
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <Users className="w-6 h-6" />
          <span>Join Virtual Queue</span>
        </div>
      )}
    </motion.button>
  )
}

export default JoinQueueButton
