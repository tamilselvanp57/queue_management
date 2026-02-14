import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Users } from 'lucide-react'
import { BUSY_STATUS } from '../../utils/constants'
import ClickSpark from '../common/ClickSpark'

const PlaceCard = ({ place }) => {
  const navigate = useNavigate()
  
  const getBusyStatus = (queueLength) => {
    if (queueLength > 20) return BUSY_STATUS.BUSY
    if (queueLength > 10) return BUSY_STATUS.MODERATE
    return BUSY_STATUS.AVAILABLE
  }

  const status = getBusyStatus(place.queueLength)

  return (
    <ClickSpark
      sparkColor="#3B82F6"
      sparkSize={10}
      sparkRadius={18}
      sparkCount={8}
    >
      <motion.div
        whileHover={{ y: -5 }}
        className="card cursor-pointer"
        onClick={() => navigate(`/place/${place.id}`)}
      >
      <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
        <img 
          src={place.image || 'https://via.placeholder.com/400x300'} 
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-3 right-3 ${status.bg} ${status.color} px-3 py-1 rounded-full text-sm font-semibold`}>
          {status.label}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2">{place.name}</h3>
      
      <div className="flex items-center text-gray-600 mb-2">
        <MapPin className="w-4 h-4 mr-1" />
        <span className="text-sm">{place.region} • {place.distance || '2.3'} km</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-500 mr-1" />
          <span className="font-semibold">{place.rating || '4.5'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-1" />
          <span className="text-sm">{place.queueLength} in queue</span>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-500">
        Est. Wait: <span className="font-semibold">{place.estimatedWait || 15} mins</span>
      </div>
      </motion.div>
    </ClickSpark>
  )
}

export default PlaceCard
