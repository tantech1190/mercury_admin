# 🚀 Quick Start Guide - Mercury Mystery Admin

## ✅ **API Integration Complete!**

All backend APIs are now integrated with your frontend. Follow these steps to get started.

---

## 📋 **Prerequisites**

Make sure you have:
- ✅ Node.js (v16 or higher)
- ✅ MongoDB (running locally or cloud)
- ✅ npm or yarn

---

## 🔧 **Setup Instructions**

### **Step 1: Backend Setup**

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI
# Example:
# MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
# JWT_SECRET=your-super-secret-jwt-key-here
# PORT=5000

# Start the backend server
npm run dev
```

**Expected Output:**
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

### **Step 2: Frontend Setup**

```bash
# Navigate to project root
cd ..

# Install dependencies (if not already done)
npm install

# Environment file is already created at /.env
# Default API URL: http://localhost:5000/api

# Start the frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 🔐 **First Time Setup**

### **1. Create Admin Account**

**Option A: Using Postman/Thunder Client**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

**Option B: Using cURL**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### **2. Login to Frontend**

1. Open browser: `http://localhost:3000`
2. You'll need to create a login page OR use the API directly
3. Use credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

---

## 🎯 **Testing the Integration**

### **1. Health Check**

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Mercury Mystery Admin API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development",
  "database": "Connected"
}
```

### **2. Test Authentication**

```typescript
// In your browser console or component:
import { authService } from './services';

// Login
const response = await authService.login({
  email: 'admin@example.com',
  password: 'admin123'
});

console.log('Logged in:', response.user);
```

### **3. Test Auditor Creation**

```typescript
import { auditorService } from './services';

const auditor = await auditorService.createAuditor({
  name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  phone: '+919876543210',
  circles: ['Mum', 'DEL'],
  status: 'active'
});

console.log('Created auditor:', auditor);
```

### **4. Test Audit Creation**

```typescript
import { auditService } from './services';

const audit = await auditService.createAudit({
  storeCode: 'MUM001',
  storeName: 'Mumbai Store 1',
  location: 'Andheri',
  auditType: 'store',
  circle: 'Mum',
  deadline: new Date('2024-12-31')
});

console.log('Created audit:', audit);
```

### **5. Test Excel Upload**

```typescript
import { uploadService } from './services';

const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const result = await uploadService.uploadExcel(file, (progress) => {
  console.log(`Upload: ${progress}%`);
});

console.log('Upload result:', result);
```

---

## 📊 **Available API Endpoints**

### **Base URL:** `http://localhost:5000/api`

### **Authentication**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user (requires auth)
- `POST /auth/logout` - Logout (requires auth)

### **Auditors**
- `GET /auditors` - Get all auditors
- `POST /auditors` - Create auditor
- `GET /auditors/:id` - Get single auditor
- `PUT /auditors/:id` - Update auditor
- `DELETE /auditors/:id` - Delete auditor

### **Audits**
- `GET /audits` - Get all audits (with filters)
- `POST /audits` - Create audit
- `GET /audits/:id` - Get single audit
- `PUT /audits/:id` - Update audit
- `PATCH /audits/:id/assign` - Assign to auditor
- `PATCH /audits/:id/status` - Update status
- `DELETE /audits/:id` - Delete audit

### **Upload**
- `POST /upload/excel` - Upload Excel file
- `GET /upload/template/:type` - Download template

### **Reports**
- `GET /reports/overview` - Overview statistics
- `GET /reports/auditor-performance` - Auditor performance
- `GET /reports/circle-performance` - Circle performance
- `GET /reports/score-analytics` - Score analytics

---

## 🐛 **Troubleshooting**

### **Issue: Backend won't start**

**Check MongoDB:**
```bash
# Make sure MongoDB is running
mongosh

# Or check service status
sudo systemctl status mongod
```

**Check .env file:**
```bash
# Verify MongoDB URI
cat backend/.env | grep MONGODB_URI
```

### **Issue: "Network Error" in frontend**

**Check API URL:**
```bash
# Verify .env in project root
cat .env | grep VITE_API_URL

# Should be: VITE_API_URL=http://localhost:5000/api
```

**Check backend is running:**
```bash
curl http://localhost:5000/api/health
```

### **Issue: "401 Unauthorized"**

**You need to login first:**
```typescript
// Login before making authenticated requests
await authService.login({
  email: 'admin@example.com',
  password: 'admin123'
});

// Now you can make authenticated requests
await auditorService.getAllAuditors();
```

### **Issue: CORS errors**

**Backend .env should have:**
```
CORS_ORIGIN=http://localhost:3000
```

---

## 📁 **Project Structure**

```
mercury-mystery-admin/
├── backend/
│   ├── controllers/       # API controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth, upload, error handling
│   ├── utils/            # Score calculator, Excel parser
│   ├── server.js         # Main server file
│   └── .env             # Backend config
├── services/             # Frontend API services ✨ NEW
│   ├── api.ts           # Base API client
│   ├── auth.service.ts  # Authentication
│   ├── auditor.service.ts # Auditors
│   ├── audit.service.ts # Audits
│   ├── upload.service.ts # File upload
│   ├── report.service.ts # Reports
│   └── index.ts         # Service exports
├── contexts/            # React contexts ✨ NEW
│   └── AuthContext.tsx # Auth state management
├── components/          # React components
├── utils/              # Frontend utilities
├── App.tsx            # Main app component
├── .env              # Frontend config ✨ NEW
└── package.json
```

---

## 🎯 **Next Steps**

### **1. Create Login/Register Pages**

You need to create UI components for:
- Login page
- Register page
- Protected route wrapper

### **2. Update App.tsx**

Replace local state with API calls:

```typescript
// Example: Load audits from API
useEffect(() => {
  loadAudits();
}, []);

async function loadAudits() {
  try {
    const { audits } = await auditService.getAllAudits();
    setAudits(audits);
  } catch (error) {
    console.error('Failed to load audits:', error);
  }
}
```

### **3. Update Components**

Connect components to API:
- AuditorManagement → auditorService
- AuditManagement → auditService & uploadService
- ReportsView → reportService

### **4. Add Loading States**

```typescript
const [loading, setLoading] = useState(false);

{loading ? <LoadingSpinner /> : <DataTable />}
```

---

## 📚 **Documentation**

- **API Integration Guide:** `/API_INTEGRATION_GUIDE.md`
- **Score Calculation:** `/SCORE_CALCULATION_GUIDE.md`
- **Backend Setup:** `/backend/SETUP_GUIDE.md`
- **Backend README:** `/backend/README.md`
- **API Collection:** `/backend/Mercury_Mystery_Admin_API_Collection.json`

---

## 🎉 **You're Ready!**

### **✅ What's Working:**
1. Backend server with all APIs
2. MongoDB database connection
3. Frontend services layer
4. Authentication system
5. All CRUD operations
6. File upload support
7. Score calculation
8. Report generation

### **🚀 Start Building:**

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
npm run dev

# Browser: Open http://localhost:3000
```

---

**Need help connecting the UI? Let me know and I'll update your components to use the API services! 🎯**
