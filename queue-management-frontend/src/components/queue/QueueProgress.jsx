import { motion } from 'framer-motion'
import { Users, Clock, MapPin } from 'lucide-react'

const QueueProgress = ({ currentPosition, totalInQueue, estimatedWaitTime, currentToken }) => {
  const progress = ((totalInQueue - currentPosition + 1) / totalInQueue) * 100

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6">Queue Status</h3>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-500 to-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">{currentPosition}</div>
          <div className="text-xs text-gray-600">Your Position</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">{estimatedWaitTime}</div>
          <div className="text-xs text-gray-600">Est. Wait (mins)</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">{currentToken}</div>
          <div className="text-xs text-gray-600">Now Serving</div>
        </div>
      </div>
    </div>
  )
}

export default QueueProgress
