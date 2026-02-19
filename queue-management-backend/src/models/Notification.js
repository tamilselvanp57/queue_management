import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: mongoose.Schema.Types.ObjectId, ref: 'Token' },
  type: {
    type: String,
    enum: ['queue-joined', 'approaching', 'ready', 'final-call', 'booking-reminder', 'cancelled'],
    required: true
  },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  readAt: Date,
  channels: [{ type: String, enum: ['in-app', 'sms', 'email', 'push'] }]
}, { timestamps: true })

notificationSchema.index({ user: 1, readAt: 1 })

export default mongoose.model('Notification', notificationSchema)
