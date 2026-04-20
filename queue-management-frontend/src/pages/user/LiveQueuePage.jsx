import socket from '../../socket'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Header from '../../components/common/Header'

const LiveQueuePage = () => {
  const { placeId } = useParams()

  const [currentToken, setCurrentToken] = useState(0)
  const [userToken, setUserToken] = useState(0)

  const peopleAhead = Math.max(0, userToken - currentToken - 1)
  const estimatedWaitMinutes = peopleAhead * 3

  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const hasNotifiedRef = useRef(false)

  // ✅ 1. SOCKET + FETCH DATA
  useEffect(() => {
    socket.emit("join-place", placeId)

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")

        const placeRes = await axios.get(
          `http://localhost:5000/api/places/${placeId}`
        )
        setCurrentToken(placeRes.data.currentToken)

        const bookingRes = await axios.get(
          "http://localhost:5000/api/bookings/my",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const activeBooking = bookingRes.data.find(
          (b) => b.placeId === placeId && b.status === "active"
        )

        if (activeBooking) {
          setUserToken(activeBooking.tokenNumber)
        }

      } catch (err) {
        console.error(err)
      }
    }

    fetchData()

    socket.on("queue-update", (data) => {
      if (data.placeId === placeId) {
        setCurrentToken(data.currentToken)
      }
    })

    return () => {
      socket.off("queue-update")
    }
  }, [placeId])

  // ✅ 2. TIMER LOGIC (separate)
  useEffect(() => {
    const initialSeconds = Math.max(0, Math.floor(estimatedWaitMinutes * 60))
    setRemainingSeconds(initialSeconds)
    hasNotifiedRef.current = false

    if (initialSeconds <= 0) {
      toast.success('You can arrive here')
      hasNotifiedRef.current = true
      return
    }

    const intervalId = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (!hasNotifiedRef.current) {
            toast.success('You can arrive here')
            hasNotifiedRef.current = true
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [estimatedWaitMinutes])

  const formattedRemaining = (() => {
    const mins = Math.floor(remainingSeconds / 60)
    const secs = remainingSeconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  })()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="card">

          <div className="flex justify-between mb-8">
            <h1 className="text-3xl font-bold">Live Queue Tracking</h1>
            <span className="text-green-600 flex items-center">
              <span className="w-3 h-3 bg-green-600 rounded-full mr-2 animate-pulse"></span>
              LIVE
            </span>
          </div>

          <div className="text-center mb-12">
            <div className="text-gray-600 mb-4 text-lg">Now Serving</div>

            <motion.div
              key={currentToken}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-bold text-primary"
            >
              #{currentToken}
            </motion.div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="text-center">
              <div>Your Token</div>
              <div className="text-5xl font-bold">#{userToken}</div>

              <div className="grid grid-cols-2 mt-6">
                <div>
                  <div>People Ahead</div>
                  <div>{peopleAhead}</div>
                </div>
                <div>
                  <div>Estimated Wait</div>
                  <div>{formattedRemaining}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default LiveQueuePage