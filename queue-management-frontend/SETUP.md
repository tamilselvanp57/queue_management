# SmartQueue Frontend - Setup Instructions

## ✅ Project Structure Created

```
queue-management-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   └── Loader.jsx
│   │   ├── home/
│   │   │   ├── HeroSection.jsx
│   │   │   └── CategoryCard.jsx
│   │   └── category/
│   │       ├── RegionSelector.jsx
│   │       ├── SearchBar.jsx
│   │       └── PlaceCard.jsx
│   ├── pages/
│   │   ├── user/
│   │   │   ├── HomePage.jsx
│   │   │   └── CategoryListPage.jsx
│   │   └── auth/
│   │       ├── LoginPage.jsx
│   │       └── RegisterPage.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── QueueContext.jsx
│   ├── services/
│   │   ├── axiosConfig.js
│   │   └── socket.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── utils/
│   │   └── constants.js
│   ├── styles/
│   │   └── tailwind.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.example

## 🚀 Installation Steps

1. Navigate to the project directory:
```bash
cd queue-management-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
copy .env.example .env
```

4. Start development server:
```bash
npm run dev
```

5. Open browser at: http://localhost:3000

## 📦 Installed Packages

- react + react-dom
- react-router-dom (routing)
- axios (HTTP requests)
- socket.io-client (WebSocket)
- framer-motion (animations)
- react-hot-toast (notifications)
- lucide-react (icons)
- tailwindcss (styling)

## 🎯 Current Features

✅ HomePage with 3 categories (Hotels, Hospitals, Banks)
✅ CategoryListPage with region filtering
✅ Login/Register pages
✅ Header with authentication
✅ AuthContext for state management
✅ QueueContext for WebSocket
✅ Axios interceptors
✅ Responsive design with Tailwind

## 📝 Next Steps

To complete the application, create:

1. PlaceDetailPage.jsx - View queue and book slots
2. LiveQueuePage.jsx - Real-time queue tracking
3. BookingSuccessPage.jsx - Show QR code ticket
4. Admin pages (Dashboard, ManagePlaces, ManageQueue)
5. Additional components (QRCodeDisplay, FloatingReminder, etc.)

## 🔧 Environment Variables

Update .env file with your backend URLs:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🎨 Customization

- Colors: Edit tailwind.config.js
- API endpoints: Edit src/utils/constants.js
- Styles: Edit src/styles/tailwind.css
