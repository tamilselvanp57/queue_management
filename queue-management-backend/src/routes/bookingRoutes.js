import express from 'express'
import { createBooking, getMyBookings, getBookingById, cancelBooking } from '../controllers/bookingController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authenticate, createBooking)
router.get('/my', authenticate, getMyBookings)
router.get('/:id', authenticate, getBookingById)
router.delete('/:id', authenticate, cancelBooking)

export default router
