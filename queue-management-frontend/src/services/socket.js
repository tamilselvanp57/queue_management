import { io } from 'socket.io-client'
import { SOCKET_URL } from '../utils/constants'

let socket = null

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token: localStorage.getItem('token')
      }
    })
  }
  return socket
}

export const getSocket = () => socket

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect()
  }
}

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect()
  }
}
