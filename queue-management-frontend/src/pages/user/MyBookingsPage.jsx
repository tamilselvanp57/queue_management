import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, Trash2, Calendar, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import Header from '../../components/common/Header'
import Loader from '../../components/common/Loader'
import { exportBookingHistory } from '../../utils/exportUtils'
import axios from '../../services/axiosConfig'
import toast from 'react-hot-toast'

const MyBookingsPage = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, completed, cancelled

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/bookings/my')
      setBookings(data)
    } catch (error) {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    
    try {
      await axios.delete(`/bookings/${id}`)
      toast.success('Booking cancelled successfully')
      fetchBookings()
    } catch (error) {
      toast.error('Failed to cancel booking')
    }
  }

  const handleRebook = (booking) => {
    navigate(`/place/${booking.place._id}`)
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <AlertCircle className="w-5 h-5 text-blue-600" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="lg" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <div className="flex space-x-3">
            {bookings.length > 0 && (
              <button
                onClick={() => exportBookingHistory(bookings)}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600"
              >
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              New Booking
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {['all', 'active', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-semibold capitalize whitespace-nowrap ${
                filter === tab
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab} ({bookings.filter(b => tab === 'all' || b.status === tab).length})
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="card text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-4">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Browse Places
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold">{booking.place?.name}</h3>
                      {getStatusIcon(booking.status)}
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{booking.place?.address}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{booking.slotTime}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {booking.tokenNumber && (
                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                          Token #{booking.tokenNumber}
                        </span>
                      )}
                      <span className={`text-sm px-3 py-1 rounded-full font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      {booking.partySize && (
                        <span className="text-sm text-gray-600">
                          {booking.partySize} {booking.partySize === 1 ? 'person' : 'people'}
                        </span>
                      )}
                    </div>

                    {booking.createdAt && (
                      <div className="mt-3 text-xs text-gray-500">
                        Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    {booking.status === 'active' && (
                      <>
                        <button
                          onClick={() => navigate(`/queue/${booking.place._id}/live`)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 whitespace-nowrap"
                        >
                          Track Queue
                        </button>
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="flex items-center justify-center text-red-600 hover:text-red-800 px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </>
                    )}
                    
                    {(booking.status === 'completed' || booking.status === 'cancelled') && (
                      <button
                        onClick={() => handleRebook(booking)}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 whitespace-nowrap"
                      >
                        Book Again
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Statistics Card */}
        {bookings.length > 0 && (
          <div className="card mt-8 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="font-bold mb-4">Booking Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {bookings.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default MyBookingsPage
