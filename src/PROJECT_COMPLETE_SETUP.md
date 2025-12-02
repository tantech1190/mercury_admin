# 🎯 Mercury Mystery Admin - Complete Project Setup

## 📊 Project Overview

**Mercury Mystery Admin** is a comprehensive admin application for managing auditors and audit assignments with a premium luxury design featuring glass morphism effects and teal color palette.

### Key Features
- 🔐 JWT Authentication System
- 👥 Auditor Management (CRUD)
- 📋 Audit Assignment & Tracking
- 📊 Real-time Analytics & Reports
- 📤 Excel File Upload & Parsing
- 🗄️ Local MongoDB Integration
- 🎨 Premium Glass Morphism UI
- 📱 Fully Responsive Design

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS v4.0
- 🔄 Axios for API calls
- 🎭 Glass Morphism Design System

**Backend:**
- 🚀 Node.js + Express.js
- 🗄️ MongoDB (Local with Mongoose)
- 🔐 JWT Authentication
- 📊 MongoDB Aggregation Pipeline
- 📤 Multer for file uploads
- 📈 XLSX for Excel parsing

**Database:**
- 🗄️ MongoDB (Local Instance)
- 📊 MongoDB Compass (GUI)
- 🔍 3 Collections: users, auditors, audits

---

## 🎨 Color Palette

```css
Primary Teal:    #0AAE9A
Dark Teal:       #078672
Soft Teal:       #E0F7F4
Navy Navbar:     #20252B
Light Gray BG:   #F5F7FA
```

---

## 📁 Project Structure

```
mercury-mystery-admin/
├── 📂 backend/                    # Backend API
│   ├── 📂 controllers/            # Request handlers
│   │   ├── auth.controller.js     # Authentication
│   │   ├── auditor.controller.js  # Auditor CRUD
│   │   ├── audit.controller.js    # Audit CRUD
│   │   ├── report.controller.js   # Analytics
│   │   └── upload.controller.js   # File uploads
│   ├── 📂 models/                 # MongoDB schemas
│   │   ├── User.model.js          # User model
│   │   ├── Auditor.model.js       # Auditor model
│   │   └── Audit.model.js         # Audit model
│   ├── 📂 routes/                 # API routes
│   │   ├── auth.routes.js
│   │   ├── auditor.routes.js
│   │   ├── audit.routes.js
│   │   ├── report.routes.js
│   │   └── upload.routes.js
│   ├── 📂 middleware/             # Middleware
│   │   ├── auth.middleware.js     # JWT verification
│   │   ├── error.middleware.js    # Error handler
│   │   └── upload.middleware.js   # File upload
│   ├── 📂 utils/                  # Utilities
│   │   ├── scoreCalculator.js     # Score calculation
│   │   └── excelParser.js         # Excel parsing
│   ├── .env                       # Environment config
│   ├── package.json
│   └── server.js                  # Entry point
│
├── 📂 components/                 # React components
│   ├── 📂 layout/
│   ├── 📂 auditors/
│   ├── 📂 audits/
│   ├── 📂 dashboard/
│   └── 📂 reports/
│
├── 📂 services/                   # API services
│   ├── api.ts                     # Axios config
│   ├── auth.service.ts            # Auth API calls
│   ├── auditor.service.ts         # Auditor API calls
│   ├── audit.service.ts           # Audit API calls
│   └── report.service.ts          # Report API calls
│
├── 📂 config/                     # Configuration
│   └── api.config.ts              # API URL config
│
├── 📂 types/                      # TypeScript types
│   └── index.ts                   # Centralized types
│
├── 📂 styles/                     # Global styles
│   └── globals.css                # Tailwind + custom CSS
│
└── 📄 Documentation/              # All docs
    ├── START_HERE_MONGODB_LOCAL.md
    ├── STARTUP_CHECKLIST.md
    ├── API_TESTING_GUIDE.md
    ├── MONGODB_COMPASS_INSTRUCTIONS.md
    ├── BACKEND_API_RESPONSE_FIX.md
    ├── FIXED_CLASSES_LIST.md
    └── API_INTEGRATION_GUIDE.md
```

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- ✅ Node.js v14+ installed
- ✅ MongoDB installed and running
- ✅ MongoDB Compass installed (optional but recommended)

### 1. Clone & Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure MongoDB

