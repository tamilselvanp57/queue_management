import { motion } from 'framer-motion'
import { Ticket } from 'lucide-react'

const TokenDisplay = ({ tokenNumber, status }) => {
  const statusColors = {
    waiting: 'bg-blue-500',
    called: 'bg-yellow-500',
    serving: 'bg-green-500'
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="card text-center py-12"
    >
      <Ticket className="w-16 h-16 mx-auto mb-4 text-primary" />
      <div className="text-gray-600 mb-2">Your Token</div>
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-8xl font-bold text-primary mb-4"
      >
        {tokenNumber}
      </motion.div>
      <div className={`inline-block px-6 py-2 rounded-full text-white ${statusColors[status]}`}>
        {status.toUpperCase()}
      </div>
    </motion.div>
  )
}

export default TokenDisplay
