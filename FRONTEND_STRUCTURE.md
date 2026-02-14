# SmartQueue Frontend - Complete Structure & Flow

## 📁 Folder Structure

```
queue-management-frontend/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── hotel-placeholder.png
│   │   │   ├── hospital-placeholder.png
│   │   │   └── bank-placeholder.png
│   │   └── icons/
│   │       ├── hotel-icon.svg
│   │       ├── hospital-icon.svg
│   │       └── bank-icon.svg
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   ├── home/
│   │   │   ├── CategoryCard.jsx          # Hotels, Hospitals, Banks cards
│   │   │   └── HeroSection.jsx
│   │   │
│   │   ├── category/
│   │   │   ├── RegionSelector.jsx        # Region dropdown/modal
│   │   │   ├── PlaceCard.jsx             # Individual place card (Persian Mandi, etc.)
│   │   │   ├── SearchBar.jsx
│   │   │   └── FilterBar.jsx             # Sort by busy, rating, distance
│   │   │
│   │   ├── queue/
│   │   │   ├── QueueStatusCard.jsx       # Current queue status
│   │   │   ├── LiveQueueDisplay.jsx      # Real-time queue numbers
│   │   │   ├── SlotBookingCard.jsx       # Available slots
│   │   │   ├── TimeSlotPicker.jsx
│   │   │   └── QueueAnimation.jsx        # Animated queue movement
│   │   │
│   │   ├── booking/
│   │   │   ├── BookingForm.jsx
│   │   │   ├── TicketCard.jsx            # Generated ticket with QR
│   │   │   ├── QRCodeDisplay.jsx
│   │   │   └── BookingConfirmation.jsx
│   │   │
│   │   ├── reminder/
│   │   │   ├── FloatingReminder.jsx      # Floating notification
│   │   │   ├── ReminderBell.jsx
│   │   │   └── NotificationCard.jsx
│   │   │
│   │   └── admin/
│   │       ├── QueueControlPanel.jsx     # Drag-drop queue management
│   │       ├── PlaceForm.jsx
│   │       ├── StatsCard.jsx
│   │       └── DashboardChart.jsx
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx                # User layout with header/footer
│   │   ├── AdminLayout.jsx               # Admin sidebar layout
│   │   └── AuthLayout.jsx                # Login/Register layout
│   │
│   ├── pages/
│   │   ├── user/
│   │   │   ├── HomePage.jsx              # Landing page with 3 categories
│   │   │   ├── CategoryListPage.jsx      # Hotels/Hospitals/Banks list
│   │   │   ├── PlaceDetailPage.jsx       # View queue, book slot
│   │   │   ├── LiveQueuePage.jsx         # Real-time queue tracking
│   │   │   ├── MyBookingsPage.jsx        # User's active bookings
│   │   │   ├── BookingSuccessPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx             # User & Admin login
│   │   │   ├── RegisterPage.jsx          # User registration
│   │   │   └── ForgotPasswordPage.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx        # Overview stats
│   │       ├── ManagePlacesPage.jsx      # CRUD places
│   │       ├── ManageQueuePage.jsx       # Real-time queue control
│   │       ├── BookingsPage.jsx          # All bookings
│   │       └── SettingsPage.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx               # User/Admin auth state
│   │   ├── QueueContext.jsx              # Real-time queue data
│   │   └── NotificationContext.jsx       # Reminder notifications
│   │
│   ├── hooks/
│   │   ├── useAuth.js                    # Login, logout, register
│   │   ├── useQueueSocket.js             # WebSocket connection
│   │   ├── usePolling.js                 # Fallback polling
│   │   ├── useNotification.js            # Browser notifications
│   │   └── useGeolocation.js             # User location for region
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── authApi.js                # Login, register endpoints
│   │   │   ├── placeApi.js               # Get places, categories
│   │   │   ├── queueApi.js               # Queue status, booking
│   │   │   ├── bookingApi.js             # Create, cancel booking
│   │   │   └── adminApi.js               # Admin CRUD operations
│   │   │
│   │   ├── socket.js                     # Socket.io client setup
│   │   └── axiosConfig.js                # Axios interceptors
│   │
│   ├── utils/
│   │   ├── timeUtils.js                  # Format time, calculate wait
│   │   ├── formatters.js                 # Format numbers, currency
│   │   ├── validators.js                 # Form validation
│   │   ├── qrGenerator.js                # QR code generation
│   │   └── constants.js                  # App constants
│   │
│   ├── styles/
│   │   ├── tailwind.css
│   │   └── animations.css                # Custom animations
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx                 # All route definitions
│   │   ├── PrivateRoute.jsx              # Protected user routes
│   │   └── AdminRoute.jsx                # Protected admin routes
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🔄 Complete User Flow

### **1. Landing Page (HomePage.jsx)**
```
User opens app
↓
Sees 3 category cards:
  - 🏨 Hotels
  - 🏥 Hospitals
  - 🏦 Banks
