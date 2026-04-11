import { useEffect, useState } from 'react'
import { Clock, Bell } from 'lucide-react'

const BookingCountdown = ({ booking, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(null)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    if (!booking || booking.status !== 'active') return

    const calculateTimeLeft = () => {
      const slotTime = new Date()
      const [time, period] = booking.slotTime.split(' ')
      let [hours, minutes] = time.split(':').map(Number)
      
      if (period === 'PM' && hours !== 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0
      
      slotTime.setHours(hours, minutes, 0, 0)
      
      const now = new Date()
      const diff = slotTime - now
      
      if (diff <= 0) {
        setShowAlert(true)
        if (onTimeUp) onTimeUp()
        return null
      }
      
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60))
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000)
      
      if (diff <= 5 * 60 * 1000 && !showAlert) {
        setShowAlert(true)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('SmartQueue Alert', {
            body: `Your turn is in ${minutesLeft} minutes!`,
            icon: '/logo.png'
          })
        }
      }
      
      return { hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    setTimeLeft(calculateTimeLeft())
    
    return () => clearInterval(timer)
  }, [booking])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  if (!timeLeft && showAlert) {
    return (
      <div className="bg-red-500 text-white rounded-lg p-4 animate-pulse">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 animate-bounce" />
          <div>
            <p className="font-bold text-lg">🔔 IT'S YOUR TURN!</p>
            <p className="text-sm">Please proceed to the counter</p>
          </div>
        </div>
      </div>
    )
  }

  if (!timeLeft) return null

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 10

  return (
    <div className={`rounded-lg p-4 ${isUrgent ? 'bg-red-50 border-2 border-red-500' : 'bg-blue-50 border-2 border-blue-500'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className={`w-6 h-6 ${isUrgent ? 'text-red-600 animate-pulse' : 'text-blue-600'}`} />
          <div>
            <p className="text-sm text-gray-600">Time until your slot</p>
            <p className={`text-2xl font-bold ${isUrgent ? 'text-red-600' : 'text-blue-600'}`}>
              {timeLeft.hours > 0 && `${timeLeft.hours}h `}
              {timeLeft.minutes}m {timeLeft.seconds}s
            </p>
          </div>
        </div>
        {isUrgent && (
          <Bell className="w-8 h-8 text-red-600 animate-bounce" />
        )}
      </div>
      {isUrgent && (
        <p className="mt-2 text-sm text-red-600 font-semibold">⚠️ Get ready! Your turn is coming soon</p>
      )}
    </div>
  )
}

export default BookingCountdown
