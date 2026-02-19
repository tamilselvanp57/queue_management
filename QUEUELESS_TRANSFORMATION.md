# SmartQueue → Queueless Transformation Plan

## 🎯 System Architecture

### Frontend Architecture
```
User Flow:
Home → Nearby Places (Map/List) → Join Queue → Token Screen → Alerts → Navigate

Admin Flow:
Login → Dashboard → Counter Management → Analytics
```

### Backend Architecture
```
API Layer → Business Logic → Database → WebSocket Server → Notification Service
```

## 📊 Database Schema Updates

### 1. Users Table
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String (hashed),
  role: ['user', 'admin'],
  currentLocation: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  fcmToken: String, // For push notifications
  preferences: {
    notificationEnabled: Boolean,
    alertDistance: Number // km before arrival
  }
}
```

### 2. Places Table (Enhanced)
```javascript
{
  _id: ObjectId,
  name: String,
  category: ['restaurant', 'hospital', 'bank', 'government'],
  location: {
    type: 'Point',
    coordinates: [longitude, latitude],
    address: String,
    landmark: String
  },
  operatingHours: {
    monday: { open: '09:00', close: '18:00' },
    // ... other days
  },
  counters: [{
    counterId: String,
    name: String,
    isActive: Boolean,
    currentToken: Number,
    avgServiceTime: Number // minutes
  }],
  queueSettings: {
    maxQueueLength: Number,
    slotsPerHour: Number,
    bookingEnabled: Boolean,
    advanceBookingDays: Number
  },
  stats: {
    totalServed: Number,
    avgWaitTime: Number,
    peakHours: [String]
  }
}
```

### 3. Tokens Table (Virtual Queue)
```javascript
{
  _id: ObjectId,
  tokenNumber: String, // e.g., "A001"
  user: ObjectId (ref: User),
  place: ObjectId (ref: Place),
  counter: String,
  status: ['waiting', 'called', 'serving', 'completed', 'cancelled', 'no-show'],
  joinedAt: Date,
  estimatedCallTime: Date,
  actualCallTime: Date,
  completedAt: Date,
  userLocation: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  travelTime: Number, // minutes
  alertsSent: [{
    type: ['approaching', 'ready', 'final'],
    sentAt: Date
  }],
  queuePosition: Number,
  estimatedWaitTime: Number
}
```

### 4. Bookings Table
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  place: ObjectId (ref: Place),
  bookingDate: Date,
  timeSlot: {
    start: String, // "10:00"
    end: String    // "10:30"
  },
  status: ['confirmed', 'cancelled', 'completed', 'no-show'],
  tokenNumber: String,
  createdAt: Date,
  reminderSent: Boolean
}
```

### 5. Notifications Table
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  token: ObjectId (ref: Token),
  type: ['queue-joined', 'approaching', 'ready', 'final-call', 'booking-reminder'],
  message: String,
  sentAt: Date,
  readAt: Date,
  channels: ['in-app', 'sms', 'email', 'push']
}
```

## 🔄 API Endpoints

### User APIs
```
POST   /api/queue/join              - Join virtual queue
GET    /api/queue/status/:tokenId   - Get real-time status
DELETE /api/queue/leave/:tokenId    - Leave queue
POST   /api/queue/update-location   - Update user location
GET    /api/places/nearby           - Get nearby places with distance
POST   /api/bookings/create         - Book time slot
GET    /api/bookings/my             - Get user bookings
PUT    /api/bookings/:id/cancel     - Cancel booking
GET    /api/notifications/my        - Get user notifications
```

### Admin APIs
```
GET    /api/admin/dashboard         - Dashboard stats
POST   /api/admin/counter/next      - Call next token
POST   /api/admin/counter/skip      - Skip token
POST   /api/admin/counter/recall    - Recall token
GET    /api/admin/analytics         - Queue analytics
GET    /api/admin/queue/live        - Live queue status
```

## 🎨 UI Components Structure

### User Components
```
src/components/
├── queue/
│   ├── JoinQueueButton.jsx       - Main CTA button
│   ├── TokenDisplay.jsx          - Large token number display
│   ├── QueueProgress.jsx         - Progress bar with position
│   ├── EstimatedTime.jsx         - Dynamic wait time
│   └── AlertBanner.jsx           - Notification banner
├── map/
│   ├── NearbyPlacesMap.jsx       - Interactive map
│   ├── PlaceMarker.jsx           - Custom markers
│   ├── UserLocationMarker.jsx    - User position
│   └── NavigationButton.jsx      - Navigate to place
├── booking/
│   ├── TimeSlotPicker.jsx        - Calendar + time slots
│   ├── BookingCard.jsx           - Booking details
│   └── BookingConfirmation.jsx   - Success screen
└── notifications/
    ├── NotificationBell.jsx      - Bell icon with badge
    ├── NotificationList.jsx      - List of alerts
    └── AlertModal.jsx            - Full-screen alert
