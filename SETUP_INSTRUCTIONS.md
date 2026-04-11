# SmartQueue Setup Instructions

## Complete System Features

### User Features
- Browse hotels and banks across 10 major Indian cities
- Real-time location tracking with nearest city detection
- Filter by region (North, South, East, West, Central, Northeast India)
- Book slots with live countdown timer
- Receive notifications when turn is approaching (5 mins alert)
- Browser notification when it's your turn
- View booking history with filter (active/completed/cancelled)
- Cancel bookings
- Export booking history to CSV
- Real-time queue updates via WebSocket

### Admin Features
- Separate admin login for hotel/bank owners
- Real-time dashboard with statistics
- View active bookings queue
- Complete bookings (marks customer service as done)
- Auto-updates queue and notifies customers
- Live refresh every 5 seconds

## Setup Instructions

### 1. Backend Setup

```bash
cd queue-management-backend

# Install dependencies
npm install

# Create .env file
echo MONGO_URI=mongodb://localhost:27017/smartqueue > .env
echo JWT_SECRET=your_secret_key_here >> .env
echo PORT=5000 >> .env

# Seed database with 100 locations (50 hotels + 50 banks)
npm run seed

# Start server
npm run dev
```

### 2. Frontend Setup

```bash
cd queue-management-frontend

# Install dependencies
npm install

# Create .env file
echo VITE_API_URL=http://localhost:5000/api > .env
echo VITE_SOCKET_URL=http://localhost:5000 >> .env

# Start development server
npm run dev
```

### 3. Access the Application

**User Access:**
- URL: http://localhost:5173
- Register new account or use existing credentials

**Admin Access:**
- URL: http://localhost:5173/login
- Check "Login as Admin" checkbox
- Email: admin.{placeId}@smartqueue.com
- Password: admin123
- Note: After seeding, check console for actual admin emails

## Database Structure

### Collections Created:
1. **users** - Customer and admin accounts
2. **places** - Hotels and banks (100 locations)
3. **bookings** - Customer bookings with status tracking

### Sample Data:
- 10 cities: Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow
- 5 hotels per city (Grand Palace, Royal Dine, Spice Garden, Urban Bistro, Taj Restaurant)
- 5 banks per city (HDFC, ICICI, SBI, Axis, Kotak Mahindra)
- Each location has dedicated admin account

## Key Features Implementation

### Live Countdown Timer
- Calculates time until booking slot
- Shows hours, minutes, seconds
- Alert at 5 minutes before turn
- Browser notification support
- Visual alert when time is up

### Admin Dashboard
- Real-time booking queue
- Statistics: Total today, Active queue, Completed today
- Complete booking button
- Auto-refresh every 5 seconds
- WebSocket updates

### Real-time Notifications
- Socket.io for live updates
- User joins room: `user-{userId}`
- Place joins room: `place-{placeId}`
- Events: queue-update, booking-completed

### Location Features
- GPS tracking with nearest city
- Distance calculation (Haversine formula)
- Filter by region and city
- Map view with markers
- 50km radius search

## Testing the System

### Test User Flow:
1. Register/Login as user
2. Enable live location tracking
3. Select region and city
4. Browse hotels or banks
5. Book a slot
6. View countdown timer in "My Bookings"
7. Receive notification when turn arrives
8. Cancel booking if needed

### Test Admin Flow:
1. Login as admin (check console for credentials after seeding)
2. View dashboard statistics
3. See active bookings queue
4. Click "Complete" to mark service done
5. Customer receives real-time notification
6. Queue updates automatically

## Important Notes

- MongoDB must be running on localhost:27017
- Browser notifications require HTTPS in production
- Run seed script only once to populate data
- Admin credentials are auto-generated per location
- WebSocket connection required for real-time features
