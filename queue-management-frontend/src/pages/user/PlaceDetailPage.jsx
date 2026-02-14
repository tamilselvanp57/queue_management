import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Star, Phone } from 'lucide-react'
import Header from '../../components/common/Header'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const PlaceDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [place, setPlace] = useState({ name: 'Loading...', address: '', phone: '', rating: 4.5 })
  const [loading, setLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [partySize, setPartySize] = useState(1)

  const timeSlots = ['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM']

  const handleBooking = () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!selectedSlot) {
      toast.error('Please select a time slot')
      return
    }
    toast.success('Booking confirmed!')
    navigate('/booking/success/123')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-4">{place.name}</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{place.address || 'Downtown'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              <span>{place.rating} Rating</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Book a Slot</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Time Slot</label>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-lg border-2 ${
                    selectedSlot === slot
                      ? 'border-primary bg-blue-50 text-primary font-semibold'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Party Size</label>
            <input
              type="number"
              min="1"
              max="20"
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              className="input-field"
            />
          </div>

          <button onClick={handleBooking} className="btn-primary w-full">
            Confirm Booking
          </button>
        </div>
      </main>
    </div>
  )
}

export default PlaceDetailPage