↓
Clicks "Hotels"
```

**Components Used:**
- `HeroSection.jsx` - Welcome banner
- `CategoryCard.jsx` - 3 clickable cards with icons

---

### **2. Region Selection**
```
User clicks "Hotels"
↓
Modal/Page opens: "Select Your Region"
↓
Shows regions: Downtown, Uptown, Suburbs, etc.
↓
User selects "Downtown"
```

**Components Used:**
- `RegionSelector.jsx` - Dropdown or modal with regions
- Can use `useGeolocation` to auto-detect

---

### **3. Hotels List (CategoryListPage.jsx)**
```
Shows list of hotels in Downtown:
  - Persian Mandi ⭐4.5 (🔴 Busy - 25 in queue)
  - Nahdi Mandi ⭐4.8 (🟢 Available - 5 in queue)
  - Royal Feast ⭐4.2 (🟡 Moderate - 12 in queue)
↓
User clicks "Nahdi Mandi"
```

**Components Used:**
- `SearchBar.jsx` - Search hotels
- `FilterBar.jsx` - Sort by busy, rating, distance
- `PlaceCard.jsx` - Each hotel card showing:
  - Name, rating, current queue count
  - Busy indicator (red/yellow/green)
  - Distance from user

**API Call:**
```javascript
GET /api/places?category=hotel&region=downtown
```

---

### **4. Place Detail Page (PlaceDetailPage.jsx)**
```
Shows Nahdi Mandi details:
  - Restaurant info (address, hours, rating)
  - Current Queue Status:
    - Now Serving: Token #23
    - People in Queue: 5
    - Estimated Wait: 15 mins
  - Available Time Slots:
    - 7:00 PM - 7:30 PM (2 slots)
    - 7:30 PM - 8:00 PM (5 slots)
    - 8:00 PM - 8:30 PM (3 slots)
↓
User clicks "Book Slot for 7:30 PM"
```

**Components Used:**
- `QueueStatusCard.jsx` - Live queue info
- `LiveQueueDisplay.jsx` - Animated token numbers
- `SlotBookingCard.jsx` - Available slots
- `TimeSlotPicker.jsx` - Select time

**WebSocket Connection:**
```javascript
socket.on('queue-update', (data) => {
  // Update current token, queue count in real-time
});
```

**API Call:**
```javascript
GET /api/queue/:placeId
```

---

### **5. Booking Form**
```
User fills:
  - Name
  - Phone Number
  - Number of People
  - Special Requests (optional)
↓
Clicks "Confirm Booking"
```

**Components Used:**
- `BookingForm.jsx` - Form with validation

**API Call:**
```javascript
POST /api/bookings
{
  placeId: "123",
  slotTime: "7:30 PM",
  userName: "John",
  phone: "1234567890",
  partySize: 4
}
```

---

### **6. Booking Success (BookingSuccessPage.jsx)**
```
Shows:
  - ✅ Booking Confirmed!
  - Your Token: #28
  - QR Code (scannable at restaurant)
  - Estimated Time: 7:30 PM
  - Current Token: #23
  - Your Position: 5th in queue
↓
"Track Live Queue" button
```

**Components Used:**
- `BookingConfirmation.jsx`
- `QRCodeDisplay.jsx` - QR with booking ID
- `TicketCard.jsx` - Digital ticket

**Features:**
- Download QR as image
- Share booking details
- Add to calendar

---

### **7. Live Queue Tracking (LiveQueuePage.jsx)**
```
Real-time display:
  - Now Serving: Token #25 ⬅️ (updates live)
  - Your Token: #28
  - People Ahead: 3
  - Estimated Wait: 9 mins
↓
When token #27 starts (1 token before user):
  - 🔔 Notification: "Your turn is next! Head to Nahdi Mandi"
  - FloatingReminder appears
```

**Components Used:**
- `LiveQueueDisplay.jsx` - Big animated token display
- `QueueAnimation.jsx` - Smooth transitions
- `FloatingReminder.jsx` - Sticky notification

**WebSocket Events:**
```javascript
socket.on('token-called', (tokenNumber) => {
  // Update display
  if (tokenNumber === myToken - 1) {
    showReminder();
    sendNotification();
  }
});
```

**Reminder Logic:**
```javascript
// When previous token (#27) is called:
if (currentToken === userToken - 1) {
  // Show notification
  // Play sound
  // Vibrate phone
}
```

---

### **8. My Bookings Page**
```
Shows all user bookings:
  - Active (upcoming)
  - Completed
  - Cancelled
↓
Can cancel booking
Can view QR code again
```

**Components Used:**
- `TicketCard.jsx` - Each booking card

---

## 🔐 Authentication Flow

### **User Login/Register**
```
HomePage
↓
Click "Login" in header
↓
LoginPage.jsx
  - Email/Phone
  - Password
  - "Login as Admin" link
↓
After login → Redirect to HomePage (authenticated)
```

### **Admin Login**
```
LoginPage.jsx
↓
Toggle "Login as Admin"
↓
Different credentials
↓
After login → AdminDashboard.jsx
```

**Auth Context:**
```javascript
{
  user: { id, name, email, role: 'user' | 'admin' },
  isAuthenticated: true/false,
  login(),
  logout(),
  register()
}
```

---

## 👨‍💼 Admin Flow

### **Admin Dashboard**
```
Shows:
  - Total Places: 45
  - Active Queues: 12
  - Today's Bookings: 234
  - Revenue: $5,600
