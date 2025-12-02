# 🚀 Mercury Mystery Admin - Complete Startup Checklist

## ✅ Pre-Flight Checklist

Before starting the application, ensure all these are ready:

---

## 1️⃣ MongoDB Setup

### Check MongoDB is Running

**Windows:**
```powershell
# Open Services (Win + R, type "services.msc")
# Look for "MongoDB Server" - Status should be "Running"
```

**Mac:**
```bash
brew services list | grep mongodb
# Should show: mongodb-community started <user> ~/Library/LaunchAgents/...
```

**Linux:**
```bash
sudo systemctl status mongod
# Should show: active (running)
```

### Start MongoDB if Needed

**Windows:**
- Open Services → Right-click "MongoDB Server" → Start

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Auto-start on boot
```

### Verify MongoDB Connection

```bash
# Connect using mongosh (MongoDB Shell)
mongosh mongodb://localhost:27017

# You should see: "Connected to MongoDB"
# Type: exit
```

**✅ MongoDB Status:** [ ] Running on `localhost:27017`

---

## 2️⃣ MongoDB Compass Setup

### Open MongoDB Compass

1. Launch **MongoDB Compass** application
2. Connection string should be pre-filled: `mongodb://localhost:27017`
3. Click **"Connect"** button
4. You should see connection successful (green indicator)

**✅ Compass Status:** [ ] Connected to `mongodb://localhost:27017`

---

## 3️⃣ Backend Setup

### Navigate to Backend Directory

```bash
cd backend
```

### Check Environment File

```bash
# Verify .env file exists
ls -la .env

# Check contents
cat .env
```

**Required .env Configuration:**
```env
NODE_ENV=development
PORT=5002
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
JWT_SECRET=mercury_mystery_admin_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

**✅ .env File:** [ ] Exists and configured correctly

### Install Backend Dependencies

```bash
# If first time or after pulling new changes
npm install
```

**✅ Dependencies:** [ ] Installed successfully

### Start Backend Server

```bash
npm start
```

**Expected Output:**
```
==================================================
🚀 Mercury Mystery Admin Backend Server
==================================================
📡 Server running on port: 5002
🌍 Environment: development
🔗 API Base URL: http://localhost:5002/api
📊 Health Check: http://localhost:5002/api/health
==================================================

✅ MongoDB Connected: localhost
📊 Database: mercury_mystery_admin
```

### Verify Backend Health

**Open new terminal and run:**
```bash
curl http://localhost:5002/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Mercury Mystery Admin API is running",
  "timestamp": "2024-11-28T...",
  "environment": "development",
  "database": "Connected"
}
```

**✅ Backend Status:** [ ] Running on `http://localhost:5002`

---

## 4️⃣ Frontend Setup

### Navigate to Project Root

```bash
# From backend directory
cd ..
```

### Check Frontend Configuration

```bash
# Verify API config
cat config/api.config.ts | grep BASE_URL
```

**Should show:**
```typescript
BASE_URL: 'http://localhost:5002/api',
```

**✅ API Config:** [ ] Points to `localhost:5002`

### Install Frontend Dependencies

```bash
# If first time or after pulling new changes
npm install
```

**✅ Dependencies:** [ ] Installed successfully

### Start Frontend Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h to show help
```

**✅ Frontend Status:** [ ] Running on `http://localhost:3000`

---

## 5️⃣ Database Verification in Compass

### Check Database Created

1. In MongoDB Compass, refresh the databases list
2. You should see: **`mercury_mystery_admin`**
3. Click on it to expand

### Expected Collections

After running the app and signing up, you should see:

```
📂 mercury_mystery_admin
   ├── 👤 users (Admin accounts)
   ├── 👥 auditors (Auditor profiles)
   └── 📋 audits (Audit records)
```

**Note:** Collections are created automatically when first data is inserted.

**✅ Database:** [ ] Visible in MongoDB Compass

---

## 6️⃣ Application Access

### Open Application

**Open browser and navigate to:**
```
http://localhost:3000
```

### First Time Setup

1. **Sign Up:**
   - Go to signup page
   - Create admin account
   - Email: `admin@example.com`
   - Password: Your secure password

2. **Verify in Compass:**
   - Refresh MongoDB Compass
   - Check `users` collection
   - You should see your user document

3. **Login:**
   - Use your credentials to login
   - You should see the dashboard

**✅ Application:** [ ] Accessible at `http://localhost:3000`

---

## 7️⃣ Feature Testing Checklist