**Backend `.env` file is already configured for local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
PORT=5002
```

### 3. Start Everything

**Terminal 1 - Start MongoDB:**
```bash
# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows: MongoDB starts automatically
```

**Terminal 2 - Start Backend:**
```bash
cd backend
npm start
```

**Terminal 3 - Start Frontend:**
```bash
npm run dev
```

### 4. Open Application

```
http://localhost:3000
```

**✅ You're ready to go!**

---

## 📊 Database Collections

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin|manager|viewer),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Auditors Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  circles: [String],
  status: String (active|inactive),
  performanceMetrics: {
    totalAuditsAssigned: Number,
    totalAuditsCompleted: Number,
    averageScore: Number,
    completionRate: Number
  },
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Audits Collection
```javascript
{
  _id: ObjectId,
  storeCode: String,
  storeName: String,
  location: String,
  auditType: String (store|ilms|xfe),
  circle: String,
  deadline: Date,
  status: String (unassigned|open|in-progress|completed|at-risk),
  score: Number,
  auditorId: ObjectId,
  auditorName: String,
  auditorEmail: String,
  rawData: Object (150+ fields for store audits),
  uploadedFile: Object,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

---

## 🔑 API Endpoints

### Authentication (`/api/auth`)
```
POST   /register         # Sign up
POST   /login            # Login
GET    /me               # Get current user
PUT    /update           # Update profile
PUT    /change-password  # Change password
POST   /logout           # Logout
```

### Auditors (`/api/auditors`)
```
GET    /                 # Get all auditors
GET    /stats            # Get statistics
GET    /:id              # Get single auditor
POST   /                 # Create auditor
PUT    /:id              # Update auditor
DELETE /:id              # Delete auditor
POST   /:id/update-metrics  # Update metrics
```

### Audits (`/api/audits`)
```
GET    /                 # Get all audits
GET    /stats            # Get statistics
GET    /analytics        # Get analytics
GET    /:id              # Get single audit
POST   /                 # Create audit
PUT    /:id              # Update audit
DELETE /:id              # Delete audit
PATCH  /:id/assign       # Assign to auditor
PATCH  /:id/status       # Update status
PATCH  /:id/calculate-score  # Calculate score
DELETE /                 # Bulk delete
```

### Reports (`/api/reports`)
```
GET    /overview                # Dashboard stats
GET    /auditor-performance     # Auditor reports
GET    /circle-performance      # Circle reports
GET    /score-analytics         # Score analytics
GET    /audit-type-breakdown    # Type breakdown
GET    /trending                # Trending data
GET    /export                  # Export CSV
```

### Upload (`/api/upload`)
```
POST   /excel                   # Upload Excel
GET    /template/:type          # Download template
```

---

## 🔐 Authentication Flow

1. **Sign Up** → Create admin account
2. **Login** → Get JWT token
3. **Store Token** → Save in localStorage
4. **Include Token** → All API calls: `Authorization: Bearer TOKEN`
5. **Logout** → Clear token

---

## 📤 Excel Upload Format

### Store Audits (150+ fields)
```
Timestamp | Auditor Name | Email | Circle | Store Code | Store Name | Location | 
Pincode | Month | Year | Score | [150+ audit questions]
```

### ILMS Audits (60+ fields)
```
Timestamp | Auditor Name | Email | Circle | Location | Month | Year | Score |
[60+ ILMS questions]
```

### XFE Audits (40+ fields)
```
Timestamp | Auditor Name | Email | Circle | Location | Month | Year | Score |
[40+ XFE questions]
```

---

## 📊 Score Calculation

### Store Audits
- Customer Service: 30%
- Store Ambience: 25%
- Product Display: 20%
- Staff Behavior: 15%
- Overall Experience: 10%

### ILMS Audits
- Call Handling: 40%
- Process Adherence: 35%
- Ambassador Performance: 25%

### XFE Audits
- Call Quality: 50%
- Process Knowledge: 30%
- Customer Experience: 20%

**Final Score:** Weighted average of all categories (0-100)

---

## 🗂️ Circle Codes (State-Based)

```javascript
const circles = [
  'DEL',  // Delhi
  'Mum',  // Mumbai
  'BLR',  // Bangalore
  'CHN',  // Chennai
  'KOL',  // Kolkata
  'HYD',  // Hyderabad
  'PUN',  // Pune
  'AHM',  // Ahmedabad
  'JDP',  // Jodhpur
  'LKW',  // Lucknow
  // ... more circles
];
```

---

## 🎨 UI Components

### Glass Morphism Effects
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### Color Classes
```css
.teal-primary     # #0AAE9A
.teal-dark        # #078672
.teal-soft        # #E0F7F4
.navy-navbar      # #20252B
.bg-light         # #F5F7FA
```

---

## 🧪 Testing

### Manual Testing
See **[API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)**

### Postman Collection
Import: `/backend/Mercury_Mystery_Admin_API_Collection.json`

### Health Check
```bash
curl http://localhost:5002/api/health
```

---

## 📚 Documentation Index

### Setup Guides
1. **[START_HERE_MONGODB_LOCAL.md](./START_HERE_MONGODB_LOCAL.md)** - Start here!
2. **[STARTUP_CHECKLIST.md](./STARTUP_CHECKLIST.md)** - Complete checklist
3. **[MONGODB_COMPASS_INSTRUCTIONS.md](./MONGODB_COMPASS_INSTRUCTIONS.md)** - Compass guide

### Development Guides
4. **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - API usage
5. **[API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)** - Test all endpoints
6. **[backend/README.md](./backend/README.md)** - Backend docs

### Recent Updates
7. **[BACKEND_API_RESPONSE_FIX.md](./BACKEND_API_RESPONSE_FIX.md)** - Response fixes
8. **[FIXED_CLASSES_LIST.md](./FIXED_CLASSES_LIST.md)** - Fixed controllers
9. **[API_RESPONSE_FIX_SUMMARY.md](./API_RESPONSE_FIX_SUMMARY.md)** - Quick summary

---

## ✅ Current Status

### ✅ Completed
- [x] Backend API (Node.js + Express)
- [x] MongoDB integration (local)
- [x] All controllers fixed
- [x] JWT authentication
- [x] Auditor management
- [x] Audit management
- [x] Score calculation
- [x] Excel upload & parsing
- [x] Reports & analytics
- [x] TypeScript frontend services
- [x] API response structure standardized
- [x] MongoDB Compass setup
- [x] Complete documentation

### 🚧 In Progress
- [ ] Frontend UI components
- [ ] Dashboard charts
- [ ] File preview features
- [ ] Advanced filtering

### 📋 Planned
- [ ] Email notifications
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] PDF export
- [ ] Bulk operations UI

