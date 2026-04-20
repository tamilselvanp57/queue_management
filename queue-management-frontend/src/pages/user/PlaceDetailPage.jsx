import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Star, Phone } from 'lucide-react'
import Header from '../../components/common/Header'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import axios from '../../services/axiosConfig'

const PlaceDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [partySize, setPartySize] = useState(1)

  const timeSlots = ['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM']

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const { data } = await axios.get(`/places/${id}`)
        setPlace(data)
      } catch (error) {
        toast.error('Failed to load place details')
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }
    fetchPlace()
  }, [id, navigate])

  const handleBooking = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!selectedSlot) {
      toast.error('Please select a time slot')
      return
    }
    try {
      setLoading(true)
      const res = await axios.post('/bookings', {
        placeId: id,
        slotTime: selectedSlot,
        partySize: parseInt(partySize)
      })
      toast.success('Booking confirmed!')
      navigate(`/queue/${id}`) // Navigate straight to LiveQueue tracking!
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm booking')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !place) return <div className="py-20 text-center"><Loader size="lg" /></div>
  if (!place) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="card">
          <div className="h-64 rounded-lg overflow-hidden mb-6">
             <img src={place.image || '/assets/hotel_thumbnail.png'} alt={place.name} className="w-full h-full object-cover" />
          </div>

          <h1 className="text-3xl font-bold mb-4">{place.name}</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{place.address}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              <span>4.5 Rating</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>{place.hours || 'Open Now'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="w-5 h-5 mr-2" />
              <span>{place.phone}</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Book a Slot</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Time Slot</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
              className="input-field max-w-[200px]"
            />
          </div>

          <button onClick={handleBooking} disabled={loading} className="btn-primary w-full mt-4">
            {loading ? 'Confirming...' : 'Join Queue & Confirm Booking'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default PlaceDetailPage
