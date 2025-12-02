# 🎯 START HERE - MongoDB Compass (Local Setup)

## 🗄️ Your Database Configuration

Your Mercury Mystery Admin app is configured for:

### ✅ LOCAL MONGODB (MongoDB Compass)
- **Not using MongoDB Atlas** (cloud)
- **Using Local MongoDB** on your computer
- **Visual interface:** MongoDB Compass
- **Connection:** `mongodb://localhost:27017`
- **Database:** `mercury_mystery_admin`

---

## ⚡ Quick Start (2 Minutes)

### 1. Start MongoDB
Make sure MongoDB is running on your computer.

**Windows:** MongoDB service should auto-start
**Mac:** `brew services start mongodb-community`
**Linux:** `sudo systemctl start mongod`

### 2. Open MongoDB Compass
- Launch MongoDB Compass app
- Connect to: `mongodb://localhost:27017`
- Click "Connect"

### 3. Start Backend
```bash
cd backend
npm install  # First time only
npm start
```

### 4. Start Frontend
```bash
npm install  # First time only
npm run dev
```

---

## 🎉 That's It!

Your app is now running with local MongoDB!

**View your data:**
- Open MongoDB Compass
- Select `mercury_mystery_admin` database
- See all collections: users, auditors, audits

---

## 📋 What You'll See in MongoDB Compass

```
📂 mercury_mystery_admin
   ├── 👤 users
   │   └── Admin accounts
   │
   ├── 👥 auditors
   │   └── Auditor profiles (name, email, circles)
   │
   └── 📋 audits
       └── All audit records (store, ILMS, XFE)
```

**Real-time viewing:** Any changes in the app instantly appear in Compass!

---

## 🔍 Verify Everything Works

### Check 1: MongoDB Running
```bash
# Windows: Check Services for "MongoDB Server"
# Mac: brew services list | grep mongodb
# Linux: sudo systemctl status mongod
```

### Check 2: Backend Running
Open browser: `http://localhost:5002/api/health`

Should show:
```json
{
  "success": true,
  "database": "Connected"
}
```

### Check 3: Compass Connected
In MongoDB Compass, you should see "localhost:27017" in green (connected)

### Check 4: Frontend Running
Open browser: `http://localhost:3000`

---

## 📊 Key Configuration Files

### Backend Configuration (`/backend/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
PORT=5002
```

### Frontend Configuration (`/config/api.config.ts`)
```typescript
baseURL: 'http://localhost:5002/api'
```

---

## 🐛 Quick Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
# Windows: Services → MongoDB Server
# Mac: brew services list
# Linux: sudo systemctl status mongod

# Restart if needed
# Mac: brew services restart mongodb-community
# Linux: sudo systemctl restart mongod
```

### "Database not appearing in Compass"
- Make sure backend is running
- Refresh Compass (click Databases → Refresh)
- Database creates automatically on first API call

### "Backend won't start"
- Check `/backend/.env` file exists
- Verify MongoDB is running
- Run `cd backend && npm install`

---

## 📚 Complete Documentation

📘 [Quick MongoDB Setup](./MONGODB_COMPASS_INSTRUCTIONS.md)
📗 [Detailed Compass Guide](./backend/MONGODB_COMPASS_SETUP.md)
📙 [Backend API Docs](./backend/README.md)
📕 [API Integration Guide](./API_INTEGRATION_GUIDE.md)

---

## ✨ Your Setup Summary

| Component | Configuration |
|-----------|--------------|
| **Database Type** | Local MongoDB (not Atlas) |
| **Database Host** | localhost:27017 |
| **Database Name** | mercury_mystery_admin |
| **GUI Tool** | MongoDB Compass |
| **Backend Port** | 5002 |
| **Frontend Port** | 3000 |
| **API Base URL** | http://localhost:5002/api |

---

## 💡 Using MongoDB Compass

### View Data:
1. Open Compass
2. Click on `mercury_mystery_admin`
3. Click on any collection (users, auditors, audits)
4. See all documents

### Search Data:
Use filter bar: `{ "status": "active" }` or `{ "circle": "DEL" }`

### Export Data:
Click "Export Collection" → Choose JSON/CSV → Save

### Edit Data:
Click on any document → Edit fields → Click "Update"

---

## 🎯 Next Steps

✅ **Start the app** (see Quick Start above)
✅ **Sign up** to create admin account
✅ **Add auditors** in the Auditors section
✅ **Upload audits** using Excel files
✅ **View in Compass** - see your data live!

---

## 🚀 You're Ready!

Everything is configured for **local MongoDB** with **Compass** visualization.

**No cloud, no clusters, just local data on your computer!**

Open MongoDB Compass and start building! 🎉

---

## 📞 Need Help?

1. Check [MONGODB_COMPASS_INSTRUCTIONS.md](./MONGODB_COMPASS_INSTRUCTIONS.md)
2. Check [backend/QUICK_START_MONGODB_COMPASS.md](./backend/QUICK_START_MONGODB_COMPASS.md)
3. Review troubleshooting sections above

---

**Happy coding with local MongoDB! 🗄️✨**
