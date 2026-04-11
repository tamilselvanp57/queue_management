import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Place from '../models/Place.js'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

dotenv.config()

const CITIES_DATA = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, region: 'west' },
  { name: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025, region: 'north' },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, region: 'south' },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, region: 'south' },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, region: 'south' },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, region: 'east' },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, region: 'west' },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, region: 'west' },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, region: 'west' },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, region: 'north' }
]

const HOTEL_NAMES = ['Grand Palace', 'Royal Dine', 'Spice Garden', 'Urban Bistro', 'Taj Restaurant']
const BANK_NAMES = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra']

const generatePlaces = () => {
  const places = []
  
  CITIES_DATA.forEach(city => {
    HOTEL_NAMES.forEach((name, idx) => {
      places.push({
        name: `${name} ${city.name}`,
        category: 'hotels',
        region: city.region,
        city: city.name,
        state: city.state,
        address: `${idx + 1}, Main Street, ${city.name}, ${city.state}`,
        phone: `+91-${9000000000 + Math.floor(Math.random() * 999999999)}`,
        description: `Premium dining experience in ${city.name}`,
        rating: 4 + Math.random(),
        hours: '11:00 AM - 11:00 PM',
        location: {
          type: 'Point',
          coordinates: [city.lng + (Math.random() - 0.5) * 0.1, city.lat + (Math.random() - 0.5) * 0.1]
        },
        currentToken: Math.floor(Math.random() * 10),
        queueLength: Math.floor(Math.random() * 20),
        avgServiceTime: 30,
        isActive: true
      })
    })
    
    BANK_NAMES.forEach((name, idx) => {
      places.push({
        name: `${name} ${city.name} Branch`,
        category: 'banks',
        region: city.region,
        city: city.name,
        state: city.state,
        address: `${idx + 10}, Commercial Complex, ${city.name}, ${city.state}`,
        phone: `+91-${8000000000 + Math.floor(Math.random() * 999999999)}`,
        description: `Full service banking in ${city.name}`,
        rating: 4 + Math.random(),
        hours: '10:00 AM - 4:00 PM',
        location: {
          type: 'Point',
          coordinates: [city.lng + (Math.random() - 0.5) * 0.1, city.lat + (Math.random() - 0.5) * 0.1]
        },
        currentToken: Math.floor(Math.random() * 5),
        queueLength: Math.floor(Math.random() * 15),
        avgServiceTime: 15,
        isActive: true
      })
    })
  })
  
  return places
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
    
    await Place.deleteMany({})
    console.log('Cleared existing places')
    
    const places = generatePlaces()
    const createdPlaces = await Place.insertMany(places)
    console.log(`Created ${createdPlaces.length} places`)
    
    await User.deleteMany({ role: 'admin' })
    const adminUsers = []
    
    for (const place of createdPlaces) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      adminUsers.push({
        name: `${place.name} Admin`,
        email: `admin.${place._id}@smartqueue.com`,
        password: hashedPassword,
        phone: place.phone,
        role: 'admin',
        placeId: place._id,
        businessType: place.category
      })
    }
    
    await User.insertMany(adminUsers)
    console.log(`Created ${adminUsers.length} admin users`)
    console.log('Sample admin login: admin.{placeId}@smartqueue.com / admin123')
    
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seedDatabase()
