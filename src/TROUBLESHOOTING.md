# 🔧 Troubleshooting Guide

## Common Errors & Solutions

### ✅ Error: `Cannot read properties of undefined (reading 'VITE_API_URL')`

**Status**: FIXED ✅

**Solution**: We created `/config/api.config.ts` with hardcoded fallback values.

**What to do**:
1. Open `/config/api.config.ts`
2. Verify `BASE_URL: 'http://localhost:5000/api'`
3. Change if your backend uses a different port
4. Reload the app

---

### ❌ Error: `Network Error` or `ERR_CONNECTION_REFUSED`

**Cause**: Backend server is not running

**Solution**:
```bash
# Open a new terminal
cd backend
npm run dev
```

**Verify**: Should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
```

---

### ❌ Error: `MongooseError: connect ECONNREFUSED`

**Cause**: MongoDB is not running

**Solution**:

**macOS**:
```bash
brew services start mongodb-community
```

**Linux**:
```bash
sudo systemctl start mongod
```

**Windows**:
```bash
net start MongoDB
```

**Verify MongoDB is running**:
```bash
mongosh
# Should connect without errors
```

---

### ❌ Error: `Cannot POST /api/auth/login`

**Cause**: Backend routes not loaded properly

**Solution**:
1. Check backend terminal for errors
2. Verify backend `.env` file exists
3. Restart backend server:
   ```bash
   cd backend
   npm run dev
   ```

---

### ❌ Error: `Unexpected token < in JSON`

**Cause**: API is returning HTML (error page) instead of JSON

**Solution**:
1. Check if backend is running
2. Verify API URL in `/config/api.config.ts`
3. Check backend terminal for errors
4. Test API directly: `http://localhost:5000/api/auth/login` (should show "Cannot GET")

---

### ❌ Error: `CORS Error` / `Access-Control-Allow-Origin`

**Cause**: Backend CORS not configured properly

**Solution**:
1. Check `backend/.env`:
   ```env
   CORS_ORIGIN=http://localhost:3000
   ```
2. Make sure frontend is running on port 3000
3. Restart backend server
4. If frontend is on different port, update `CORS_ORIGIN`

---

### ❌ Error: `JWT Token Expired` or `Unauthorized (401)`

**Cause**: Token expired or invalid

**Solution**:
1. Logout from the app
2. Login again
3. If problem persists, clear localStorage:
   ```javascript
   // In browser console
   localStorage.clear();
   location.reload();
   ```

---

### ❌ Error: `Cannot find module 'axios'`

**Cause**: Dependencies not installed

**Solution**:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

---

### ❌ Backend starts but shows errors

**Check these**:
1. ✅ `backend/.env` file exists
2. ✅ MongoDB is running
3. ✅ `MONGODB_URI` in `.env` is correct
4. ✅ No port conflicts (port 5000 is free)

**Find what's using port 5000**:
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

### ❌ Frontend shows blank page

**Solution**:
1. Open browser console (F12)
2. Look for JavaScript errors
3. Check if components are imported correctly
4. Verify AuthContext is wrapping the app

---

### ❌ MongoDB Compass shows empty database

**Causes**:
1. Wrong database name
2. No data created yet
3. Connected to wrong MongoDB instance

**Solution**:
1. Verify connection: `mongodb://localhost:27017`
2. Database name should be: `mercury_mystery_admin`
3. Create data through the app first (signup, add auditor, etc.)
4. Click Refresh button in Compass

---

### ❌ Signup works but can't see user in MongoDB

**Solution**:
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database: `mercury_mystery_admin`
4. Click on `users` collection
5. Click the **Refresh** button
6. User should appear

---

### ❌ TypeScript errors in VSCode

**Solution**:
```bash
# Restart TypeScript server in VSCode
# CMD/CTRL + Shift + P
# Type: "TypeScript: Restart TS Server"
```

---

### ❌ App works but MongoDB Compass doesn't update

**Solution**:
- Always click the **Refresh** button in Compass after operations
- Compass doesn't auto-refresh
- Data IS saved, just need to refresh the view

---

## Quick Health Check

Run these commands to verify everything is working:

### 1. Check MongoDB
```bash
mongosh
# Should connect successfully
show dbs
# Should show mercury_mystery_admin (after first data is created)
```

### 2. Check Backend
```bash
curl http://localhost:5000/api
# Should return JSON or HTML (not connection error)
```

### 3. Check Frontend
```bash
# Open http://localhost:3000
# Should show login/signup page
```

### 4. Check API Configuration
```bash
# Open browser console on http://localhost:3000
# Should see: "🚀 API Client initialized: { baseURL: ... }"
```

---

## Still Having Issues?

### Debugging Checklist:
- [ ] MongoDB is running (`mongosh` connects)
- [ ] Backend is running (terminal shows "Server running on port 5000")
- [ ] Frontend is running (browser shows app on localhost:3000)
- [ ] No CORS errors in browser console
- [ ] Backend `.env` file exists
- [ ] API URL in `/config/api.config.ts` is correct
- [ ] All dependencies installed (`npm install` in both root and backend)

### Get More Info:
1. **Browser Console**: F12 → Console tab
2. **Backend Logs**: Check terminal where backend is running
3. **MongoDB Logs**: Check MongoDB terminal
4. **Network Tab**: F12 → Network tab → Check failed requests

### Test API Manually:
Use Postman or curl to test:
```bash
# Test backend is alive
curl http://localhost:5000/api

# Test signup
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

---

## Fresh Start (Nuclear Option)

If nothing works, start fresh:

```bash
# Stop all services
# Kill frontend, backend, MongoDB

# Clear everything
rm -rf node_modules backend/node_modules
npm cache clean --force

# Reinstall
npm install
cd backend
npm install

# Start MongoDB
brew services start mongodb-community  # or your OS command

# Start backend
cd backend
npm run dev

# Start frontend (in new terminal)
npm run dev
```

---

**Last Updated**: November 28, 2024
