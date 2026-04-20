import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, CheckCircle, Clock, LogOut, History, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from '../../services/axiosConfig'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({ totalToday: 0, activeBookings: 0, completedToday: 0 })
  const [placeForm, setPlaceForm] = useState({
    name: '',
    region: '',
    city: '',
    state: '',
    address: '',
    phone: '',
    description: '',
    hours: '',
    latitude: '',
    longitude: '',
    image: ''
  })
  const [loading, setLoading] = useState(true)
  const [savingPlace, setSavingPlace] = useState(false)
  
  // Tabs: 'active' | 'history'
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login?role=admin')
      return
    }
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [bookingsRes, statsRes, placeRes] = await Promise.all([
        axios.get('/admin/bookings'),
        axios.get('/admin/stats'),
        axios.get('/admin/place')
      ])
      setBookings(bookingsRes.data)
      setStats(statsRes.data)
      const place = placeRes?.data
      if (place) {
        setPlaceForm({
          name: place.name || '',
          region: place.region || '',
          city: place.city || '',
          state: place.state || '',
          address: place.address || '',
          phone: place.phone || '',
          description: place.description || '',
          hours: place.hours || '',
          latitude: place.latitude?.toString() || '',
          longitude: place.longitude?.toString() || '',
          image: place.image || ''
        })
      }
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id) => {
    try {
      await axios.put(`/admin/bookings/${id}/complete`)
      toast.success('Booking completed')
      fetchData()
    } catch (error) {
      toast.error('Failed to complete booking')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login?role=admin')
  }

  const handlePlaceChange = (e) => {
    setPlaceForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePlaceSave = async (e) => {
    e.preventDefault()
    setSavingPlace(true)
    try {
      await axios.put('/admin/place', placeForm)
      toast.success('Business details updated')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update business details')
    } finally {
      setSavingPlace(false)
    }
  }

  const activeBookings = bookings.filter(b => b.status === 'active')
  const historyBookings = bookings.filter(b => b.status !== 'active')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">{user?.businessType} Owner - {user?.name}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-red-600 hover:text-red-800">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Business Information</h2>
          <form onSubmit={handlePlaceSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={placeForm.name} onChange={handlePlaceChange} className="input-field" placeholder="Business Name" required />
            <input name="phone" value={placeForm.phone} onChange={handlePlaceChange} className="input-field" placeholder="Business Phone" required />
            <input name="region" value={placeForm.region} onChange={handlePlaceChange} className="input-field" placeholder="Region" required />
            <input name="city" value={placeForm.city} onChange={handlePlaceChange} className="input-field" placeholder="City" required />
            <input name="state" value={placeForm.state} onChange={handlePlaceChange} className="input-field" placeholder="State" required />
            <input name="hours" value={placeForm.hours} onChange={handlePlaceChange} className="input-field" placeholder="Working Hours" />
            <input name="latitude" value={placeForm.latitude} onChange={handlePlaceChange} className="input-field" placeholder="Latitude" required />
            <input name="longitude" value={placeForm.longitude} onChange={handlePlaceChange} className="input-field" placeholder="Longitude" required />
            <input name="image" value={placeForm.image} onChange={handlePlaceChange} className="input-field md:col-span-2" placeholder="Image URL (e.g. /assets/hotel_thumbnail.png)" />
            <input name="address" value={placeForm.address} onChange={handlePlaceChange} className="input-field md:col-span-2" placeholder="Address" required />
            <textarea name="description" value={placeForm.description} onChange={handlePlaceChange} className="input-field md:col-span-2" placeholder="Description" rows={3} />
            <div className="md:col-span-2">
              <button type="submit" disabled={savingPlace} className="btn-primary">
                {savingPlace ? 'Saving...' : 'Save Business Details'}
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Today</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalToday}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Queue</p>
                <p className="text-3xl font-bold text-orange-600">{stats.activeBookings}</p>
              </div>
              <Clock className="w-12 h-12 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed Today</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedToday}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
             <h2 className="text-xl font-bold">Queue Management</h2>
             <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab('active')} 
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'active' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Active Log</span>
                </button>
                <button 
                  onClick={() => setActiveTab('history')} 
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'history' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  <span className="flex items-center"><History className="w-4 h-4 mr-2" /> History</span>
                </button>
             </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : activeTab === 'active' ? (
            activeBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No active bookings</div>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-2xl font-bold text-primary">#{booking.tokenNumber}</span>
                          <div>
                            <p className="font-semibold">{booking.user?.name}</p>
                            <p className="text-sm text-gray-600">{booking.user?.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Party Size: {booking.partySize}</span>
                          <span>Slot: {booking.slotTime}</span>
                          <span>Booked: {new Date(booking.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleComplete(booking.id)}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 flex items-center space-x-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Complete</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            historyBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No historical bookings found</div>
            ) : (
               <div className="space-y-4">
                 {historyBookings.map((booking, index) => (
                   <motion.div
                     key={booking.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.05 }}
                     className={`border rounded-lg p-4 ${booking.status === 'cancelled' || booking.status === 'no-show' ? 'bg-red-50' : 'bg-green-50'}`}
                   >
                     <div className="flex justify-between items-center opacity-80">
                       <div className="flex-1">
                         <div className="flex items-center space-x-4 mb-1">
                           <span className="text-lg font-bold">#{booking.tokenNumber}</span>
                           <p className="font-semibold">{booking.user?.name}</p>
                         </div>
                         <div className="text-xs text-gray-600">
                           <span>Booked: {new Date(booking.createdAt).toLocaleString()}</span>
                         </div>
                       </div>
                       
                       <div className="flex items-center font-semibold text-sm">
                         {booking.status === 'completed' && <><CheckCircle className="w-4 h-4 mr-1 text-green-600" /><span className="text-green-600">Completed</span></>}
                         {booking.status === 'cancelled' && <><XCircle className="w-4 h-4 mr-1 text-red-600" /><span className="text-red-600">Cancelled</span></>}
                         {booking.status === 'no-show' && <><XCircle className="w-4 h-4 mr-1 text-orange-600" /><span className="text-orange-600">No Show</span></>}
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </div>
            )
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
