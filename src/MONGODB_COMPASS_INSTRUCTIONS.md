# 🗄️ MongoDB Compass Setup - Mercury Mystery Admin

## ✨ Overview

Your Mercury Mystery Admin app is configured to use **Local MongoDB** with **MongoDB Compass** for visual database management. This means:

✅ **No Cloud** - Everything runs on your computer
✅ **Visual Interface** - See your data in MongoDB Compass GUI
✅ **Full Control** - Complete access to your database
✅ **Easy Debugging** - View and edit data in real-time

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Make Sure MongoDB is Running

Your MongoDB should be running locally on `localhost:27017`

**Check if MongoDB is running:**

**Windows:** Open Services → Look for "MongoDB Server" → Should be "Running"
**Mac:** `brew services list | grep mongodb`
**Linux:** `sudo systemctl status mongod`

**If not running, start it:**

**Windows:** Start MongoDB service in Services app
**Mac:** `brew services start mongodb-community`
**Linux:** `sudo systemctl start mongod`

---

### Step 2: Connect with MongoDB Compass

1. **Open MongoDB Compass** application
2. **Connection string is pre-filled:** `mongodb://localhost:27017`
3. **Click "Connect"**
4. ✅ You're connected to local MongoDB!

---

### Step 3: Start Your Backend

```bash
cd backend
npm install  # First time only
npm start
```

**You'll see:**
```
✅ MongoDB Connected: localhost
📊 Database: mercury_mystery_admin
🚀 Server running on port: 5002
```

---

## 📊 View Your Data in Compass

Once the backend starts, **refresh MongoDB Compass** and you'll see:

```
📂 mercury_mystery_admin (Database)
   ├── 👤 users (Collection)
   ├── 👥 auditors (Collection)
   └── 📋 audits (Collection)
```

### What Each Collection Contains:

**users** - Admin accounts
- Created when you sign up
- Fields: name, email, password (hashed), role

**auditors** - Auditor profiles
- Created when you add auditors
- Fields: name, email, phone, circles, performanceMetrics

**audits** - All audit records
- Created when you upload Excel files
- Fields: storeCode, storeName, auditType, status, score, rawData

---

## 🎯 Using MongoDB Compass

### View Documents:
1. Click on a collection (e.g., "auditors")
2. See all documents listed
3. Click on a document to see full details

### Search/Filter:
Use the filter bar at the top:
```json
{ "status": "active" }
{ "circles": "DEL" }
{ "auditType": "store" }
```

### Edit Documents:
1. Click on a document
2. Edit any field directly
3. Click "Update" to save

### Delete Documents:
1. Hover over a document
2. Click the trash icon
3. Confirm deletion

### Export Data:
1. Click "Export Collection"
2. Choose JSON or CSV
3. Save to your computer

---

## 🔧 Configuration Details

Your backend is configured in `/backend/.env`:

```env
# Local MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin

# Server Port
PORT=5002

# JWT Secret
JWT_SECRET=mercury_mystery_admin_super_secret_jwt_key_2024
```

**Important:**
- **Host:** `localhost` (your computer)
- **Port:** `27017` (default MongoDB port)
- **Database:** `mercury_mystery_admin`
- **No username/password needed** for local setup

---

## ✅ Verification Checklist

- [ ] MongoDB is installed
- [ ] MongoDB is running on port 27017
- [ ] MongoDB Compass is installed
- [ ] Connected to `mongodb://localhost:27017` in Compass
- [ ] Backend server starts without errors
- [ ] Database `mercury_mystery_admin` visible in Compass
- [ ] Collections appear after using the app

---

## 🐛 Troubleshooting

### Problem: Cannot connect in Compass
**Solution:**
- Ensure MongoDB is running
- Try connection string: `mongodb://127.0.0.1:27017`
- Check firewall settings

### Problem: Database not appearing
**Solution:**
- Database is created automatically on first use
- Start the backend server
- Make an API call (signup/login)
- Refresh Compass (click Databases → Refresh)

### Problem: Port 27017 in use
**Solution:**
Find what's using the port:
```bash
# Windows
netstat -ano | findstr :27017

# Mac/Linux
lsof -i :27017
```

### Problem: Backend won't start
**Solution:**
- Check `.env` file exists in `/backend`
- Verify `MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin`
- Run `npm install` again
- Check MongoDB is running

---

## 📖 Complete Guides

For detailed setup instructions:

📘 **[Quick Start Guide](./backend/QUICK_START_MONGODB_COMPASS.md)**
- 5-minute setup

📗 **[Complete Setup Guide](./backend/MONGODB_COMPASS_SETUP.md)**
- Installation instructions
- Detailed troubleshooting
- Advanced features

📙 **[Backend API Documentation](./backend/README.md)**
- All API endpoints
- Request/response examples

---

## 🎉 Benefits of This Setup

✅ **Fast** - Everything runs locally, no network latency
✅ **Private** - Your data never leaves your computer
✅ **Visual** - MongoDB Compass GUI makes it easy to see data
✅ **Debugging** - Instantly view what's stored in the database
✅ **Free** - No cloud costs, no subscriptions
✅ **Offline** - Works without internet connection

---

## 💡 Pro Tips

1. **Keep Compass Open:** Watch data changes in real-time as you use the app
2. **Use Filters:** Quickly find specific audits or auditors
3. **Schema View:** Click "Schema" tab to see data structure
4. **Backup Data:** Regularly export collections
5. **Performance:** Click "Performance" tab to monitor queries

---

## 🔗 MongoDB Compass Resources

- **Download:** https://www.mongodb.com/try/download/compass
- **Documentation:** https://docs.mongodb.com/compass/
- **Tutorials:** https://docs.mongodb.com/compass/current/tutorials/

---

## 📞 Support

**Having issues?**
1. Check troubleshooting section above
2. Verify MongoDB is running
3. Check backend console for errors
4. Review `/backend/MONGODB_COMPASS_SETUP.md`

---

## ✨ You're All Set!

Your app is now using:
- **Local MongoDB** at `mongodb://localhost:27017`
- **Database:** `mercury_mystery_admin`
- **GUI:** MongoDB Compass for easy data viewing

**Open MongoDB Compass and watch your data come to life!** 🚀

---

**Quick Start Commands:**
```bash
# Start MongoDB (if needed)
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Start Backend
cd backend
npm start

# Open MongoDB Compass
# Connect to: mongodb://localhost:27017
```

**Your local database setup is complete!** 🎉
