import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Place from './src/models/Place.js'
import User from './src/models/User.js'

dotenv.config()

const places = [
  {
    name: 'Persian Mandi',
    category: 'hotels',
    region: 'Downtown',
    address: '123 Main St, Downtown',
    phone: '+1234567890',
    description: 'Authentic Persian cuisine',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    currentToken: 20,
    queueLength: 8,
    rating: 4.7
  },
  {
    name: 'Nahdi Mandi',
    category: 'hotels',
    region: 'Downtown',
    address: '456 Oak Ave, Downtown',
    phone: '+1234567891',
    description: 'Traditional Mandi restaurant',
    location: { type: 'Point', coordinates: [77.6012, 12.9758] },
    currentToken: 15,
    queueLength: 5,
    rating: 4.8
  },
  {
    name: 'City Hospital',
    category: 'hospitals',
    region: 'Uptown',
    address: '789 Health Rd, Uptown',
    phone: '+1234567892',
    description: 'Multi-specialty hospital',
    location: { type: 'Point', coordinates: [77.5850, 12.9850] },
    currentToken: 45,
    queueLength: 12,
    rating: 4.5
  },
  {
    name: 'National Bank',
    category: 'banks',
    region: 'City Center',
    address: '321 Finance St, City Center',
    phone: '+1234567893',
    description: 'Full service banking',
    location: { type: 'Point', coordinates: [77.6100, 12.9650] },
    currentToken: 30,
    queueLength: 6,
    rating: 4.3
  }
]

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    await Place.deleteMany({})
    await Place.insertMany(places)
    console.log('Places seeded')

    const admin = await User.findOne({ email: 'admin@smartqueue.com' })
    if (!admin) {
      await User.create({
        name: 'Admin',
        email: 'admin@smartqueue.com',
        phone: '+1234567890',
        password: 'admin123',
        role: 'admin'
      })
      console.log('Admin user created')
    }

    console.log('Database seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seedDB()