```

### Admin Components
```
src/components/admin/
├── Dashboard.jsx                 - Stats overview
├── CounterControl.jsx            - Call/Skip/Recall buttons
├── LiveQueue.jsx                 - Real-time queue list
├── Analytics.jsx                 - Charts and graphs
└── CounterSettings.jsx           - Configure counters
```

## 🚀 Key Features Implementation

### 1. Real-Time Queue Updates (WebSocket)
```javascript
// Client-side
socket.on('token-update', (data) => {
  // Update token status
  // Recalculate position
  // Update estimated time
})

socket.on('queue-position-changed', (data) => {
  // Update user's position in queue
})

socket.on('alert-trigger', (data) => {
  // Show notification
  // Play sound
  // Vibrate
})
```

### 2. Smart Alert System
```javascript
Algorithm:
1. Calculate distance from user to place
2. Get current traffic data (Google Maps API)
3. Calculate travel time
4. Monitor queue position
5. Trigger alerts:
   - Alert 1: 5 tokens away (prepare to leave)
   - Alert 2: 2 tokens away (start traveling)
   - Alert 3: Your turn (arrive now)
```

### 3. Dynamic Wait Time Prediction
```javascript
estimatedWaitTime = (queuePosition * avgServiceTime) + bufferTime
adjustedTime = estimatedWaitTime * peakHourMultiplier
```

### 4. Location-Based Features
```javascript
- Auto-detect user location
- Calculate distance to all places
- Sort by nearest first
- Show ETA to reach
- Trigger location-based alerts
```

## 📱 Page Flows

### User Journey
```
1. Home Page
   ↓
2. Allow Location Access
   ↓
3. View Nearby Places (Map/List Toggle)
   ↓
4. Select Place → View Queue Status
   ↓
5. Join Queue (or Book Slot)
   ↓
6. Token Screen (Real-time updates)
   ↓
7. Receive Alerts (Approaching/Ready)
   ↓
8. Navigate to Location
   ↓
9. Token Called → Service
```

### Admin Journey
```
1. Admin Login
   ↓
2. Dashboard (Live Stats)
   ↓
3. Select Counter
   ↓
4. View Queue
   ↓
5. Call Next / Skip / Recall
   ↓
6. View Analytics
```

## 🔧 Integration Steps

### Phase 1: Database & Backend (Week 1)
- [ ] Update database schemas
- [ ] Create new API endpoints
- [ ] Implement WebSocket server
- [ ] Add location services
- [ ] Setup notification service

### Phase 2: Core Features (Week 2)
- [ ] Virtual queue join/leave
- [ ] Real-time status updates
- [ ] Token management
- [ ] Location tracking
- [ ] Distance calculation

### Phase 3: Smart Features (Week 3)
- [ ] Alert system
- [ ] Booking system
- [ ] Wait time prediction
- [ ] Navigation integration
- [ ] Push notifications

### Phase 4: UI/UX (Week 4)
- [ ] Redesign user interface
- [ ] Create admin dashboard
- [ ] Add animations
- [ ] Mobile optimization
- [ ] Testing & refinement

## 🎯 Success Metrics

- Queue join time < 30 seconds
- Real-time updates < 1 second latency
- Alert accuracy > 90%
- User satisfaction > 4.5/5
- No-show rate < 10%

## 🔐 Security Enhancements

- Rate limiting on API endpoints
- Token encryption
- Location data privacy
- Secure WebSocket connections
- GDPR compliance for notifications

## 📊 Analytics Dashboard

Track:
- Daily queue volume
- Average wait time
- Peak hours
- No-show rate
- User satisfaction
- Counter efficiency
- Booking vs walk-in ratio
