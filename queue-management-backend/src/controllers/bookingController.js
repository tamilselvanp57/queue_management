import prisma from '../config/prisma.js'

// 🔹 Create Booking
export const createBooking = async (req, res) => {
  try {
    const { placeId, slotTime, partySize } = req.body

    if (!placeId) {
      return res.status(400).json({ message: 'placeId is required' })
    }

    const place = await prisma.place.findUnique({
      where: { id: placeId }
    })

    if (!place) {
      return res.status(404).json({ message: 'Place not found' })
    }

    const tokenNumber = place.currentToken + place.queueLength + 1

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        placeId,
        tokenNumber,
        slotTime,
        partySize
      }
    })

    // ✅ Update queue safely
    const updatedPlace = await prisma.place.update({
      where: { id: placeId },
      data: {
        queueLength: {
          increment: 1
        }
      }
    })

    // ✅ Real-time update
    req.io.to(`place-${placeId}`).emit('queue-update', {
      placeId,
      currentToken: updatedPlace.currentToken,
      queueLength: updatedPlace.queueLength
    })

    res.status(201).json(booking)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}


// 🔹 Get My Bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { place: true },
      orderBy: { createdAt: 'desc' }
    })

    res.json(bookings)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}


// 🔹 Get Booking By ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { place: true }
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    res.json(booking)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}


// 🔹 Cancel Booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id }
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    if (booking.status !== 'active') {
      return res.status(400).json({ message: 'Booking already cancelled or completed' })
    }

    // ✅ Update booking status
    await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' }
    })

    const place = await prisma.place.findUnique({
      where: { id: booking.placeId }
    })

    if (place && place.queueLength > 0) {

      // ✅ Safe decrement
      const updatedPlace = await prisma.place.update({
        where: { id: booking.placeId },
        data: {
          queueLength: {
            decrement: 1
          }
        }
      })

      // ✅ Real-time update
      req.io.to(`place-${booking.placeId}`).emit('queue-update', {
        placeId: booking.placeId,
        currentToken: updatedPlace.currentToken,
        queueLength: updatedPlace.queueLength
      })
    }

    res.json({ message: 'Booking cancelled' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}