# 🗄️ MongoDB Compass Local Setup Guide

This guide will help you set up and use **MongoDB Compass** (local MongoDB) with the Mercury Mystery Admin application.

---

## 📋 Prerequisites

### 1. Install MongoDB Community Edition

**Windows:**
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Run the installer (.msi file)
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service (recommended)
5. Install MongoDB Compass (included in installer)

**Mac:**
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Install MongoDB Compass
brew install --cask mongodb-compass
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install MongoDB Compass
# Download from: https://www.mongodb.com/try/download/compass
```

---

## 🚀 Setup Steps

### Step 1: Verify MongoDB is Running

**Windows:**
1. Open "Services" (press Win + R, type `services.msc`)
2. Look for "MongoDB Server"
3. Ensure Status is "Running"

**Mac:**
```bash
brew services list | grep mongodb
# Should show: mongodb-community started
```

**Linux:**
```bash
sudo systemctl status mongod
# Should show: active (running)
```

---

### Step 2: Open MongoDB Compass

1. Launch MongoDB Compass application
2. You'll see a connection screen

---

### Step 3: Connect to Local MongoDB

**Connection String:**
```
mongodb://localhost:27017
```

**Steps:**
1. In MongoDB Compass, the connection string should already be filled with `mongodb://localhost:27017`
2. Click "Connect" button
3. You should now be connected to your local MongoDB instance

---

### Step 4: Configure Backend

Your backend `.env` file is already configured for local MongoDB:

```env
# Database Configuration - LOCAL MONGODB COMPASS
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
```

**Important:**
- Database name: `mercury_mystery_admin`
- The database will be created automatically when you start the server
- Collections will be created when you make your first API calls

---

### Step 5: Start the Backend Server

```bash
cd backend
npm install
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
📊 Database: mercury_mystery_admin
🚀 Mercury Mystery Admin Backend Server
📡 Server running on port: 5002
```

---

## 🔍 Viewing Data in MongoDB Compass

### After Server Starts:

1. In MongoDB Compass, refresh the databases list
2. You'll see: **mercury_mystery_admin**
3. Click on it to expand

### Collections You'll See:

**1. users**
- Admin user accounts
- Created when you sign up

**2. auditors**
- Auditor accounts and details
- Created when you add auditors
- Fields: name, email, phone, circles, performanceMetrics

**3. audits**
- All audit records
- Created when you upload Excel files or add audits
- Fields: storeCode, storeName, auditType, status, score, rawData

---

## 📊 Monitoring Your Data

### View All Data:
1. Click on a collection name (e.g., "auditors")
2. You'll see all documents in that collection
3. You can:
   - View individual documents
   - Edit documents (click on a field)
   - Delete documents
   - Search and filter
   - Export to JSON/CSV

### Example - Viewing Auditors:
```
Database: mercury_mystery_admin
  └── Collection: auditors
      └── Documents: [List of all auditors]
```

### Example - Viewing Audits:
```
Database: mercury_mystery_admin
  └── Collection: audits
      └── Documents: [List of all audits]
```

---

## 🔧 Common Operations in Compass

### 1. Create New Document Manually
1. Select a collection
2. Click "ADD DATA" → "Insert Document"
3. Enter JSON data
4. Click "Insert"

### 2. Search/Filter Documents
1. Select a collection
2. Use the Filter bar at the top
3. Example filter: `{ "status": "completed" }`
4. Click "Find"

### 3. Delete Documents
1. Hover over a document
2. Click the trash icon
3. Confirm deletion

### 4. Export Data
1. Select a collection
2. Click "Export Collection"
3. Choose format (JSON or CSV)
4. Select export location

### 5. View Indexes
1. Select a collection
2. Go to "Indexes" tab
3. See all indexes on the collection

---

## ✅ Verification Checklist

- [ ] MongoDB is installed and running
- [ ] MongoDB Compass is installed
- [ ] Connected to `mongodb://localhost:27017`
- [ ] Backend `.env` file has correct `MONGODB_URI`
- [ ] Backend server starts successfully
- [ ] Database `mercury_mystery_admin` appears in Compass
- [ ] Collections are created after API calls

