# Frontend-Backend Connection Guide

## 🎯 Current Setup
- ✅ **Frontend**: Running locally on `http://localhost:3001`
- ✅ **Backend**: Production on `https://test-backend-qzj6.onrender.com`
- ✅ **Connection**: Frontend connects to production backend

## 🔄 Switching Between Local and Production

### Option 1: Use Production Backend (Current Setup)
**Best for:** Testing production features, demo to others
```bash
# Frontend .env
VITE_API_URL=https://test-backend-qzj6.onrender.com

# Just run frontend
cd test-frontend
npm run dev
```

### Option 2: Use Local Backend
**Best for:** Development, testing new features, debugging
```bash
# Frontend .env
VITE_API_URL=http://localhost:5000

# Run both frontend and backend
cd test-backend && npm run dev    # Terminal 1
cd test-frontend && npm run dev   # Terminal 2
```

## 🚀 Quick Commands

### Test Production Backend:
```bash
# Health check
Invoke-WebRequest -Uri https://test-backend-qzj6.onrender.com/api/health -Method GET

# Sign up test
Invoke-WebRequest -Uri https://test-backend-qzj6.onrender.com/api/signup -Method POST -Body '{"email":"test@example.com","password":"password123"}' -ContentType "application/json"
```

### Test Local Backend:
```bash
# First start local backend
cd test-backend && npm run dev

# Then test
Invoke-WebRequest -Uri http://localhost:5000/api/health -Method GET
```

## 🎉 You're All Set!
Your frontend is now connected to your production backend. You can:
- Sign up and sign in through the frontend
- Data persists in production
- No need to run local backend unless developing new features