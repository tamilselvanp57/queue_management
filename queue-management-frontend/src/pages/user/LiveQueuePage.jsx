import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../../components/common/Header'

const LiveQueuePage = () => {
  const { placeId } = useParams()
  const [currentToken, setCurrentToken] = useState(25)
  const [userToken] = useState(28)

  const peopleAhead = Math.max(0, userToken - currentToken - 1)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="card">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Live Queue Tracking</h1>
            <span className="flex items-center text-green-600">
              <span className="w-3 h-3 bg-green-600 rounded-full mr-2 animate-pulse"></span>
              LIVE
            </span>
          </div>

          <div className="text-center mb-12">
            <div className="text-gray-600 mb-4 text-lg">Now Serving</div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-bold text-primary mb-4"
            >
              #{currentToken}
            </motion.div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <div className="text-center">
              <div className="text-gray-600 mb-2">Your Token</div>
              <div className="text-5xl font-bold text-primary mb-4">#{userToken}</div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="text-gray-600 text-sm">People Ahead</div>
                  <div className="text-2xl font-bold">{peopleAhead}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Estimated Wait</div>
                  <div className="text-2xl font-bold">{peopleAhead * 3} mins</div>
                </div>
              </div>
            </div>
          </div>

          {peopleAhead <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl"
            >
              <div className="flex items-center">
                <span className="text-4xl mr-4">🔔</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Your turn is coming up!</h3>
                  <p className="text-gray-700">Please head to the location now.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

export default LiveQueuePage
