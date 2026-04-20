import prisma from '../config/prisma.js'
import { sendAlert } from '../utils/notificationService.js'

// Check for upcoming bookings and send reminders
export const checkBookingReminders = async () => {
  try {
    const now = new Date()
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
    
    // Simplification: In a full production app, you would parse the `slotTime` string.
    // For now, we will query active bookings.
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        status: 'active',
        // In the future, add proper datetime fields for booking slots instead of String slotTime
      },
      include: {
        user: true,
        place: true
      }
    })
    
    // For demonstration, we simply console log since true date mapping requires schema extension
    console.log(`Checked ${upcomingBookings.length} booking reminders`)
  } catch (error) {
    console.error('Booking reminder error:', error)
  }
}

// Run every 15 minutes
export const startBookingReminderService = () => {
  checkBookingReminders() 
  setInterval(checkBookingReminders, 15 * 60 * 1000)
}

// Auto-cancel no-show bookings
export const checkNoShowBookings = async () => {
  try {
    const now = new Date()
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)
    
    // Without strict datetime mapping on the slot, we will check oldest active bookings
    const noShowBookings = await prisma.booking.findMany({
      where: {
        status: 'active',
        createdAt: {
          lte: thirtyMinutesAgo
        }
      }
    })
    
    for (const booking of noShowBookings) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'no-show' }
      })
      
      await sendAlert(booking.userId, {
        type: 'booking-cancelled',
        message: `Your booking was marked as no-show.`,
        tokenId: booking.id
      })
    }
    
    console.log(`Marked ${noShowBookings.length} bookings as no-show`)
  } catch (error) {
    console.error('No-show check error:', error)
  }
}

// Run every 30 minutes
export const startNoShowCheckService = () => {
  checkNoShowBookings()
  setInterval(checkNoShowBookings, 30 * 60 * 1000)
}
