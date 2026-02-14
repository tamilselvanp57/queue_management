import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { CheckCircle, Download } from 'lucide-react'
import Header from '../../components/common/Header'

const BookingSuccessPage = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="card text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">Your spot has been reserved</p>

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Restaurant Name</h2>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <div className="text-gray-600 text-sm">Your Token</div>
                <div className="text-3xl font-bold text-primary">#28</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Time Slot</div>
                <div className="text-xl font-semibold">7:30 PM</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-gray-600 mb-4">Scan this QR code at the venue</div>
            <div className="flex justify-center">
              <QRCodeSVG
                value={JSON.stringify({ bookingId, token: 28 })}
                size={200}
                level="H"
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/queue/123/live')}
            className="btn-primary w-full"
          >
            Track Live Queue
          </button>
        </div>
      </main>
    </div>
  )
}

export default BookingSuccessPage
