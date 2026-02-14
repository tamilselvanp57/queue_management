import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ClickSpark from '../common/ClickSpark'

const CategoryCard = ({ category }) => {
  const navigate = useNavigate()

  return (
    <ClickSpark
      sparkColor={category.id === 'hotels' ? '#3B82F6' : category.id === 'hospitals' ? '#EF4444' : '#10B981'}
      sparkSize={12}
      sparkRadius={20}
      sparkCount={10}
      duration={500}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="card cursor-pointer"
        onClick={() => navigate(`/categories/${category.id}`)}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`${category.color} w-20 h-20 rounded-full flex items-center justify-center text-4xl`}>
            {category.icon}
          </div>
          <h3 className="text-xl font-bold">{category.name}</h3>
          <p className="text-gray-600">{category.description}</p>
        </div>
      </motion.div>
    </ClickSpark>
  )
}

export default CategoryCard
