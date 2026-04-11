import express from 'express'
import {
  getAdminBookings,
  completeBooking,
  getAdminStats,
  getAdminPlace,
  updateAdminPlace
} from '../controllers/adminController.js'
import { authenticate, isAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/bookings', authenticate, isAdmin, getAdminBookings)
router.put('/bookings/:id/complete', authenticate, isAdmin, completeBooking)
router.get('/stats', authenticate, isAdmin, getAdminStats)
router.get('/place', authenticate, isAdmin, getAdminPlace)
router.put('/place', authenticate, isAdmin, updateAdminPlace)

export default router
