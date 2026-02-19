import mongoose from 'mongoose'

const tokenSchema = new mongoose.Schema({
  tokenNumber: { type: String, required: true, unique: true },
  displayNumber: { type: String, required: true }, // e.g., "A001"
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  counter: { type: String, default: 'Counter 1' },
  
  status: {
    type: String,
    enum: ['waiting', 'called', 'serving', 'completed', 'cancelled', 'no-show'],
    default: 'waiting'
  },
  
  joinedAt: { type: Date, default: Date.now },
  estimatedCallTime: Date,
  actualCallTime: Date,
  completedAt: Date,
  
  userLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  
  distanceFromPlace: Number, // km
  travelTime: Number, // minutes
  
  queuePosition: { type: Number, required: true },
  estimatedWaitTime: Number, // minutes
  
  alertsSent: [{
    type: { type: String, enum: ['approaching', 'ready', 'final'] },
    sentAt: { type: Date, default: Date.now },
    tokensAway: Number
  }],
  
  metadata: {
    deviceInfo: String,
    joinMethod: { type: String, enum: ['web', 'mobile', 'booking'], default: 'web' },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
  }
}, { timestamps: true })

tokenSchema.index({ place: 1, status: 1, queuePosition: 1 })
tokenSchema.index({ user: 1, status: 1 })
tokenSchema.index({ tokenNumber: 1 })

export default mongoose.model('Token', tokenSchema)
