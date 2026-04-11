import { Link } from 'react-router-dom'

const RoleSelectionPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-3">Welcome to SmartQueue</h1>
        <p className="text-center text-gray-600 mb-8">
          Select how you want to continue.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/login?role=user" className="card text-center hover:shadow-md transition-shadow">
            <div className="text-4xl mb-2">🙋</div>
            <h2 className="text-xl font-semibold mb-1">User Login</h2>
            <p className="text-sm text-gray-600">Book and track your queue</p>
          </Link>

          <Link to="/login?role=admin" className="card text-center hover:shadow-md transition-shadow">
            <div className="text-4xl mb-2">🏢</div>
            <h2 className="text-xl font-semibold mb-1">Admin Login</h2>
            <p className="text-sm text-gray-600">For hotel, bank, and hospital owners</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RoleSelectionPage
