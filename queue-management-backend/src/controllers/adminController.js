import prisma from '../config/prisma.js'

export const getAdminBookings = async (req, res) => {
  try {
    const placeId = req.user.placeId
    const bookings = await prisma.booking.findMany({
      where: { placeId },
      include: {
        user: { select: { name: true, email: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const completeBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } })
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    if (booking.placeId !== req.user.placeId) {
      return res.status(403).json({ message: 'Unauthorized' })
    }
    
    await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'completed' }
    })
    
    const currentPlace = await prisma.place.findUnique({ where: { id: booking.placeId } })
    if (currentPlace) {
      const updatedPlace = await prisma.place.update({
        where: { id: booking.placeId },
        data: {
          currentToken: currentPlace.currentToken + 1,
          queueLength: Math.max(0, currentPlace.queueLength - 1)
        }
      })
      
      req.io.to(`place-${booking.placeId}`).emit('queue-update', {
        placeId: booking.placeId,
        currentToken: updatedPlace.currentToken,
        queueLength: updatedPlace.queueLength
      })
      
      req.io.to(`user-${booking.userId}`).emit('booking-completed', {
        bookingId: booking.id,
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
      prisma.booking.count({ where: { placeId, createdAt: { gte: today } } }),
      prisma.booking.count({ where: { placeId, status: 'active' } }),
      prisma.booking.count({ where: { placeId, status: 'completed', createdAt: { gte: today } } })
    ])
    
    res.json({ totalToday, activeBookings, completedToday })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAdminPlace = async (req, res) => {
  try {
    const place = await prisma.place.findUnique({ where: { id: req.user.placeId } })
    if (!place) return res.status(404).json({ message: 'Place not found' })
    res.json(place)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateAdminPlace = async (req, res) => {
  try {
    const place = await prisma.place.findUnique({ where: { id: req.user.placeId } })
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
      longitude,
      image
    } = req.body

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (region !== undefined) updateData.region = region
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.state = state
    if (address !== undefined) updateData.address = address
    if (phone !== undefined) updateData.phone = phone
    if (description !== undefined) updateData.description = description
    if (hours !== undefined) updateData.hours = hours
    if (image !== undefined) updateData.image = image

    if (latitude !== undefined && longitude !== undefined) {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return res.status(400).json({ message: 'Invalid latitude or longitude' })
      }
      updateData.latitude = lat
      updateData.longitude = lng
    }

    const updatedPlace = await prisma.place.update({
      where: { id: req.user.placeId },
      data: updateData
    })
    
    res.json(updatedPlace)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
