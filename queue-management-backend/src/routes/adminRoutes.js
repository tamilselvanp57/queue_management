import express from 'express'
import { callNextToken, getDashboardStats, getAllBookings } from '../controllers/adminController.js'
import { authenticate, isAdmin } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticate, isAdmin)

router.post('/queue/:placeId/next', callNextToken)
router.get('/stats', getDashboardStats)
router.get('/bookings', getAllBookings)

export default router
