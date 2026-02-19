import Booking from '../models/Booking.js'
import { sendAlert } from '../utils/notificationService.js'

// Check for upcoming bookings and send reminders
export const checkBookingReminders = async () => {
  try {
    const now = new Date()
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
    
    // Find bookings in the next hour that haven't been reminded
    const upcomingBookings = await Booking.find({
      status: 'confirmed',
      reminderSent: false,
      bookingDate: {
        $gte: now,
        $lte: oneHourLater
      }
    }).populate('user place')
    
    for (const booking of upcomingBookings) {
      await sendAlert(booking.user._id, {
        type: 'booking-reminder',
        message: `Reminder: Your booking at ${booking.place.name} is in 1 hour (${booking.timeSlot.start})`,
        tokenId: booking._id
      })
      
      booking.reminderSent = true
      await booking.save()
    }
    
    console.log(`Sent ${upcomingBookings.length} booking reminders`)
  } catch (error) {
    console.error('Booking reminder error:', error)
  }
}

// Run every 15 minutes
export const startBookingReminderService = () => {
  checkBookingReminders() // Run immediately
  setInterval(checkBookingReminders, 15 * 60 * 1000) // Every 15 minutes
}

// Auto-cancel no-show bookings
export const checkNoShowBookings = async () => {
  try {
    const now = new Date()
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)
    
    const noShowBookings = await Booking.find({
      status: 'confirmed',
      bookingDate: {
        $lte: thirtyMinutesAgo
      }
    })
    
    for (const booking of noShowBookings) {
      booking.status = 'no-show'
      await booking.save()
      
      await sendAlert(booking.user, {
        type: 'booking-cancelled',
        message: `Your booking was marked as no-show. Please arrive on time for future bookings.`,
        tokenId: booking._id
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
