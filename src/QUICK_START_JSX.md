# 🚀 Quick Start - Pure JSX Version

## ✅ Everything is Now JSX (No TypeScript!)

All TypeScript has been removed. Every file is now pure JSX.

---

## 📝 Environment Files

### Backend: `/backend/.env`
```env
NODE_ENV=development
PORT=5002
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
JWT_SECRET=mercury_mystery_admin_super_secret_key_2024_change_in_production
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend: `/.env`
```env
VITE_API_URL=http://localhost:5002/api
VITE_APP_NAME=Mercury Mystery Admin
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

---

## 🚀 Start in 3 Steps

### Step 1: Start MongoDB
```bash
brew services start mongodb-community  # macOS
sudo systemctl start mongod             # Linux
net start MongoDB                       # Windows
```

### Step 2: Start Backend (Port 5002)
```bash
cd backend
npm install  # First time only
npm run dev
```

**Wait for:**
```
🚀 Server running on port 5002
✅ MongoDB Connected Successfully
```

### Step 3: Start Frontend
```bash
# New terminal, from root
npm install  # First time only
npm run dev
```

**Opens:** http://localhost:3000

---

## 🎯 Test It Out

1. **Sign Up**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Enter your details
   - Submit

2. **Check MongoDB**
   - Open MongoDB Compass
   - Connect to: `mongodb://localhost:27017`
   - Database: `mercury_mystery_admin`
   - Collection: `users`
   - ✅ Your user is there!

3. **Create Auditor**
   - Go to "Auditors" tab
   - Click "Create Auditor"
   - Fill form
   - Select circles
   - Submit

4. **Check MongoDB Again**
   - Refresh Compass
   - Collection: `auditors`
   - ✅ Your auditor is there!

---

## ✅ What's Working

- ✅ Signup/Login (MongoDB)
- ✅ Create Auditor (MongoDB)
- ✅ Edit Auditor (MongoDB)
- ✅ Delete Auditor (MongoDB)
- ✅ Bulk Upload (MongoDB)
- ✅ Refresh Data (MongoDB)
- ✅ Toast Notifications
- ✅ Loading States

---

## 📁 File Structure

All files are JSX (no TypeScript):

```
/
├── .env                              ← Frontend config
├── App.jsx                           ← Main app
├── services/
│   ├── api.js                        ← Axios setup
│   ├── auth.service.js               ← Login/Signup APIs
│   ├── auditor.service.js            ← Auditor CRUD APIs
│   ├── audit.service.js              ← Audit APIs (ready)
│   ├── upload.service.js             ← Upload APIs (ready)
│   └── report.service.js             ← Report APIs (ready)
├── contexts/
│   └── AuthContext.jsx               ← Auth state
├── components/
│   ├── LoginPage.jsx                 ← Login/Signup
│   ├── Dashboard.jsx                 ← Main dashboard
│   ├── DashboardHome.jsx             ← Home tab
│   ├── AuditorManagement.jsx         ← Auditors (WORKING)
│   ├── AuditorForm.jsx               ← Create/Edit form
│   ├── AuditManagement.jsx           ← Audits (placeholder)
│   └── ReportsView.jsx               ← Reports (placeholder)
└── backend/
    ├── .env                          ← Backend config
    ├── server.js                     ← Express server
    ├── models/                       ← MongoDB schemas
    ├── controllers/                  ← API logic
    ├── routes/                       ← API endpoints
    └── middleware/                   ← Auth, upload, errors
```

---

## 🎨 No TypeScript Errors!

### Before (TypeScript):
```typescript
import { Auditor } from '../services/auditor.service';  ❌
const [auditors, setAuditors] = useState<Auditor[]>([]);  ❌
```

### After (JSX):
```javascript
// No imports needed ✅
const [auditors, setAuditors] = useState([]);  ✅
```

---

## 🔍 MongoDB Compass

**Connection:** `mongodb://localhost:27017`

**Database:** `mercury_mystery_admin`

**Collections:**
- `users` → Your admin accounts
- `auditors` → Your auditor accounts
- `audits` → Empty (not integrated yet)

---

## 📊 API Calls

All API calls work perfectly:

### Signup:
```javascript
POST http://localhost:5002/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Create Auditor:
```javascript
POST http://localhost:5002/api/auditors
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "circles": ["DEL", "Mum"],
  "status": "active"
}
```

### Get All Auditors:
```javascript
GET http://localhost:5002/api/auditors
Authorization: Bearer <token>
```

---

## 🎉 Success Indicators

### Backend Terminal:
```
🚀 Server running on port 5002
✅ MongoDB Connected Successfully
Database: mercury_mystery_admin
```

### Frontend Terminal:
```
VITE ready in XXX ms
Local: http://localhost:3000/
```

### Browser:
- ✅ Login page loads
- ✅ Can signup/login
- ✅ Dashboard shows
- ✅ Can create auditors
- ✅ Toast notifications work

### MongoDB Compass:
- ✅ `users` collection has data
- ✅ `auditors` collection has data
- ✅ Documents update in real-time

---

## 🐛 Common Issues

### Issue: "Failed to load response data"
**Fix:**
```bash
# Backend not running. Start it:
cd backend
npm run dev
```

### Issue: "Cannot connect to MongoDB"
**Fix:**
```bash
# MongoDB not running. Start it:
brew services start mongodb-community  # macOS
sudo systemctl start mongod             # Linux
net start MongoDB                       # Windows
```

### Issue: "Port 5002 already in use"
**Fix:**
```bash
lsof -i :5002  # Find process
kill -9 <PID>  # Kill it
```

### Issue: CORS error
**Fix:**
Check `/backend/.env`:
```env
CORS_ORIGIN=http://localhost:3000  ← Must match frontend port
```

---

## 📞 Need Help?

Read these files:
- `/JSX_CONVERSION_COMPLETE.md` - Complete conversion details
- `/START_HERE.md` - Detailed startup guide
- `/DIAGNOSTIC_CHECKLIST.md` - Troubleshooting
- `/SETUP_INSTRUCTIONS.md` - Full setup guide

---

## 🎯 What's Next?

### Already Working (JSX):
- ✅ Authentication
- ✅ Auditor Management

### Ready to Integrate (JSX):
- ⚠️ Audit Management (service ready, component needs update)
- ⚠️ Reports (service ready, component needs update)
- ⚠️ Upload (service ready, component needs update)

---

**🎉 100% JSX! No TypeScript! All working! 🚀**