↓
Sidebar:
  - Dashboard
  - Manage Places
  - Manage Queue
  - Bookings
  - Settings
```

### **Manage Places (ManagePlacesPage.jsx)**
```
Table of all places:
  - Name, Category, Region, Status
  - Edit, Delete buttons
↓
"Add New Place" button
↓
PlaceForm.jsx:
  - Name, Category, Region
  - Address, Phone
  - Operating Hours
  - Slots per hour
```

### **Manage Queue (ManageQueuePage.jsx)**
```
Real-time queue control:
  - Current Token: #25
  - Queue: [#26, #27, #28, #29, #30]
↓
Actions:
  - "Call Next" button → Moves to #26
  - Drag-drop to reorder
  - Skip/Remove token
  - Pause queue
```

**Components Used:**
- `QueueControlPanel.jsx` - Drag-drop interface
- Uses `react-beautiful-dnd` or `@dnd-kit`

---

## 🔌 WebSocket Events

### **Client Listens:**
```javascript
socket.on('queue-update', (data) => {
  // { placeId, currentToken, queueLength }
});

socket.on('token-called', (tokenNumber) => {
  // When a token is called
});

socket.on('booking-confirmed', (booking) => {
  // New booking added
});
```

### **Client Emits:**
```javascript
socket.emit('join-queue', placeId);
socket.emit('leave-queue', placeId);
```

---

## 🎨 Key Features Implementation

### **1. Real-time Queue Updates**
```javascript
// useQueueSocket.js
const useQueueSocket = (placeId) => {
  const [queueData, setQueueData] = useState(null);
  
  useEffect(() => {
    socket.emit('join-queue', placeId);
    
    socket.on('queue-update', (data) => {
      setQueueData(data);
    });
    
    return () => socket.emit('leave-queue', placeId);
  }, [placeId]);
  
  return queueData;
};
```

### **2. Smart Reminder**
```javascript
// useNotification.js
const useNotification = (userToken, currentToken) => {
  useEffect(() => {
    if (currentToken === userToken - 1) {
      // Browser notification
      new Notification('Your turn is next!', {
        body: 'Head to the restaurant now',
        icon: '/icon.png'
      });
      
      // Play sound
      new Audio('/notification.mp3').play();
      
      // Vibrate
      navigator.vibrate([200, 100, 200]);
    }
  }, [currentToken, userToken]);
};
```

### **3. QR Code Generation**
```javascript
// QRCodeDisplay.jsx
import QRCode from 'qrcode.react';

<QRCode
  value={JSON.stringify({
    bookingId: booking.id,
    token: booking.tokenNumber,
    placeId: booking.placeId
  })}
  size={200}
  level="H"
/>
```

### **4. Busy Indicator Logic**
```javascript
// utils/queueUtils.js
const getBusyStatus = (queueLength) => {
  if (queueLength > 20) return { status: 'busy', color: 'red' };
  if (queueLength > 10) return { status: 'moderate', color: 'yellow' };
  return { status: 'available', color: 'green' };
};
```

---

## 📱 Responsive Design

- **Mobile First:** All components optimized for mobile
- **Tablet:** 2-column layouts
- **Desktop:** 3-column layouts with sidebar

---

## 🎭 Animations (Framer Motion)

```javascript
// QueueAnimation.jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Token #{currentToken}
</motion.div>
```

---

## 🚀 Tech Stack

- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **State:** Context API + useReducer
- **WebSocket:** Socket.io-client
- **HTTP:** Axios
- **QR Code:** qrcode.react
- **Animations:** Framer Motion
- **Drag-Drop:** @dnd-kit/core
- **Forms:** React Hook Form + Zod
- **Notifications:** react-hot-toast

---

## 📦 Package.json Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.6.0",
    "qrcode.react": "^3.1.0",
    "framer-motion": "^10.16.0",
    "@dnd-kit/core": "^6.0.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "react-hot-toast": "^2.4.0",
    "date-fns": "^2.30.0",
    "recharts": "^2.10.0"
  }
}
```

---

## 🎯 Hackathon Winning Features

1. ✅ **Real-time WebSocket** - Live queue updates
2. ✅ **Smart Reminders** - Notification when your turn is near
3. ✅ **QR Code Tickets** - Scannable digital tickets
4. ✅ **Drag-Drop Admin** - Easy queue management
5. ✅ **AI Wait Time Prediction** - ML-based estimates
6. ✅ **Smooth Animations** - Professional UI/UX
7. ✅ **Multi-Category** - Hotels, Hospitals, Banks
8. ✅ **Region-Based** - Location-aware listings
9. ✅ **Mobile-First** - Perfect responsive design
10. ✅ **Progressive Web App** - Install on phone

---

## 🔥 Next Steps

1. Set up Vite + React project
2. Install dependencies
3. Create folder structure
4. Build components step-by-step
5. Integrate WebSocket
6. Add animations
7. Test on mobile

Would you like me to generate the actual code for any specific component?
