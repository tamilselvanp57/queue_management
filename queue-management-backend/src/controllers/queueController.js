import prisma from '../config/prisma.js'
import { calculateDistance, calculateTravelTime } from '../utils/locationUtils.js'
import { sendAlert } from '../utils/notificationService.js'

export const joinQueue = async (req, res) => {
  try {
    const { placeId, userLocation } = req.body
    
    const place = await prisma.place.findUnique({ where: { id: placeId } })
    if (!place) return res.status(404).json({ message: 'Place not found' })
    
    const existing = await prisma.token.findFirst({
      where: {
        userId: req.user.id,
        placeId: placeId,
        status: { in: ['waiting', 'called'] }
      }
    })
    if (existing) return res.status(400).json({ message: 'Already in queue' })
    
    const queueCount = await prisma.token.count({
      where: {
        placeId: placeId,
        status: { in: ['waiting', 'called'] }
      }
    })
    
    const tokenNumber = `${place.name.substring(0, 1).toUpperCase()}${String(place.currentToken + queueCount + 1).padStart(3, '0')}`
    
    const distance = calculateDistance(
      userLocation.coordinates,
      [place.longitude, place.latitude]
    )
    const travelTime = calculateTravelTime(distance)
    
    const estimatedWaitTime = (queueCount + 1) * (place.avgServiceTime || 15)
    const estimatedCallTime = new Date(Date.now() + estimatedWaitTime * 60000)
    
    const token = await prisma.token.create({
      data: {
        tokenNumber,
        displayNumber: tokenNumber,
        userId: req.user.id,
        placeId: placeId,
        queuePosition: queueCount + 1,
        userLng: userLocation.coordinates ? userLocation.coordinates[0] : null,
        userLat: userLocation.coordinates ? userLocation.coordinates[1] : null,
        distanceFromPlace: distance,
        travelTime,
        estimatedWaitTime,
        estimatedCallTime,
        alertsSent: []
      }
    })
    
    const updatedPlace = await prisma.place.update({
      where: { id: placeId },
      data: { queueLength: { increment: 1 } }
    })
    
    req.io.to(`place-${placeId}`).emit('queue-joined', {
      placeId,
      queueLength: updatedPlace.queueLength,
      tokenNumber
    })
    
    await sendAlert(req.user.id, {
      type: 'queue-joined',
      message: `You've joined the queue. Your token: ${tokenNumber}`,
      tokenId: token.id
    })
    
    res.status(201).json(token)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getTokenStatus = async (req, res) => {
  try {
    const token = await prisma.token.findUnique({
      where: { id: req.params.tokenId },
      include: {
        place: { select: { name: true, address: true, latitude: true, longitude: true, currentToken: true, avgServiceTime: true } }
      }
    })
    
    if (!token) return res.status(404).json({ message: 'Token not found' })
    
    const currentPosition = await prisma.token.count({
      where: {
        placeId: token.placeId,
        status: { in: ['waiting', 'called'] },
        queuePosition: { lt: token.queuePosition }
      }
    })
    
    const queuePosition = currentPosition + 1
    const estimatedWaitTime = currentPosition * (token.place.avgServiceTime || 15)
    
    const updatedToken = await prisma.token.update({
      where: { id: token.id },
      data: { queuePosition, estimatedWaitTime }
    })
    
    res.json({ ...updatedToken, place: token.place })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateUserLocation = async (req, res) => {
  try {
    const { tokenId, location } = req.body
    
    const token = await prisma.token.findUnique({
      where: { id: tokenId },
      include: { place: true }
    })
    if (!token) return res.status(404).json({ message: 'Token not found' })
    
    const distance = calculateDistance(
      location.coordinates,
      [token.place.longitude, token.place.latitude]
    )
    const travelTime = calculateTravelTime(distance)
    
    const updatedToken = await prisma.token.update({
      where: { id: tokenId },
      data: {
        userLng: location.coordinates ? location.coordinates[0] : null,
        userLat: location.coordinates ? location.coordinates[1] : null,
        distanceFromPlace: distance,
        travelTime
      }
    })
    
    await checkAndSendAlerts(updatedToken)
    
    res.json({ message: 'Location updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const leaveQueue = async (req, res) => {
  try {
    const token = await prisma.token.findUnique({ where: { id: req.params.tokenId } })
    if (!token) return res.status(404).json({ message: 'Token not found' })
    
    await prisma.token.update({
      where: { id: req.params.tokenId },
      data: { status: 'cancelled' }
    })
    
    const currentPlace = await prisma.place.findUnique({ where: { id: token.placeId } })
    if (currentPlace) {
      const updatedPlace = await prisma.place.update({
        where: { id: token.placeId },
        data: {
          queueLength: Math.max(0, currentPlace.queueLength - 1)
        }
      })
      
      req.io.to(`place-${token.placeId}`).emit('queue-left', {
        placeId: token.placeId,
        queueLength: updatedPlace.queueLength
      })
    }
    
    res.json({ message: 'Left queue successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function checkAndSendAlerts(token) {
  const tokensAway = token.queuePosition - 1
  let alertsSent = Array.isArray(token.alertsSent) ? [...token.alertsSent] : []
  let updated = false
  
  if (tokensAway === 5 && !alertsSent.find(a => a.type === 'approaching')) {
    await sendAlert(token.userId, {
      type: 'approaching',
      message: `Your turn is approaching! ${tokensAway} people ahead.`,
      tokenId: token.id
    })
    alertsSent.push({ type: 'approaching', tokensAway })
    updated = true
  }
  
  if (tokensAway === 2 && !alertsSent.find(a => a.type === 'ready')) {
    await sendAlert(token.userId, {
      type: 'ready',
      message: `Time to head to the location! ETA: ${token.travelTime} mins`,
      tokenId: token.id
    })
    alertsSent.push({ type: 'ready', tokensAway })
    updated = true
  }
  
  if (tokensAway === 0 && !alertsSent.find(a => a.type === 'final')) {
    await sendAlert(token.userId, {
      type: 'final',
      message: `It's your turn! Token ${token.displayNumber} is being called.`,
      tokenId: token.id
    })
    alertsSent.push({ type: 'final', tokensAway })
    updated = true
  }
  
  if (updated) {
    await prisma.token.update({
      where: { id: token.id },
      data: { alertsSent }
    })
  }
}

export default { joinQueue, getTokenStatus, updateUserLocation, leaveQueue }
