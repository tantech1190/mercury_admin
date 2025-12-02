# ⚡ Quick Start - MongoDB Compass (Local Setup)

**Get up and running in 5 minutes!**

---

## 🎯 What You Need

✅ MongoDB installed locally
✅ MongoDB Compass installed
✅ Node.js installed (v14+)

---

## 🚀 3 Simple Steps

### Step 1: Start MongoDB (if not running)

**Windows:**
- MongoDB usually starts automatically as a service
- Check in Services app (Win + R → `services.msc`)

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

---

### Step 2: Connect with MongoDB Compass

1. Open **MongoDB Compass**
2. Connection string is already filled: `mongodb://localhost:27017`
3. Click **Connect**
4. ✅ You're connected!

---

### Step 3: Start the Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

**You'll see:**
```
✅ MongoDB Connected: localhost
📊 Database: mercury_mystery_admin
🚀 Server running on port: 5002
```

---

## ✅ Verification

### In MongoDB Compass:
1. Refresh the databases list (click the refresh icon)
2. You should see: **mercury_mystery_admin** database
3. Inside it, collections will appear as you use the app:
   - `users` (when you sign up)
   - `auditors` (when you add auditors)
   - `audits` (when you upload audits)

### Test the API:
```bash
# Health check
curl http://localhost:5002/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Mercury Mystery Admin API is running",
  "database": "Connected"
}
```

---

## 🎉 You're Done!

Your backend is now connected to **local MongoDB** and visible in **MongoDB Compass**!

**Connection Details:**
- **MongoDB**: `mongodb://localhost:27017`
- **Database**: `mercury_mystery_admin`
- **API**: `http://localhost:5002/api`

---

## 📊 View Your Data in Compass

1. Open MongoDB Compass
2. Select `mercury_mystery_admin` database
3. Click on any collection (users, auditors, audits)
4. See all your data in real-time!

**What you can do:**
- 👀 View all documents
- ✏️ Edit documents
- 🗑️ Delete documents
- 🔍 Search and filter
- 📤 Export to JSON/CSV

---

## 🐛 Quick Troubleshooting

**Problem: "Cannot connect to MongoDB"**
```bash
# Check if MongoDB is running
# Windows: Check Services
# Mac: brew services list | grep mongodb
# Linux: sudo systemctl status mongod
```

**Problem: "Port 5002 already in use"**
- Change the port in `/backend/.env`:
```env
PORT=5003
```

**Problem: "Database not appearing in Compass"**
- Refresh Compass (click Databases → Refresh button)
- Make sure backend server is running
- Try making an API call (signup/login)

---

## 📚 Next Steps

✅ [Full MongoDB Compass Guide](./MONGODB_COMPASS_SETUP.md)
✅ [API Documentation](./README.md#api-documentation)
✅ [Testing with Postman](./POSTMAN_GUIDE.md)

---

## 💡 Pro Tips

1. **Keep Compass Open**: Watch your data change in real-time
2. **Use Filters**: Filter bar helps find specific documents
3. **Export Data**: Backup your data regularly (Export Collection)
4. **Check Indexes**: Indexes tab shows query performance
5. **Schema View**: Analyze tab shows data structure

---

**Ready to build something amazing! 🚀**
