import Booking from '../models/Booking.js'
import Place from '../models/Place.js'

export const getAdminBookings = async (req, res) => {
  try {
    const placeId = req.user.placeId
    const bookings = await Booking.find({ place: placeId, status: 'active' })
      .populate('user', 'name email phone')
      .sort({ createdAt: 1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    if (booking.place.toString() !== req.user.placeId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' })
    }
    
    booking.status = 'completed'
    await booking.save()
    
    const place = await Place.findById(booking.place)
    if (place) {
      place.currentToken += 1
      if (place.queueLength > 0) place.queueLength -= 1
      await place.save()
      
      req.io.to(`place-${booking.place}`).emit('queue-update', {
        placeId: booking.place,
        currentToken: place.currentToken,
        queueLength: place.queueLength
      })
      
      req.io.to(`user-${booking.user}`).emit('booking-completed', {
        bookingId: booking._id,
        message: 'Your service is completed'
      })
    }
    
    res.json({ message: 'Booking completed', booking })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAdminStats = async (req, res) => {
  try {
    const placeId = req.user.placeId
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const [totalToday, activeBookings, completedToday] = await Promise.all([
      Booking.countDocuments({ place: placeId, createdAt: { $gte: today } }),
      Booking.countDocuments({ place: placeId, status: 'active' }),
      Booking.countDocuments({ place: placeId, status: 'completed', updatedAt: { $gte: today } })
    ])
    
    res.json({ totalToday, activeBookings, completedToday })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAdminPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.user.placeId)
    if (!place) return res.status(404).json({ message: 'Place not found' })
    res.json(place)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateAdminPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.user.placeId)
    if (!place) return res.status(404).json({ message: 'Place not found' })

    const {
      name,
      region,
      city,
      state,
      address,
      phone,
      description,
      hours,
      latitude,
      longitude
    } = req.body

    if (name !== undefined) place.name = name
    if (region !== undefined) place.region = region
    if (city !== undefined) place.city = city
    if (state !== undefined) place.state = state
    if (address !== undefined) place.address = address
    if (phone !== undefined) place.phone = phone
    if (description !== undefined) place.description = description
    if (hours !== undefined) place.hours = hours

    if (latitude !== undefined && longitude !== undefined) {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return res.status(400).json({ message: 'Invalid latitude or longitude' })
      }
      place.location = { type: 'Point', coordinates: [lng, lat] }
    }

    await place.save()
    res.json(place)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
