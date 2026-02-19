import Token from '../models/Token.js'
import Place from '../models/Place.js'
import { calculateDistance, calculateTravelTime } from '../utils/locationUtils.js'
import { sendAlert } from '../utils/notificationService.js'

export const joinQueue = async (req, res) => {
  try {
    const { placeId, userLocation } = req.body
    
    const place = await Place.findById(placeId)
    if (!place) return res.status(404).json({ message: 'Place not found' })
    
    // Check if user already in queue
    const existing = await Token.findOne({
      user: req.user.id,
      place: placeId,
      status: { $in: ['waiting', 'called'] }
    })
    if (existing) return res.status(400).json({ message: 'Already in queue' })
    
    // Get current queue position
    const queueCount = await Token.countDocuments({
      place: placeId,
      status: { $in: ['waiting', 'called'] }
    })
    
    // Generate token number
    const tokenNumber = `${place.name.substring(0, 1).toUpperCase()}${String(place.currentToken + queueCount + 1).padStart(3, '0')}`
    
    // Calculate distance and travel time
    const distance = calculateDistance(
      userLocation.coordinates,
      place.location.coordinates
    )
    const travelTime = calculateTravelTime(distance)
    
    // Calculate estimated wait time
    const estimatedWaitTime = (queueCount + 1) * (place.avgServiceTime || 15)
    const estimatedCallTime = new Date(Date.now() + estimatedWaitTime * 60000)
    
    const token = new Token({
      tokenNumber,
      displayNumber: tokenNumber,
      user: req.user.id,
      place: placeId,
      queuePosition: queueCount + 1,
      userLocation: {
        type: 'Point',
        coordinates: userLocation.coordinates
      },
      distanceFromPlace: distance,
      travelTime,
      estimatedWaitTime,
      estimatedCallTime
    })
    
    await token.save()
    
    // Update place queue length
    place.queueLength += 1
    await place.save()
    
    // Emit WebSocket event
    req.io.to(`place-${placeId}`).emit('queue-joined', {
      placeId,
      queueLength: place.queueLength,
      tokenNumber
    })
    
    // Send confirmation notification
    await sendAlert(req.user.id, {
      type: 'queue-joined',
      message: `You've joined the queue. Your token: ${tokenNumber}`,
      tokenId: token._id
    })
    
    res.status(201).json(token)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getTokenStatus = async (req, res) => {
  try {
    const token = await Token.findById(req.params.tokenId)
      .populate('place', 'name address location currentToken avgServiceTime')
    
    if (!token) return res.status(404).json({ message: 'Token not found' })
    
    // Recalculate position and wait time
    const currentPosition = await Token.countDocuments({
      place: token.place._id,
      status: { $in: ['waiting', 'called'] },
      queuePosition: { $lt: token.queuePosition }
    })
    
    token.queuePosition = currentPosition + 1
    token.estimatedWaitTime = currentPosition * (token.place.avgServiceTime || 15)
    await token.save()
    
    res.json(token)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateUserLocation = async (req, res) => {
  try {
    const { tokenId, location } = req.body
    
    const token = await Token.findById(tokenId).populate('place')
    if (!token) return res.status(404).json({ message: 'Token not found' })
    
    // Update location
    token.userLocation.coordinates = location.coordinates
    
    // Recalculate distance and travel time
    token.distanceFromPlace = calculateDistance(
      location.coordinates,
      token.place.location.coordinates
    )
    token.travelTime = calculateTravelTime(token.distanceFromPlace)
    
    await token.save()
    
    // Check if alert should be triggered
    await checkAndSendAlerts(token)
    
    res.json({ message: 'Location updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const leaveQueue = async (req, res) => {
  try {
    const token = await Token.findById(req.params.tokenId)
    if (!token) return res.status(404).json({ message: 'Token not found' })
    
    token.status = 'cancelled'
    await token.save()
    
    // Update place queue
    const place = await Place.findById(token.place)
    place.queueLength = Math.max(0, place.queueLength - 1)
    await place.save()
    
    // Emit event
    req.io.to(`place-${token.place}`).emit('queue-left', {
      placeId: token.place,
      queueLength: place.queueLength
    })
    
    res.json({ message: 'Left queue successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function checkAndSendAlerts(token) {
  const tokensAway = token.queuePosition - 1
  
  // Alert when 5 tokens away
  if (tokensAway === 5 && !token.alertsSent.find(a => a.type === 'approaching')) {
    await sendAlert(token.user, {
      type: 'approaching',
      message: `Your turn is approaching! ${tokensAway} people ahead.`,
      tokenId: token._id
    })
    token.alertsSent.push({ type: 'approaching', tokensAway })
    await token.save()
  }
  
  // Alert when 2 tokens away (time to leave)
  if (tokensAway === 2 && !token.alertsSent.find(a => a.type === 'ready')) {
    await sendAlert(token.user, {
      type: 'ready',
      message: `Time to head to the location! ETA: ${token.travelTime} mins`,
      tokenId: token._id
    })
    token.alertsSent.push({ type: 'ready', tokensAway })
    await token.save()
  }
  
  // Final alert when it's your turn
  if (tokensAway === 0 && !token.alertsSent.find(a => a.type === 'final')) {
    await sendAlert(token.user, {
      type: 'final',
      message: `It's your turn! Token ${token.displayNumber} is being called.`,
      tokenId: token._id
    })
    token.alertsSent.push({ type: 'final', tokensAway })
    await token.save()
  }
}

export default { joinQueue, getTokenStatus, updateUserLocation, leaveQueue }