---

## 🐛 Troubleshooting

### Problem: Cannot connect to MongoDB
**Solution:**
```bash
# Check if MongoDB is running
# Windows: Check Services
# Mac: brew services list
# Linux: sudo systemctl status mongod

# Restart MongoDB
# Windows: Restart MongoDB service in Services
# Mac: brew services restart mongodb-community
# Linux: sudo systemctl restart mongod
```

### Problem: "Network error" in Compass
**Solution:**
- Ensure MongoDB is running on port 27017
- Check firewall settings
- Try connection string: `mongodb://127.0.0.1:27017`

### Problem: Database not appearing
**Solution:**
- Make sure backend server is running
- Make at least one API call (e.g., signup)
- Refresh Compass (click Databases → Refresh)

### Problem: Port 27017 already in use
**Solution:**
```bash
# Find what's using port 27017
# Windows: netstat -ano | findstr :27017
# Mac/Linux: lsof -i :27017

# Kill the process or change MongoDB port in .env
MONGODB_URI=mongodb://localhost:27018/mercury_mystery_admin
```

### Problem: "Authentication failed"
**Solution:**
- For local MongoDB without auth, use: `mongodb://localhost:27017`
- If you set up authentication, use: `mongodb://username:password@localhost:27017`

---

## 📝 Example Data Viewing

### After Creating an Auditor:

In MongoDB Compass → mercury_mystery_admin → auditors:

```json
{
  "_id": "65abc123def456789012345",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "circles": ["DEL", "Mum", "BLR"],
  "status": "active",
  "performanceMetrics": {
    "totalAuditsAssigned": 0,
    "totalAuditsCompleted": 0,
    "averageScore": 0,
    "completionRate": 0
  },
  "createdAt": "2024-11-28T10:30:00.000Z",
  "updatedAt": "2024-11-28T10:30:00.000Z",
  "__v": 0
}
```

### After Uploading an Audit:

In MongoDB Compass → mercury_mystery_admin → audits:

```json
{
  "_id": "65abc123def456789012346",
  "storeCode": "DEL001",
  "storeName": "Delhi Store 1",
  "location": "Delhi",
  "auditType": "store",
  "circle": "DEL",
  "deadline": "2024-12-31T00:00:00.000Z",
  "status": "unassigned",
  "rawData": {
    // All Excel columns stored here
  },
  "createdBy": "65abc123def456789012340",
  "createdAt": "2024-11-28T11:00:00.000Z",
  "updatedAt": "2024-11-28T11:00:00.000Z",
  "__v": 0
}
```

---

## 🎯 Key Benefits of MongoDB Compass

✅ **Visual Interface** - See your data in a user-friendly GUI
✅ **Real-time Monitoring** - Watch data changes live
✅ **Easy Debugging** - Quickly find and fix data issues
✅ **Query Testing** - Test MongoDB queries before using in code
✅ **Schema Analysis** - Understand your data structure
✅ **Performance Insights** - View indexes and performance stats
✅ **Data Export/Import** - Easily backup and restore data

---

## 🔗 Useful Resources

- **MongoDB Compass Docs**: https://docs.mongodb.com/compass/
- **MongoDB Manual**: https://docs.mongodb.com/manual/
- **Connection Strings**: https://docs.mongodb.com/manual/reference/connection-string/
- **MongoDB Community**: https://www.mongodb.com/community/forums/

---

## ✨ Summary

You're now using **Local MongoDB with Compass**! 

**Connection Details:**
- Host: `localhost:27017`
- Database: `mercury_mystery_admin`
- Interface: MongoDB Compass GUI

**All your data is stored locally** and visible in MongoDB Compass. No cloud, no Atlas, just your local machine! 🎉

---

**Need Help?** 
Check the troubleshooting section above or refer to the MongoDB documentation.
