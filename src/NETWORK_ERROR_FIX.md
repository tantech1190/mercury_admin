# 🔧 Network Error Fix - Mercury Mystery Admin

## ✅ Fix Applied

**Problem:** Frontend trying to connect to port 5002, but backend runs on port 5000  
**Solution:** Changed API_CONFIG.BASE_URL to `http://localhost:5000/api`

---

## 🚀 Test the Fix

### Step 1: Make Sure Backend is Running

```bash
cd backend
npm start
```

**You should see:**
```
✅ Server running on port 5000
✅ MongoDB connected
```

### Step 2: Restart Frontend

**Stop frontend:** Press `Ctrl+C` in frontend terminal

**Start again:**
```bash
npm run dev
```

**You should see:**
```
📡 Using default API URL: http://localhost:5000/api
```

### Step 3: Test Login

1. Go to http://localhost:3000
2. Open Console (F12)
3. Try to login

**Expected:** No more "Network Error"! ✅

---

## 🐛 If Still Getting Network Error

### Check 1: Is Backend Running?

```bash
# Test backend directly
curl http://localhost:5000/api/auth/login

# Or open in browser:
# http://localhost:5000
```

**Expected:** Some response (not "Connection refused")

### Check 2: Check Backend Port

Look at your backend console:
```
Server running on port XXXX
```

**If it says port 5001 or something else:**

Update `/config/api.config.ts`:
```typescript
BASE_URL: 'http://localhost:XXXX/api',
```

### Check 3: CORS Error?

If you see "CORS policy" error instead of "Network Error":

**Backend needs CORS configuration:**

Check `backend/server.js` or `backend/app.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## 📋 Quick Checklist

- [ ] Backend is running on port 5000
- [ ] Frontend API config points to port 5000
- [ ] Frontend is restarted after config change
- [ ] Can access http://localhost:5000 in browser
- [ ] No firewall blocking ports

---

## 🎯 Common Port Issues

### Backend Running on Different Port?

**Check backend code:**
```javascript
// backend/server.js or app.js
const PORT = process.env.PORT || 5000;  // What port is this?
```

**Update frontend config to match:**
```typescript
// /config/api.config.ts
BASE_URL: 'http://localhost:PORT/api',
```

### Port Already in Use?

```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux - Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

---

## ✨ After Fix Works

**You should see in console:**
```
📡 Using default API URL: http://localhost:5000/api
🔐 Attempting login...
✅ Login successful!
```

**No more Network Error!** 🎉

---

## 📞 Still Having Issues?

Tell me:
1. What port is your backend running on?
2. What error do you see in console?
3. Can you access http://localhost:5000 in browser?

---

**Last Updated:** November 28, 2024  
**Status:** Fixed - Port changed from 5002 to 5000
