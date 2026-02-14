# SmartQueue - Complete Setup Guide

## Backend Setup

```bash
cd queue-management-backend
npm install
cp .env.example .env
```

Edit .env:
```
MONGODB_URI=mongodb://localhost:27017/smartqueue
JWT_SECRET=your_secret_key
PORT=5000
```

Seed database:
```bash
npm run seed
```

Start server:
```bash
npm run dev
```

## Frontend Setup

```bash
cd queue-management-frontend
npm install leaflet react-leaflet
npm run dev
```

## Features Implemented

✅ Backend with MongoDB + Express + Socket.io
✅ Geolocation-based place search
✅ Real-time queue updates
✅ JWT authentication
✅ Leaflet map integration
✅ Location tracking
✅ Admin queue management

## Test Flow

1. Register user
2. Allow location access
3. View hotels on map
4. Click hotel marker
5. Book slot
6. Track queue in real-time
7. Get notification when turn is near
