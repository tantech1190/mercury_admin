# 🚀 Start Servers - Mercury Mystery Admin

## Quick Start Guide

---

## ✅ Fix Applied

**Changed:** API URL from port 5002 → 5000  
**File:** `/config/api.config.ts`  
**Now:** Frontend connects to `http://localhost:5000/api`

---

## 🎯 Start Your Application (Step-by-Step)

### Step 1: Start Backend

```bash
# Open Terminal 1
cd backend
npm start
```

**Wait for this output:**
```
✅ Server running on port 5000
✅ MongoDB connected successfully
✅ Database: mercury-mystery
```

**If you see errors:**
```bash
# Install dependencies
npm install

# Try again
npm start
```

---

### Step 2: Start Frontend

```bash
# Open Terminal 2 (new terminal, don't close backend)
npm run dev
```

**Wait for this output:**
```
VITE ready in XXX ms
➜ Local:   http://localhost:3000
➜ Network: http://192.168.X.X:3000
```

**You should also see:**
```
📡 Using default API URL: http://localhost:5000/api
```

---

### Step 3: Test Connection

**Open browser:**
```
http://localhost:3000
```

**You should see:**
- ✅ Login page loads
- ✅ No console errors
- ✅ No "Network Error"

---

## 🧪 Test Login

### Option 1: Use Existing Account

If you already created an account:
```
Email: your-email@example.com
Password: your-password
```

### Option 2: Create New Account

1. Click "Don't have an account? Sign Up"
2. Fill in:
   - Name: Admin User
   - Email: admin@mercury.com
   - Password: admin123
   - Confirm Password: admin123
3. Click "Create Account"

---

## ✅ Expected Results

### After Login/Signup:

**Console (F12):**
```
📡 Using default API URL: http://localhost:5000/api
🔐 Attempting login...
✅ Login successful!
🔍 Auth State: { isAuthenticated: true, isLoading: false, user: 'admin@mercury.com' }
```

**Screen:**
```
Toast: 🎉 Login successful! Welcome back!
→ Redirect to Dashboard (< 1 second)
```

**No more Network Error!** ✅

---

## ❌ Troubleshooting

### Error: "Cannot connect to server"

**Cause:** Backend not running or wrong port

**Solutions:**

#### Check 1: Is backend running?
```bash
# In Terminal 1, you should see:
Server running on port 5000
```

If not running:
```bash
cd backend
npm start
```

#### Check 2: What port is backend using?

Look at backend console output:
```
Server running on port XXXX
```

If it says **5001** or **5002** instead of **5000**:

**Update frontend config:**
```typescript
// /config/api.config.ts
BASE_URL: 'http://localhost:5001/api',  // Match backend port
```

Then restart frontend:
```bash
# Ctrl+C to stop
npm run dev
```

#### Check 3: Test backend directly

```bash
# Test if backend is accessible
curl http://localhost:5000

# Or open in browser:
# http://localhost:5000
```

**Expected:** Some response (not "Connection refused")

---

### Error: "Port 5000 already in use"

**Solution: Kill the process**

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:5000 | xargs kill -9
```

**Then start backend again:**
```bash
cd backend
npm start
```

---

### Error: "MongoDB connection failed"

**Cause:** MongoDB not running

**Solution:**

#### Option 1: Start MongoDB (if installed locally)
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### Option 2: Use MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Create database: `mercury-mystery`

#### Option 3: Check connection string

**Backend:** Check `backend/.env` or `backend/config/db.js`
```
MONGO_URI=mongodb://localhost:27017/mercury-mystery
```

---

### Error: "CORS policy blocked"

**Cause:** Backend not configured for frontend origin

**Solution:**

Update backend CORS config:

**backend/server.js** or **backend/app.js:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

Restart backend after change.

---

## 📋 Startup Checklist

Before testing:

- [ ] MongoDB is running
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend started (`cd backend && npm start`)
- [ ] Backend shows "Server running on port 5000"
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend started (`npm run dev`)
- [ ] Browser open at http://localhost:3000
- [ ] Console open (F12)

---

## 🎯 Quick Reference

### Backend Port
```
Default: 5000
Check: Look at backend console
URL: http://localhost:5000
```

### Frontend Port
```
Default: 3000
URL: http://localhost:3000
```

### API Endpoint
```
Full URL: http://localhost:5000/api
Config: /config/api.config.ts
```

### MongoDB
```
Connection: mongodb://localhost:27017
Database: mercury-mystery
```

---

## ✨ Success Indicators

**Everything works when you see:**

### Terminal 1 (Backend):
```
✅ Server running on port 5000
✅ MongoDB connected
✅ Database: mercury-mystery
```

### Terminal 2 (Frontend):
```
VITE ready
➜ Local: http://localhost:3000
```

### Browser Console:
```
📡 Using default API URL: http://localhost:5000/api
🔐 Attempting login...
✅ Login successful!
```

### Browser Screen:
```
Login Page → Dashboard
Toast: 🎉 Login successful!
No errors
```

---

## 🚀 You're Ready!

**If all checks pass:**
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ No Network Error
- ✅ Login/Signup works
- ✅ Redirects work

**Your app is fully functional! 🎉**

---

## 📞 Still Having Issues?

Tell me:
1. **Backend console output** (copy/paste)
2. **Frontend console output** (copy/paste)
3. **Browser console errors** (F12 → Console)
4. **What error message you see**

I'll help you debug! 🔧

---

**Last Updated:** November 28, 2024  
**Status:** Network Error Fixed - Port corrected to 5000
