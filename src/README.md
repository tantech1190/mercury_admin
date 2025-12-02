# 🎯 Mercury Mystery Admin

> **Premium Admin Application for Managing Auditors and Audit Assignments**

A comprehensive admin platform featuring JWT authentication, auditor management, audit tracking, and real-time analytics with a luxury glass morphism design.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Local-green)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue)

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication system
- Role-based access control (Admin, Manager, Viewer)
- Secure password hashing with bcrypt
- Protected API routes

### 👥 Auditor Management
- Complete CRUD operations
- Circle-based assignment (state regions)
- Performance metrics tracking
- Bulk operations support
- Real-time status updates

### 📋 Audit Management
- 3 audit types: Store (150+ fields), ILMS (60+ fields), XFE (40+ fields)
- Excel file upload & automatic parsing
- Smart score calculation
- Assignment & deadline tracking
- Status workflow management

### 📊 Analytics & Reports
- Dashboard with overview statistics
- Auditor performance tracking
- Circle-wise performance analysis
- Score distribution analytics
- Trend analysis & forecasting
- CSV export functionality

### 🗄️ Database
- Local MongoDB with MongoDB Compass
- Real-time data visualization
- 3 main collections: users, auditors, audits
- Automatic indexing & optimization

### 🎨 Design
- Premium glass morphism UI
- Teal color palette (#0AAE9A primary)
- Fully responsive (mobile-first)
- Smooth animations & transitions
- Dark navy navbar (#20252B)

---

## 🚀 Quick Start

### Prerequisites
```bash
✅ Node.js v14+
✅ MongoDB (local installation)
✅ MongoDB Compass (optional but recommended)
```

### Installation

**1. Install Dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

**2. Start MongoDB**
```bash
# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows - MongoDB starts automatically
```

**3. Start Backend**
```bash
cd backend
npm start
```

**4. Start Frontend**
```bash
npm run dev
```

**5. Open Application**
```
http://localhost:3000
```

---

## 📊 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Tailwind CSS v4.0 |
| **Backend** | Node.js, Express.js, JWT |
| **Database** | MongoDB (Local), Mongoose ODM |
| **UI Library** | Glass Morphism Components |
| **API Client** | Axios |
| **File Processing** | Multer, XLSX |
| **Dev Tools** | MongoDB Compass, Postman |

---

## 🗂️ Project Structure

```
mercury-mystery-admin/
├── 📂 backend/                 # Backend API
│   ├── controllers/            # Request handlers
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── middleware/             # Auth & validation
│   ├── utils/                  # Helpers
│   └── server.js               # Entry point
├── 📂 components/              # React components
├── 📂 services/                # API services
├── 📂 config/                  # Configuration
├── 📂 types/                   # TypeScript types
├── 📂 styles/                  # Global styles
└── 📄 App.tsx                  # Main app
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Auditors
- `GET /api/auditors` - List all auditors
- `POST /api/auditors` - Create auditor
- `PUT /api/auditors/:id` - Update auditor
- `DELETE /api/auditors/:id` - Delete auditor
- `GET /api/auditors/stats` - Get statistics

### Audits
- `GET /api/audits` - List all audits
- `POST /api/audits` - Create audit
- `PUT /api/audits/:id` - Update audit
- `PATCH /api/audits/:id/assign` - Assign to auditor
- `PATCH /api/audits/:id/status` - Update status
- `DELETE /api/audits/:id` - Delete audit

### Reports
- `GET /api/reports/overview` - Dashboard stats
- `GET /api/reports/auditor-performance` - Performance report
- `GET /api/reports/circle-performance` - Circle analysis
- `GET /api/reports/export` - Export CSV

### Upload
- `POST /api/upload/excel` - Upload Excel file
- `GET /api/upload/template/:type` - Download template

---

## 🗄️ MongoDB Setup

### Connection Details
```
Host:     localhost
Port:     27017
Database: mercury_mystery_admin
GUI:      MongoDB Compass
```

### Collections

**users** - Admin accounts
```javascript
{ name, email, password, role, isActive }
```

**auditors** - Auditor profiles
```javascript
{ name, email, phone, circles, performanceMetrics, status }
```

**audits** - All audit records
```javascript
{ storeCode, storeName, auditType, status, score, rawData, auditorId }
```

### View Your Data
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select: `mercury_mystery_admin` database
4. Browse collections in real-time!

---

## 📚 Documentation

### Getting Started
📘 **[START_HERE_MONGODB_LOCAL.md](./START_HERE_MONGODB_LOCAL.md)** - Quick setup guide
📗 **[STARTUP_CHECKLIST.md](./STARTUP_CHECKLIST.md)** - Complete checklist
📙 **[PROJECT_COMPLETE_SETUP.md](./PROJECT_COMPLETE_SETUP.md)** - Full project guide

### MongoDB
📊 **[MONGODB_COMPASS_INSTRUCTIONS.md](./MONGODB_COMPASS_INSTRUCTIONS.md)** - Compass guide
📈 **[MONGODB_LOCAL_ARCHITECTURE.md](./MONGODB_LOCAL_ARCHITECTURE.md)** - Architecture

### API & Development
🔧 **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - API usage
🧪 **[API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)** - Test endpoints
📖 **[backend/README.md](./backend/README.md)** - Backend docs

### Recent Updates
✅ **[BACKEND_API_RESPONSE_FIX.md](./BACKEND_API_RESPONSE_FIX.md)** - Response structure fixes
✅ **[FIXED_CLASSES_LIST.md](./FIXED_CLASSES_LIST.md)** - Controller fixes
✅ **[API_RESPONSE_FIX_SUMMARY.md](./API_RESPONSE_FIX_SUMMARY.md)** - Quick summary

---

## 🎨 Color Palette

```css
Primary Teal:     #0AAE9A
Dark Teal:        #078672
Soft Teal:        #E0F7F4
Navy Navbar:      #20252B
Background:       #F5F7FA
Text Dark:        #1F2937
Text Light:       #6B7280
```

---

## 🔐 Environment Configuration

### Backend `.env`
```env
NODE_ENV=development
PORT=5002
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend `config/api.config.ts`
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5002/api',
  TIMEOUT: 30000,
};
```

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5002/api/health
```

### Run Full Test Suite
```bash
# See API_TESTING_GUIDE.md for complete test commands
```

### Postman Collection
Import: `/backend/Mercury_Mystery_Admin_API_Collection.json`

---

## 📊 Circle Codes (State-Based)

```
DEL - Delhi          Mum - Mumbai         BLR - Bangalore
CHN - Chennai        KOL - Kolkata        HYD - Hyderabad
PUN - Pune           AHM - Ahmedabad      JDP - Jodhpur
LKW - Lucknow        UPE - UP East        UPW - UP West
RAJ - Rajasthan      GUJ - Gujarat        MP - Madhya Pradesh
KER - Kerala         TN - Tamil Nadu      AP - Andhra Pradesh
```

---

## 🎯 Audit Types & Fields

### Store Audits (150+ fields)
Customer service, store ambience, product display, staff behavior, cleanliness, branding, etc.

### ILMS Audits (60+ fields)
Call handling, advisor performance, ambassador quality, process adherence, etc.

### XFE Audits (40+ fields)
Call quality, XFE performance, process knowledge, customer experience, etc.

---

## 🔧 Development Workflow

### Daily Startup
1. Start MongoDB
2. Open MongoDB Compass
3. Start Backend (`cd backend && npm start`)
4. Start Frontend (`npm run dev`)
5. Open browser: `http://localhost:3000`

### Making Changes
1. Edit code
2. Save (hot reload active)
3. Verify in MongoDB Compass
4. Test API endpoints
5. Check browser console

---

## 🐛 Troubleshooting

### MongoDB Issues
```bash
# Check status
brew services list | grep mongodb

# Restart
brew services restart mongodb-community
```

### Port Conflicts
```bash
# Find process
lsof -i :5002

# Kill and restart
```

### CORS Errors
Check `backend/.env` has `CORS_ORIGIN=http://localhost:3000`

### API 404s
Verify `config/api.config.ts` points to `http://localhost:5002/api`

---

## ✅ Recent Updates (November 2024)

### ✅ Completed
- [x] Fixed API response structure (16 functions)
- [x] Updated 3 backend controllers
- [x] Standardized response format
- [x] Configured local MongoDB (not Atlas)
- [x] Created comprehensive documentation
- [x] Fixed frontend API config port

### 📋 Files Modified
1. `/backend/controllers/auditor.controller.js` - 5 functions
2. `/backend/controllers/auth.controller.js` - 4 functions
3. `/backend/controllers/audit.controller.js` - 7 functions
4. `/config/api.config.ts` - Updated port to 5002
5. `/backend/.env` - Local MongoDB configuration

---

## 📊 Project Statistics

- **Controllers:** 5 (auth, auditor, audit, report, upload)
- **API Endpoints:** 35+
- **Database Collections:** 3
- **Frontend Services:** 4
- **Documentation Files:** 10+
- **Lines of Code:** 5000+

---

## 🎉 Success Checklist

Your setup is complete when:
- ✅ MongoDB running at `localhost:27017`
- ✅ Compass connected to database
- ✅ Backend running at `http://localhost:5002`
- ✅ Frontend running at `http://localhost:3000`
- ✅ Can sign up and login
- ✅ Can create auditors
- ✅ Can create/assign audits
- ✅ Data visible in MongoDB Compass

---

## 📞 Support & Resources

### Documentation
All guides available in project root - start with `START_HERE_MONGODB_LOCAL.md`

### MongoDB Compass
Visual interface for your data at `mongodb://localhost:27017`

### Postman Collection
API testing collection in `/backend` directory

---

## 🚀 Next Steps

1. ✅ **Setup** - Complete [STARTUP_CHECKLIST.md](./STARTUP_CHECKLIST.md)
2. 🧪 **Test** - Run tests from [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)
3. 🎨 **Build** - Create UI components
4. 📊 **View** - Monitor data in MongoDB Compass
5. 🚢 **Deploy** - Production deployment

---

## 📄 License

This project is proprietary and confidential.

---

## 👨‍💻 Author

Mercury Mystery Admin Team

---

## 🎯 Key Features Summary

✅ **Local MongoDB** - No cloud, full control
✅ **MongoDB Compass** - Visual data management
✅ **JWT Auth** - Secure authentication
✅ **Excel Upload** - Bulk import audits
✅ **Smart Scoring** - Automatic calculation
✅ **Real-time Analytics** - Live dashboards
✅ **Glass Morphism UI** - Premium design
✅ **TypeScript** - Type-safe development
✅ **Complete API** - 35+ endpoints
✅ **Full Documentation** - 10+ guides

---

**🚀 Start building with Mercury Mystery Admin today!**

Begin with: **[START_HERE_MONGODB_LOCAL.md](./START_HERE_MONGODB_LOCAL.md)**

---

**Status:** ✅ Production Ready | **Database:** 🗄️ Local MongoDB | **Port:** 🌐 3000 (Frontend), 5002 (Backend)
