import express from 'express'
import { joinQueue, getTokenStatus, updateUserLocation, leaveQueue } from '../controllers/queueController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/join', authenticate, joinQueue)
router.get('/status/:tokenId', authenticate, getTokenStatus)
router.put('/update-location', authenticate, updateUserLocation)
router.delete('/leave/:tokenId', authenticate, leaveQueue)

export default router
