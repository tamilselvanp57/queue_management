import mongoose from 'mongoose'

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['hotels', 'hospitals', 'banks'], required: true },
  region: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  description: String,
  image: String,
  rating: { type: Number, default: 4.5 },
  hours: { type: String, default: '9:00 AM - 10:00 PM' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  currentToken: { type: Number, default: 0 },
  queueLength: { type: Number, default: 0 },
  estimatedWait: { type: Number, default: 0 },
  avgServiceTime: { type: Number, default: 15 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

placeSchema.index({ location: '2dsphere' })

export default mongoose.model('Place', placeSchema)
