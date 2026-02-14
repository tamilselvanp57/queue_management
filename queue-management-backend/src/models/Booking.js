import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  tokenNumber: { type: Number, required: true },
  slotTime: { type: String, required: true },
  partySize: { type: Number, default: 1 },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
}, { timestamps: true })

export default mongoose.model('Booking', bookingSchema)
