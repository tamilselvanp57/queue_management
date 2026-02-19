import Notification from '../models/Notification.js'

export const sendAlert = async (userId, alertData) => {
  try {
    const notification = new Notification({
      user: userId,
      token: alertData.tokenId,
      type: alertData.type,
      message: alertData.message,
      sentAt: new Date(),
      channels: ['in-app']
    })
    
    await notification.save()
    
    global.io?.to(`user-${userId}`).emit('notification', {
      type: alertData.type,
      message: alertData.message,
      timestamp: new Date()
    })
    
    return notification
  } catch (error) {
    console.error('Alert error:', error)
  }
}

export const getUnreadNotifications = async (userId) => {
  return await Notification.find({
    user: userId,
    readAt: null
  }).sort({ sentAt: -1 }).limit(20)
}

export const markAsRead = async (notificationId) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    { readAt: new Date() },
    { new: true }
  )
}