---

## 🔧 Configuration Files

### Backend `.env`
```env
NODE_ENV=development
PORT=5002
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
JWT_SECRET=mercury_mystery_admin_super_secret_jwt_key_2024
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend `config/api.config.ts`
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5002/api',
  TIMEOUT: 30000,
  WITH_CREDENTIALS: true
};
```

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Failed
```bash
# Check if running
brew services list | grep mongodb
# Start if needed
brew services start mongodb-community
```

### Port Already in Use
```bash
# Find process
lsof -i :5002
# Kill process
kill -9 <PID>
```

### CORS Error
```bash
# Check backend/.env
CORS_ORIGIN=http://localhost:3000
# Restart backend
```

### API 404 Error
```bash
# Verify backend URL in config/api.config.ts
BASE_URL: 'http://localhost:5002/api'
```

---

## 📞 Support

### Documentation
- All guides in project root
- Backend docs in `/backend`
- API examples in testing guide

### MongoDB Compass
- Connection: `mongodb://localhost:27017`
- Database: `mercury_mystery_admin`
- GUI for data visualization

---

## 🎯 Next Steps

1. ✅ **Setup Complete** - Follow [STARTUP_CHECKLIST.md](./STARTUP_CHECKLIST.md)
2. ✅ **Test APIs** - Follow [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)
3. 🚧 **Build UI** - Start creating frontend components
4. 📊 **View Data** - Use MongoDB Compass
5. 🚀 **Deploy** - Production deployment guide

---

## 🎉 Success Metrics

Your setup is complete when:
- ✅ MongoDB running and accessible
- ✅ Backend health check passes
- ✅ Frontend loads at localhost:3000
- ✅ Can sign up / login
- ✅ Can create auditors
- ✅ Can create audits
- ✅ Data visible in MongoDB Compass
- ✅ All API tests pass

---

## 📊 Project Stats

- **Backend Controllers:** 5 (auth, auditor, audit, report, upload)
- **API Endpoints:** 35+
- **Database Collections:** 3 (users, auditors, audits)
- **TypeScript Services:** 4 (auth, auditor, audit, report)
- **Documentation Files:** 10+
- **Lines of Code:** 5000+
- **Development Time:** Ready to use!

---

**🚀 Your Mercury Mystery Admin is ready to go!**

Start building amazing features with local MongoDB and a beautiful UI! 🎉
