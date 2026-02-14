import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import placeRoutes from './routes/placeRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  req.io = io
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/places', placeRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/admin', adminRoutes)

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.on('join-queue', (placeId) => socket.join(`place-${placeId}`))
  socket.on('leave-queue', (placeId) => socket.leave(`place-${placeId}`))
  socket.on('disconnect', () => console.log('Client disconnected'))
})

connectDB()

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
