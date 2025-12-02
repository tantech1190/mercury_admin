# 🔍 Diagnostic Checklist - "Failed to load response data"

## Your Issue: No Response from API

When you see **"Failed to load response data"** in the Network tab, it means the server is **NOT responding at all**.

---

## ✅ **Run This Diagnostic**

### **Test 1: Is MongoDB Running?**

```bash
mongosh
```

**Expected:** Should connect and show MongoDB shell  
**Your Result:** [ ] ✅ Connected  or  [ ] ❌ Failed

**If Failed:**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

---

### **Test 2: Is Backend Server Running?**

**Look at your backend terminal window.**

**Expected to see:**
```
🚀 Server running on port 5002
✅ MongoDB Connected Successfully
Database: mercury_mystery_admin
```

**Your Result:**
- [ ] ✅ I see this output (backend is running)
- [ ] ❌ I see errors
- [ ] ❌ I don't have a backend terminal open (backend NOT running)

**If backend NOT running:**
```bash
cd backend
npm run dev
```

---

### **Test 3: Can You Access the Health Endpoint?**

**Open browser and go to:**
```
http://localhost:5002/api/health
```

**OR use curl:**
```bash
curl http://localhost:5002/api/health
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Server is running"
}
```

**Your Result:**
- [ ] ✅ I see JSON response (backend is accessible)
- [ ] ❌ Connection refused (backend not running)
- [ ] ❌ Timeout (firewall issue)
- [ ] ❌ Other error: _______________

---

### **Test 4: Check Backend Logs**

**In your backend terminal**, do you see any errors?

**Common Errors:**

**A) Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5002
```
**Fix:**
```bash
lsof -i :5002  # Find process
kill -9 <PID>  # Kill it
```

**B) MongoDB Connection Error**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```
**Fix:**
```bash
brew services start mongodb-community
```

**C) Module Not Found**
```
Error: Cannot find module 'express'
```
**Fix:**
```bash
cd backend
npm install
```

**Your Result:**
- [ ] ✅ No errors
- [ ] ❌ Error: _______________

---

### **Test 5: Check Frontend Configuration**

**Check `/.env` file (in root directory):**
```bash
cat .env
```

**Expected:**
```
VITE_API_URL=http://localhost:5002/api
```

**Your Result:**
- [ ] ✅ File exists with correct URL
- [ ] ❌ File doesn't exist
- [ ] ❌ Wrong URL: _______________

**If wrong, I've already created it for you.** Restart frontend:
```bash
# Stop frontend (Ctrl+C)
npm run dev
```

---

### **Test 6: Check Backend Configuration**

**Check `/backend/.env` file:**
```bash
cat backend/.env
```

**Expected:**
```
PORT=5002
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
CORS_ORIGIN=http://localhost:3000
```

**Your Result:**
- [ ] ✅ File exists with PORT=5002
- [ ] ❌ File doesn't exist
- [ ] ❌ Wrong port: _______________

**If wrong, I've already created it for you.** Restart backend:
```bash
cd backend
# Stop backend (Ctrl+C)
npm run dev
```

---

### **Test 7: CORS Check**

**In browser console (F12 → Console), do you see:**
```
Access to fetch at 'http://localhost:5002/api/auth/register' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Your Result:**
- [ ] ✅ No CORS errors
- [ ] ❌ CORS error

**If CORS error:**
1. Check `backend/.env` has: `CORS_ORIGIN=http://localhost:3000`
2. Restart backend: `cd backend && npm run dev`

---

### **Test 8: Network Tab Analysis**

**In browser (F12 → Network tab):**

**When you try to register, what do you see?**

**Request URL:**
- [ ] ✅ `http://localhost:5002/api/auth/register`
- [ ] ❌ Different URL: _______________

**Status Code:**
- [ ] ✅ 200 or 201 (Success!)
- [ ] ❌ (failed) - No response
- [ ] ❌ 404 - Endpoint not found
- [ ] ❌ 500 - Server error
- [ ] ❌ Other: _______________

**Response:**
- [ ] ✅ JSON data
- [ ] ❌ "Failed to load response data"
- [ ] ❌ Empty
- [ ] ❌ Error message: _______________

---

## 📊 **Results Summary**

Fill this out based on your tests above:

```
MongoDB Running:         [ ] Yes  [ ] No
Backend Running:         [ ] Yes  [ ] No
Health Endpoint Works:   [ ] Yes  [ ] No
Frontend .env Correct:   [ ] Yes  [ ] No
Backend .env Correct:    [ ] Yes  [ ] No
CORS Configured:         [ ] Yes  [ ] No
Network Request Made:    [ ] Yes  [ ] No
Response Received:       [ ] Yes  [ ] No
```

