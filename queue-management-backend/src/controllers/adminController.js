import Place from '../models/Place.js'
import Booking from '../models/Booking.js'

export const callNextToken = async (req, res) => {
  try {
    const place = await Place.findById(req.params.placeId)
    if (!place) return res.status(404).json({ message: 'Place not found' })

    place.currentToken += 1
    place.queueLength = Math.max(0, place.queueLength - 1)
    await place.save()

    req.io.to(`place-${req.params.placeId}`).emit('token-called', { placeId: req.params.placeId, tokenNumber: place.currentToken })
    req.io.to(`place-${req.params.placeId}`).emit('queue-update', { placeId: req.params.placeId, currentToken: place.currentToken, queueLength: place.queueLength })

    res.json({ currentToken: place.currentToken })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getDashboardStats = async (req, res) => {
  try {
    const totalPlaces = await Place.countDocuments()
    const activeQueues = await Place.countDocuments({ queueLength: { $gt: 0 } })
    const todayBookings = await Booking.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } })
    res.json({ totalPlaces, activeQueues, todayBookings })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').populate('place', 'name').sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
