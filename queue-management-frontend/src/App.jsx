import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { QueueProvider } from './context/QueueContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueueProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </QueueProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
