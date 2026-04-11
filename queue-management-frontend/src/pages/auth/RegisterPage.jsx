import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [searchParams] = useSearchParams()
  const isAdmin = searchParams.get('role') === 'admin'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessType: 'hotels',
    placeName: '',
    region: '',
    city: '',
    state: '',
    address: '',
    placePhone: '',
    description: '',
    hours: '',
    latitude: '',
    longitude: ''
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      }

      if (isAdmin) {
        payload.role = 'admin'
        payload.businessType = formData.businessType
        payload.place = {
          name: formData.placeName,
          region: formData.region,
          city: formData.city,
          state: formData.state,
          address: formData.address,
          phone: formData.placePhone,
          description: formData.description,
          hours: formData.hours,
          latitude: formData.latitude,
          longitude: formData.longitude
        }
      }

      await register(payload)
      toast.success('Registration successful!')
      navigate(isAdmin ? '/admin/dashboard' : '/home')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">{isAdmin ? 'Admin Register' : 'Register'}</h2>
        <div className="flex justify-center mb-6 text-sm">
          <Link
            to="/register?role=user"
            className={`px-4 py-2 rounded-l-lg border ${!isAdmin ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            User
          </Link>
          <Link
            to="/register?role=admin"
            className={`px-4 py-2 rounded-r-lg border ${isAdmin ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            Admin
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {isAdmin && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Business Type</label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="hotels">Hotel</option>
                  <option value="banks">Bank</option>
                  <option value="hospitals">Hospital</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <input name="placeName" value={formData.placeName} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Region</label>
                <input name="region" value={formData.region} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input name="city" value={formData.city} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input name="state" value={formData.state} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input name="address" value={formData.address} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business Phone</label>
                <input name="placePhone" value={formData.placePhone} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input name="description" value={formData.description} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hours</label>
                <input name="hours" value={formData.hours} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Latitude</label>
                <input name="latitude" value={formData.latitude} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Longitude</label>
                <input name="longitude" value={formData.longitude} onChange={handleChange} className="input-field" required />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account? <Link to={isAdmin ? '/login?role=admin' : '/login?role=user'} className="text-primary font-semibold">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
