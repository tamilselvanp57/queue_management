import prisma from '../config/prisma.js'

export const sendAlert = async (userId, alertData) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: userId,
        tokenId: alertData.tokenId || null,
        type: alertData.type,
        message: alertData.message,
        sentAt: new Date(),
        channels: ['in-app']
      }
    })
    
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
  return await prisma.notification.findMany({
    where: {
      userId: userId,
      readAt: null
    },
    orderBy: { sentAt: 'desc' },
    take: 20
  })
}

export const markAsRead = async (notificationId) => {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() }
  })
}
