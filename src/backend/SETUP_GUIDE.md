# 🚀 Mercury Mystery Admin Backend - Quick Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Install Node.js & MongoDB

**Install Node.js:**
- Download from: https://nodejs.org/
- Verify installation:
  ```bash
  node --version  # Should show v14 or higher
  npm --version
  ```

**Install MongoDB:**

**Option A: Local MongoDB**
- macOS: `brew install mongodb-community`
- Ubuntu: `sudo apt-get install mongodb`
- Windows: Download from https://www.mongodb.com/try/download/community

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string

---

### Step 2: Install Dependencies

```bash
cd backend
npm install
```

---

### Step 3: Configure Environment

```bash
# Copy the example file
cp .env.example .env

# Edit .env file
nano .env  # or use any text editor
```

**Minimal .env configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
JWT_SECRET=your_random_secret_key_here_change_this
CORS_ORIGIN=http://localhost:3000
```

**For MongoDB Atlas, use:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mercury_mystery_admin
```

---

### Step 4: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Expected output:**
```
==================================================
🚀 Mercury Mystery Admin Backend Server
==================================================
📡 Server running on port: 5000
🌍 Environment: development
🔗 API Base URL: http://localhost:5000/api
📊 Health Check: http://localhost:5000/api/health
==================================================

✅ MongoDB Connected: localhost
📊 Database: mercury_mystery_admin
```

---

### Step 5: Test the API

**Option A: Using Browser**
Open: http://localhost:5000/api/health

**Option B: Using cURL**
```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "Mercury Mystery Admin API is running",
  "database": "Connected"
}
```

---

### Step 6: Import API Collection

1. Open **Postman** or **Thunder Client**
2. Import file: `Mercury_Mystery_Admin_API_Collection.json`
3. Set variables:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: (leave empty, will auto-fill after login)

---

### Step 7: Create First User

**Using Postman:**
1. Select: `Authentication > Register User`
2. Click Send

**Using cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@mercury.com",
    "password": "password123",
    "role": "admin"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@mercury.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ IMPORTANT: Copy the token! You'll need it for all future requests.**

---

### Step 8: Login & Test

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mercury.com",
    "password": "password123"
  }'
```

**Get Audits (with token):**
```bash
curl -X GET http://localhost:5000/api/audits \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Common Use Cases

### Create an Auditor

```bash
curl -X POST http://localhost:5000/api/auditors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Rajesh Kumar",
    "email": "rajesh@mercury.com",
    "phone": "9876543210",
    "circles": ["Mum", "DEL"],
    "employeeId": "EMP001"
  }'
```

### Upload Excel File

```bash
curl -X POST http://localhost:5000/api/upload/excel \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/your/audit_file.xlsx"
```

### Get Reports

```bash
curl -X GET http://localhost:5000/api/reports/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### Issue: "MongoDB connection error"

**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list  # macOS

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**Or use MongoDB Atlas** (cloud - no local install needed)

---

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 PID

# Or change port in .env
PORT=5001
```

---

### Issue: "JWT token invalid"

**Solution:**
- Make sure you copied the full token from login response
- Check token format: `Bearer <token>`
- Ensure `JWT_SECRET` is set in `.env`
- Token expires in 7 days by default

---

### Issue: "File upload fails"

**Solution:**
```bash
# Create uploads directory
mkdir uploads

# Check file size (max 10MB)
ls -lh your_file.xlsx

# Verify file format (.xls, .xlsx, .xlsm)
file your_file.xlsx
```

---

## 📚 Next Steps

### 1. Explore the API

Use the Postman collection to try all endpoints:
- ✅ Create auditors
- ✅ Upload audit data
- ✅ Assign audits
- ✅ Generate reports

### 2. Integrate with Frontend

Your frontend should connect to:
```
http://localhost:5000/api
```

### 3. Read Full Documentation

See `README.md` for complete API documentation.

### 4. Deploy to Production

When ready, see deployment section in `README.md`.

---

## 🎉 You're All Set!

Your backend is now running and ready to use!

**API Base URL:** `http://localhost:5000/api`
**Health Check:** `http://localhost:5000/api/health`
**Postman Collection:** `Mercury_Mystery_Admin_API_Collection.json`

---

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review API collection examples
- Contact: admin@mercury.com

---

**Happy coding! 🚀**
