import Booking from '../models/Booking.js'
import Place from '../models/Place.js'

export const createBooking = async (req, res) => {
  try {
    const { placeId, slotTime, partySize } = req.body
    const place = await Place.findById(placeId)
    if (!place) return res.status(404).json({ message: 'Place not found' })

    const tokenNumber = place.currentToken + place.queueLength + 1
    const booking = new Booking({ user: req.user.id, place: placeId, tokenNumber, slotTime, partySize })
    await booking.save()

    place.queueLength += 1
    await place.save()

    req.io.to(`place-${placeId}`).emit('queue-update', {
      placeId, currentToken: place.currentToken, queueLength: place.queueLength
    })

    res.status(201).json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('place').sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('place')
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    booking.status = 'cancelled'
    await booking.save()
    res.json({ message: 'Booking cancelled' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
