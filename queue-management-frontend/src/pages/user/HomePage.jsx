import Header from '../../components/common/Header'
import HeroSection from '../../components/home/HeroSection'
import CategoryCard from '../../components/home/CategoryCard'
import { CATEGORIES } from '../../utils/constants'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />
        
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Choose a Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section className="py-12 text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="font-bold mb-2">Choose Category</h3>
              <p className="text-gray-600">Select from hotels, hospitals, or banks</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="font-bold mb-2">Pick a Place</h3>
              <p className="text-gray-600">Browse places in your region</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="font-bold mb-2">Book Your Slot</h3>
              <p className="text-gray-600">Reserve your time slot instantly</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">4️⃣</div>
              <h3 className="font-bold mb-2">Get Notified</h3>
              <p className="text-gray-600">Receive alerts when it's your turn</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage
