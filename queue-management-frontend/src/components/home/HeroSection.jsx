import { motion } from 'framer-motion'

const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Skip the Wait, Book Your Spot
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Real-time queue management for restaurants, hospitals, and banks
      </p>
      <div className="flex justify-center space-x-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">1000+</div>
          <div className="text-gray-600">Places</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">50K+</div>
          <div className="text-gray-600">Users</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">2M+</div>
          <div className="text-gray-600">Hours Saved</div>
        </div>
      </div>
    </motion.div>
  )
}

export default HeroSection
