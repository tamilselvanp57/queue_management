import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roleParam = searchParams.get('role')
  const isAdmin = roleParam === 'admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password, role: isAdmin ? 'admin' : 'user' })
      toast.success('Login successful!')
      navigate(isAdmin ? '/admin/dashboard' : '/home')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isAdmin ? 'Admin Login' : 'Login'}
        </h2>
        <div className="flex justify-center mb-6 text-sm">
          <Link
            to="/login?role=user"
            className={`px-4 py-2 rounded-l-lg border ${!isAdmin ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            User
          </Link>
          <Link
            to="/login?role=admin"
            className={`px-4 py-2 rounded-r-lg border ${isAdmin ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            Admin
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to={isAdmin ? '/register?role=admin' : '/register?role=user'} className="text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
