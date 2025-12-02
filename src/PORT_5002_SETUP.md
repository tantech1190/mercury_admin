# 🔧 Port 5002 Configuration - Quick Fix

## ✅ Environment Files Created

I've created the `.env` files with port 5002 configured:

### Backend `.env` (Port 5002)
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
CORS_ORIGIN=http://localhost:3000
...
```

### Frontend `.env` (Points to 5002)
```env
VITE_API_URL=http://localhost:5002/api
...
```

---

## 🚀 Restart Everything

### Step 1: Stop All Running Processes
```bash
# Press Ctrl+C in both terminal windows to stop:
# - Backend server
# - Frontend server
```

### Step 2: Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Verify it's running
mongosh
# Should connect successfully, then exit with Ctrl+D or 'exit'
```

### Step 3: Start Backend (Port 5002)
```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5002
✅ MongoDB Connected Successfully
Database: mercury_mystery_admin
```

**⚠️ If you see an error:**
- "Port 5002 already in use" → See troubleshooting below
- "MongoDB connection failed" → Ensure MongoDB is running
- "Cannot find module" → Run `npm install` in backend folder

### Step 4: Start Frontend (New Terminal)
```bash
# From root directory (NOT in backend folder)
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms
Local: http://localhost:3000/
```

---

## 🧪 Test the API

### Test 1: Health Check
Open browser and go to:
```
http://localhost:5002/api/health
```

**Expected:** Should show a JSON response

### Test 2: Register User (Postman or Browser DevTools)
```bash
POST http://localhost:5002/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@mercury.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Test 3: From Frontend
1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill the form
4. Submit
5. Check browser console for API calls

---

## 🐛 Troubleshooting

### Issue 1: "Port 5002 already in use"

**Find what's using the port:**
```bash
# macOS/Linux
lsof -i :5002

# Windows
netstat -ano | findstr :5002
```

**Kill the process:**
```bash
# macOS/Linux
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

**Or change to a different port:**
Edit `backend/.env`:
```env
PORT=5003
```
Edit `/.env`:
```env
VITE_API_URL=http://localhost:5003/api
```
Then restart both servers.

---

### Issue 2: "Failed to load response data" (Your Current Issue)

This means the backend server is NOT responding. Check:

**1. Is backend running?**
```bash
# Should see process in terminal with:
🚀 Server running on port 5002
```

**2. Is MongoDB running?**
```bash
mongosh
# Should connect successfully
```

**3. Check backend terminal for errors**
Look for:
- MongoDB connection errors
- Port binding errors
- Module not found errors

**4. Test with curl:**
```bash
curl http://localhost:5002/api/health
# Should return JSON
```

**5. Check CORS:**
Ensure `CORS_ORIGIN=http://localhost:3000` in `backend/.env`

---

### Issue 3: CORS Errors

If you see "CORS policy" error in browser console:

**Fix:**
1. Ensure backend `.env` has:
   ```env
   CORS_ORIGIN=http://localhost:3000
   ```

2. Restart backend server

3. Clear browser cache

---

### Issue 4: MongoDB Connection Failed

**Error:** "MongooseServerSelectionError"

**Fix:**
```bash
# Check MongoDB status
mongosh

# If not running, start it:
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

---

### Issue 5: "Cannot find module"

**Fix:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ..
npm install
```

---

## 📋 Complete Restart Checklist

Follow these steps in order:

### 1. Stop Everything
- [ ] Stop frontend (Ctrl+C)
- [ ] Stop backend (Ctrl+C)

### 2. Verify MongoDB
- [ ] Run `mongosh` - should connect
- [ ] If not, start MongoDB

### 3. Check Environment Files
- [ ] `backend/.env` exists with PORT=5002
- [ ] `/.env` exists with VITE_API_URL=http://localhost:5002/api

### 4. Start Backend
```bash
cd backend
npm run dev
```
- [ ] Should see: "Server running on port 5002"
- [ ] Should see: "MongoDB Connected Successfully"
- [ ] No errors in terminal

### 5. Test Backend
```bash
curl http://localhost:5002/api/health
```
- [ ] Should return JSON response

### 6. Start Frontend
```bash
# In new terminal, from root
npm run dev
```
- [ ] Should see: "Local: http://localhost:3000/"
- [ ] No errors in terminal

### 7. Test Frontend
- [ ] Open http://localhost:3000
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Try to sign up
- [ ] Should see POST request to http://localhost:5002/api/auth/register
- [ ] Should get 200 or 201 response

---

## 🎯 Quick Commands Reference

### Start All Services:

**Terminal 1 - MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
npm run dev
```

---

## 🔍 Debug Mode

If still not working, enable debug logging:

**Backend - Edit server.js (temporarily):**
```javascript
// Add after imports
console.log('🔍 Environment:', process.env.NODE_ENV);
console.log('🔍 Port:', process.env.PORT);
console.log('🔍 MongoDB URI:', process.env.MONGODB_URI);
console.log('🔍 CORS Origin:', process.env.CORS_ORIGIN);
```

**Then check terminal output when starting backend.**

---

## ✅ Success Indicators

You'll know it's working when:

1. **Backend terminal shows:**
   ```
   🚀 Server running on port 5002
   ✅ MongoDB Connected Successfully
   Database: mercury_mystery_admin
   ```

2. **Frontend terminal shows:**
   ```
   VITE ready in XXX ms
   Local: http://localhost:3000/
   ```

3. **Browser Network tab shows:**
   - Request to `http://localhost:5002/api/auth/register`
   - Status: 201 Created
   - Response: JSON with user data

4. **MongoDB Compass shows:**
   - Database: mercury_mystery_admin
   - Collection: users
   - New document with your user data

---

## 🆘 Still Not Working?

Try these in order:

1. **Complete Clean Restart:**
   ```bash
   # Kill all Node processes
   killall node
   
   # Restart MongoDB
   brew services restart mongodb-community
   
   # Start backend
   cd backend
   npm run dev
   
   # Start frontend (new terminal)
   npm run dev
   ```

2. **Check Firewall:**
   - Ensure port 5002 is not blocked
   - Allow Node.js through firewall

3. **Try Different Port:**
   - Change to 5003 or 5004
   - Update both .env files

4. **Reinstall Dependencies:**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   
   # Frontend
   cd ..
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 📞 Need More Help?

Check these files:
- `/TROUBLESHOOTING.md` - Common issues
- `/QUICK_START_FIXED.md` - Step-by-step setup
- `/SETUP_INSTRUCTIONS.md` - Complete guide

---

**🎉 Once working, you should see:**
- Backend: ✅ Running on 5002
- Frontend: ✅ Running on 3000
- MongoDB: ✅ Connected
- API calls: ✅ Successful
- Toast notifications: ✅ Working

**Happy coding! 🚀**