### Authentication
- [ ] Sign up with new account
- [ ] Login with credentials
- [ ] View profile
- [ ] Logout

### Auditors
- [ ] View auditors list
- [ ] Create new auditor
- [ ] Edit auditor details
- [ ] View auditor in MongoDB Compass
- [ ] Delete auditor

### Audits
- [ ] View audits list
- [ ] Create new audit manually
- [ ] Upload Excel file with audits
- [ ] Assign audit to auditor
- [ ] Update audit status
- [ ] View audit in MongoDB Compass
- [ ] Delete audit

### Reports
- [ ] View dashboard statistics
- [ ] View auditor performance
- [ ] View circle performance
- [ ] Export reports

---

## 8️⃣ Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:**
```bash
# Check if MongoDB is running
# Windows: Check Services
# Mac: brew services list | grep mongodb
# Linux: sudo systemctl status mongod

# Restart MongoDB
# Mac: brew services restart mongodb-community
# Linux: sudo systemctl restart mongod
```

### Issue: "Port 5002 already in use"

**Solution:**
```bash
# Find process using port
# Mac/Linux:
lsof -i :5002

# Windows:
netstat -ano | findstr :5002

# Kill the process or change port in backend/.env
PORT=5003
```

### Issue: "CORS error in browser console"

**Solution:**
```bash
# Check backend/.env has correct CORS_ORIGIN
CORS_ORIGIN=http://localhost:3000

# Restart backend server
```

### Issue: "API calls return 404"

**Solution:**
```bash
# Verify backend is running on correct port
curl http://localhost:5002/api/health

# Check frontend config/api.config.ts
# Should be: http://localhost:5002/api
```

### Issue: "Database not appearing in Compass"

**Solution:**
```bash
# Database is created on first data insert
# 1. Make sure backend is running
# 2. Sign up or create data
# 3. Refresh Compass (click Databases → Refresh icon)
```

---

## 9️⃣ Development Workflow

### Daily Startup Sequence

1. **Start MongoDB** (if not auto-started)
   ```bash
   # Mac: brew services start mongodb-community
   # Linux: sudo systemctl start mongod
   ```

2. **Open MongoDB Compass**
   - Connect to `mongodb://localhost:27017`

3. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

4. **Start Frontend** (in new terminal)
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Navigate to `http://localhost:3000`

### Shutdown Sequence

1. **Stop Frontend:** `Ctrl + C` in terminal
2. **Stop Backend:** `Ctrl + C` in terminal
3. **MongoDB:** Can keep running or stop:
   ```bash
   # Mac: brew services stop mongodb-community
   # Linux: sudo systemctl stop mongod
   ```

---

## 🔟 Environment Summary

| Component | Location | Port | Status |
|-----------|----------|------|--------|
| **MongoDB** | localhost | 27017 | [ ] Running |
| **MongoDB Compass** | localhost | 27017 | [ ] Connected |
| **Backend API** | localhost | 5002 | [ ] Running |
| **Frontend App** | localhost | 3000 | [ ] Running |
| **Database Name** | mercury_mystery_admin | - | [ ] Created |

---

## ✅ Final Checklist

- [ ] MongoDB running on `localhost:27017`
- [ ] MongoDB Compass connected
- [ ] Backend running on `http://localhost:5002`
- [ ] Backend health check passes
- [ ] Frontend running on `http://localhost:3000`
- [ ] Database visible in Compass
- [ ] Can sign up / login
- [ ] Can create auditors
- [ ] Can view data in Compass

---

## 🎉 Success!

If all checkboxes are checked, your Mercury Mystery Admin application is fully operational!

**Quick Access Links:**
- 🌐 **Frontend:** http://localhost:3000
- 📡 **Backend API:** http://localhost:5002/api
- 🏥 **Health Check:** http://localhost:5002/api/health
- 🗄️ **MongoDB:** mongodb://localhost:27017
- 📊 **Database:** mercury_mystery_admin

---

## 📚 Additional Resources

- **[START_HERE_MONGODB_LOCAL.md](./START_HERE_MONGODB_LOCAL.md)** - Quick start guide
- **[MONGODB_COMPASS_INSTRUCTIONS.md](./MONGODB_COMPASS_INSTRUCTIONS.md)** - Compass setup
- **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - API documentation
- **[FIXED_CLASSES_LIST.md](./FIXED_CLASSES_LIST.md)** - Recent fixes
- **[backend/README.md](./backend/README.md)** - Backend documentation

---

**Happy Building! 🚀**
