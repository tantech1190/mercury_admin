# 🚀 Mercury Mystery Admin - Backend API

Complete Node.js/Express backend with MongoDB for Mercury Mystery Admin application.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Score Calculation](#score-calculation)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Testing](#testing)
- [Deployment](#deployment)

---

## ✨ Features

### Core Features
- ✅ **JWT Authentication** - Secure user authentication
- ✅ **Role-Based Access Control** - Admin, Manager, Viewer roles
- ✅ **Auditor Management** - CRUD operations for auditors
- ✅ **Audit Management** - Complete audit lifecycle management
- ✅ **Excel File Upload** - Parse and import audit data from Excel
- ✅ **Automatic Score Calculation** - Intelligent scoring system
- ✅ **Comprehensive Reports** - Analytics and performance metrics
- ✅ **Multi-Type Audits** - Store, ILMS, XFE audits
- ✅ **Performance Tracking** - Auditor metrics and statistics

### Technical Features
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ File upload with Multer
- ✅ Rate limiting
- ✅ CORS support
- ✅ Compression
- ✅ Security with Helmet
- ✅ Logging with Morgan
- ✅ RESTful API design

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Processing**: Multer, XLSX
- **Validation**: express-validator
- **Security**: Helmet, bcryptjs
- **Other**: dotenv, cors, compression, morgan

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (v4.4 or higher)
  - Local installation OR
  - MongoDB Atlas account

---

## 🚀 Installation

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
```bash
cp .env.example .env
```

### 4. Configure environment variables (see below)

---

## ⚙️ Configuration

Edit the `.env` file with your settings:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin

# For MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mercury_mystery_admin?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Important Configuration Notes:

#### MongoDB URI:
**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
```

**MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mercury_mystery_admin?retryWrites=true&w=majority
```

#### JWT Secret:
⚠️ **IMPORTANT**: Change `JWT_SECRET` to a strong, random string in production!

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🏃 Running the Server

### Development Mode (with nodemon)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Server will start on:
```
http://localhost:5000
```

### Verify server is running:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Mercury Mystery Admin API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development",
  "database": "Connected"
}
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### API Collection
Import the Postman collection: `Mercury_Mystery_Admin_API_Collection.json`

### Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Main Endpoints

#### 🔐 Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update` - Update user details
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

#### 👥 Auditors
- `GET /api/auditors` - Get all auditors
- `GET /api/auditors/stats` - Get auditor statistics
- `GET /api/auditors/:id` - Get single auditor
- `POST /api/auditors` - Create auditor
- `PUT /api/auditors/:id` - Update auditor
- `DELETE /api/auditors/:id` - Delete auditor
- `POST /api/auditors/:id/update-metrics` - Update metrics

#### 📋 Audits
- `GET /api/audits` - Get all audits (with filters)
- `GET /api/audits/stats` - Get audit statistics
- `GET /api/audits/analytics` - Get analytics
- `GET /api/audits/:id` - Get single audit
- `POST /api/audits` - Create audit
- `PUT /api/audits/:id` - Update audit
- `PATCH /api/audits/:id/assign` - Assign to auditor
- `PATCH /api/audits/:id/status` - Update status
- `PATCH /api/audits/:id/calculate-score` - Calculate score
- `DELETE /api/audits/:id` - Delete audit
- `DELETE /api/audits` - Bulk delete audits

#### 📤 Upload
- `POST /api/upload/excel` - Upload Excel file
- `GET /api/upload/template/:type` - Download template

#### 📊 Reports
- `GET /api/reports/overview` - Get overview
- `GET /api/reports/auditor-performance` - Auditor performance
- `GET /api/reports/circle-performance` - Circle performance
- `GET /api/reports/score-analytics` - Score analytics
- `GET /api/reports/audit-type-breakdown` - Type breakdown
- `GET /api/reports/trending` - Trending data
- `GET /api/reports/export` - Export data (CSV)

---

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'manager' | 'viewer',
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### Auditor Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  circles: [String], // AP, BH, DEL, etc.
  isActive: Boolean,
  employeeId: String,
  joiningDate: Date,
  totalAuditsAssigned: Number,
  totalAuditsCompleted: Number,
  averageScore: Number,
  scoreBreakdown: {
    store: { count, avgScore },
    ilms: { count, avgScore },
    xfe: { count, avgScore }
  },
  notes: String,
  timestamps: true
}
```

### Audit Model
```javascript
{
  storeCode: String,
  storeName: String,
  location: String,
  circle: String, // AP, BH, DEL, etc.
  auditType: 'store' | 'ilms' | 'xfe',
  auditorId: ObjectId (ref: Auditor),
  status: 'unassigned' | 'open' | 'in-progress' | 'at-risk' | 'completed',
  deadline: Date,
  score: Number (0-100),
  scoreBreakdown: Object,
  rawData: Object, // All Excel responses
  // Type-specific fields...
  timestamps: true
}
```

---

## 🎯 Score Calculation

The system automatically calculates scores based on audit responses.

### Scoring Methodology:

#### STORE Audits (8 categories):
1. **Store Discovery** (10%) - Location, hours accuracy
2. **Store Hygiene** (20%) - Cleanliness, facilities
3. **Greet & Behavior** (25%) - Customer service
4. **Needs Analysis** (15%) - Sales approach
5. **Grooming** (10%) - Staff appearance
6. **Branding** (10%) - Visual standards
7. **No Denials** (5%) - Service availability
8. **No Illegal Practices** (5%) - Compliance

#### ILMS Audits (6 categories):
1. **Response Time** (15%)
2. **Advisor Interaction** (25%)
3. **Ambassador Visit** (25%)
4. **Grooming** (10%)
5. **Needs Analysis** (15%)
6. **Process Compliance** (10%)

#### XFE Audits (6 categories):
1. **Call Connectivity** (10%)
2. **XFE Introduction** (15%)
3. **Needs Analysis** (25%)
4. **Product Knowledge** (25%)
5. **Service Quality** (15%)
6. **Compliance** (10%)

### Score Calculation:
```
Final Score = Σ(Category Score × Weight)

