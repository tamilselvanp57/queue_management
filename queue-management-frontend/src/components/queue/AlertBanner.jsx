import { motion } from 'framer-motion'
import { AlertCircle, Bell, CheckCircle } from 'lucide-react'

const AlertBanner = ({ type, message }) => {
  const config = {
    approaching: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      icon: Bell
    },
    ready: {
      bg: 'bg-orange-50',
      border: 'border-orange-400',
      text: 'text-orange-800',
      icon: AlertCircle
    },
    final: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-800',
      icon: CheckCircle
    }
  }

  const { bg, border, text, icon: Icon } = config[type]

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`${bg} border-2 ${border} rounded-xl p-4 mb-6`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`w-8 h-8 ${text}`} />
        <p className={`font-semibold ${text}`}>{message}</p>
      </div>
    </motion.div>
  )
}

export default AlertBanner