---

## 🎯 **Common Scenarios & Solutions**

### **Scenario 1: Backend Not Running**
```
MongoDB Running:         [✅] Yes
Backend Running:         [❌] No    <-- ISSUE
Health Endpoint Works:   [❌] No
```

**Solution:**
```bash
cd backend
npm run dev
```

---

### **Scenario 2: MongoDB Not Running**
```
MongoDB Running:         [❌] No    <-- ISSUE
Backend Running:         [❌] No
Health Endpoint Works:   [❌] No
```

**Solution:**
```bash
brew services start mongodb-community
# Then start backend:
cd backend
npm run dev
```

---

### **Scenario 3: Port Mismatch**
```
Frontend .env:    VITE_API_URL=http://localhost:5000/api  <-- Wrong port
Backend .env:     PORT=5002  <-- Different port
```

**Solution:**
Update `/.env` to use 5002:
```env
VITE_API_URL=http://localhost:5002/api
```
Restart frontend.

---

### **Scenario 4: CORS Error**
```
Backend Running:         [✅] Yes
Health Endpoint Works:   [✅] Yes
CORS Configured:         [❌] No    <-- ISSUE
```

**Solution:**
Check `backend/.env`:
```env
CORS_ORIGIN=http://localhost:3000
```
Restart backend.

---

### **Scenario 5: Everything Running, Still Failing**
```
MongoDB Running:         [✅] Yes
Backend Running:         [✅] Yes
Health Endpoint Works:   [✅] Yes
All .env files correct:  [✅] Yes
But registration fails:  [❌] Yes   <-- ISSUE
```

**Solution:**
Check backend terminal for errors during the request.
Check browser console for JavaScript errors.
Try this curl command:
```bash
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123","confirmPassword":"password123"}'
```

---

## 🔧 **Step-by-Step Fix (Most Likely Issue)**

Based on "Failed to load response data", here's what to do:

### **1. Stop Everything**
```bash
# Press Ctrl+C in all terminal windows
```

### **2. Start MongoDB**
```bash
# macOS
brew services start mongodb-community

# Verify
mongosh
# Type: exit
```

### **3. Start Backend**
```bash
cd backend
npm run dev

# WAIT for:
# ✅ Server running on port 5002
# ✅ MongoDB Connected Successfully
```

### **4. Test Health Endpoint**
```bash
# In new terminal
curl http://localhost:5002/api/health

# Should show JSON
```

### **5. Start Frontend**
```bash
# From root directory
npm run dev

# WAIT for:
# ✅ Local: http://localhost:3000/
```

### **6. Try Registration**
```
1. Open http://localhost:3000
2. Open DevTools (F12)
3. Click Network tab
4. Try signup
5. Check Network tab for request/response
```

---

## ✅ **Success Indicators**

You'll know it's working when:

1. **Backend Terminal:**
   ```
   🚀 Server running on port 5002
   ✅ MongoDB Connected Successfully
   Database: mercury_mystery_admin
   ```

2. **Test Health Endpoint:**
   ```bash
   $ curl http://localhost:5002/api/health
   {"status":"success","message":"Server is running"}
   ```

3. **Browser Network Tab:**
   ```
   POST http://localhost:5002/api/auth/register
   Status: 201 Created
   Response: { "success": true, "data": {...} }
   ```

4. **Browser shows toast:**
   ```
   ✅ "Welcome! Account created successfully"
   ```

5. **MongoDB Compass shows:**
   ```
   Database: mercury_mystery_admin
   Collection: users
   Documents: 1
   ```

---

## 📞 **Next Steps Based on Results**

**If Test 1 Failed (MongoDB):**
→ Read `/PORT_5002_SETUP.md` - Section "Issue 4"

**If Test 2 Failed (Backend):**
→ Read `/START_HERE.md` - Step 4

**If Test 3 Failed (Health Endpoint):**
→ Backend not accessible, check firewall

**If Test 4 Shows Errors:**
→ Read `/PORT_5002_SETUP.md` - Troubleshooting section

**If Test 7 Shows CORS:**
→ Read `/PORT_5002_SETUP.md` - Issue 3

**If All Tests Pass but Registration Fails:**
→ Check browser console and backend terminal for errors
→ Try curl command to test API directly

---

**👉 Start with Test 1 and work through each test!**
**👉 Most likely issue: Backend is not running (Test 2)**