If "Overall Experience" rating exists:
Final Score = (Calculated × 70%) + (Overall Rating × 30%)
```

---

## 🔒 Authentication

### Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@mercury.com",
  "password": "password123",
  "role": "admin"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@mercury.com",
  "password": "password123"
}
```

### Response:
```json
{
  "success": true,
  "message": "Login successful",
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

### Using the Token:
```bash
GET /api/auditors
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📤 File Upload

### Upload Excel File
```bash
POST /api/upload/excel
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

file: audit_data.xlsx
```

### Supported Formats:
- `.xls`
- `.xlsx`
- `.xlsm`

### Max File Size: 10MB (configurable)

### Excel File Requirements:
- First row must contain headers
- System auto-detects audit type (Store/ILMS/XFE)
- Headers are case-insensitive
- Empty rows are skipped

### Response:
```json
{
  "success": true,
  "message": "47 audit(s) uploaded successfully",
  "data": {
    "auditType": "store",
    "totalRows": 50,
    "successfulRows": 47,
    "failedRows": 3,
    "audits": [...],
    "errors": [...]
  }
}
```

---

## 🧪 Testing

### Using Postman/Thunder Client:

1. Import the API collection:
   ```
   Mercury_Mystery_Admin_API_Collection.json
   ```

2. Set environment variables:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: (auto-populated after login)

3. Test flow:
   ```
   1. Register/Login → Get token
   2. Create Auditor
   3. Create/Upload Audits
   4. Assign Audits to Auditor
   5. Update Status
   6. Get Reports
   ```

### Using cURL:

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

**Get Audits:**
```bash
curl -X GET http://localhost:5000/api/audits \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🚀 Deployment

### Prerequisites for Production:

1. **MongoDB Database** (MongoDB Atlas recommended)
2. **Node.js hosting** (Heroku, AWS, DigitalOcean, etc.)
3. **Environment variables configured**

### Deployment Steps:

#### 1. Set Production Environment
```env
NODE_ENV=production
```

#### 2. Use MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

#### 3. Generate Strong JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 4. Configure CORS for Your Frontend
```env
CORS_ORIGIN=https://your-frontend-domain.com
```

#### 5. Build and Deploy
```bash
npm install --production
npm start
```

### Deployment Platforms:

#### **Heroku:**
```bash
heroku create mercury-backend
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

#### **AWS/DigitalOcean:**
- Use PM2 for process management
- Set up Nginx as reverse proxy
- Configure SSL certificate

---

## 📁 Project Structure

```
backend/
├── controllers/         # Route controllers
│   ├── auth.controller.js
│   ├── auditor.controller.js
│   ├── audit.controller.js
│   ├── upload.controller.js
│   └── report.controller.js
├── middleware/          # Custom middleware
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── upload.middleware.js
├── models/              # Mongoose models
│   ├── User.model.js
│   ├── Auditor.model.js
│   └── Audit.model.js
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── auditor.routes.js
│   ├── audit.routes.js
│   ├── upload.routes.js
│   └── report.routes.js
├── utils/               # Utility functions
│   ├── scoreCalculator.js
│   └── excelParser.js
├── uploads/             # File upload directory
├── .env.example         # Environment template
├── .gitignore
├── package.json
├── server.js            # Entry point
├── README.md
└── Mercury_Mystery_Admin_API_Collection.json
```

---

## 🔧 Troubleshooting

### MongoDB Connection Issues:
```bash
# Check if MongoDB is running
mongo --version
mongod --version

# Start MongoDB locally
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Port Already in Use:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 PID
```

### JWT Token Errors:
- Ensure `JWT_SECRET` is set in `.env`
- Check token format: `Bearer TOKEN`
- Verify token hasn't expired

### File Upload Errors:
- Check file size (max 10MB)
- Verify file format (.xls, .xlsx, .xlsm)
- Ensure `uploads/` directory exists

---

## 📄 License

This project is private and proprietary.

---

## 👥 Support

For support, contact: admin@mercury.com

---

## 🎉 Quick Start Guide

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Start MongoDB (if local)
mongod

# 4. Run the server
npm run dev

# 5. Test the API
curl http://localhost:5000/api/health

# 6. Import API collection to Postman
# File: Mercury_Mystery_Admin_API_Collection.json

# 7. Register first user
POST /api/auth/register

# 8. Start using the API! 🚀
```

---

**✨ Your Mercury Mystery Admin Backend is ready! ✨**
