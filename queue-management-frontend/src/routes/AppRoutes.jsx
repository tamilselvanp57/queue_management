import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import HomePage from '../pages/user/HomePage'
import CategoryListPage from '../pages/user/CategoryListPage'
import PlaceDetailPage from '../pages/user/PlaceDetailPage'
import TokenPage from '../pages/user/TokenPage'
import LiveQueuePage from '../pages/user/LiveQueuePage'
import BookingSuccessPage from '../pages/user/BookingSuccessPage'
import MyBookingsPage from '../pages/user/MyBookingsPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return user ? children : <Navigate to="/login" />
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/categories/:type" element={<CategoryListPage />} />
      <Route path="/place/:id" element={<PlaceDetailPage />} />
      <Route path="/token/:tokenId" element={<PrivateRoute><TokenPage /></PrivateRoute>} />
      <Route path="/queue/:placeId/live" element={<LiveQueuePage />} />
      <Route path="/booking/success/:bookingId" element={<BookingSuccessPage />} />
      <Route path="/my-bookings" element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
    </Routes>
  )
}

export default AppRoutes
