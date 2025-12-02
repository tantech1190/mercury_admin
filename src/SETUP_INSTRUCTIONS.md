# 🚀 Mercury Mystery Admin - Complete Setup Instructions

## ✅ Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **MongoDB Compass** (optional but recommended) - [Download](https://www.mongodb.com/try/download/compass)
- **npm** or **yarn** package manager

---

## 📦 Step 1: Install Dependencies

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
# From root directory
npm install
```

---

## 🔧 Step 2: Configure Environment Variables

### Backend (.env file)
The `/backend/.env` file is already created with these settings:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
JWT_SECRET=mercury_mystery_admin_super_secret_key_2024_change_in_production
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Note**: Change `JWT_SECRET` in production!

### Frontend (.env file)
The `/.env` file is already created with:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Mercury Mystery Admin
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

---

## 🗄️ Step 3: Start MongoDB

### For macOS:
```bash
brew services start mongodb-community
```

### For Linux:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### For Windows:
```bash
net start MongoDB
```

### Verify MongoDB is Running:
```bash
mongosh
# Should connect successfully
```

---

## 🏃 Step 4: Start the Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
Database: mercury_mystery_admin
```

The backend will be available at: `http://localhost:5000`

---

## 🎨 Step 5: Start the Frontend

```bash
# From root directory (not in backend folder)
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms
Local: http://localhost:3000/
```

The app will be available at: `http://localhost:3000`

---

## 👤 Step 6: Create Your First Account

1. **Open the app**: Navigate to `http://localhost:3000`
2. **Click \"Sign Up\"** (button below the sign-in form)
3. **Fill in your details**:
   - Full Name: Your Name
   - Email: admin@mercury.com (or your email)
   - Password: At least 6 characters
   - Confirm Password: Same as above
4. **Click \"Create Account\"**
5. You'll be automatically logged in!

---

## 🔍 Step 7: Verify in MongoDB Compass

1. **Open MongoDB Compass**
2. **Connect** to: `mongodb://localhost:27017`
3. **Navigate to Database**: `mercury_mystery_admin`
4. **You should see these collections**:
   - `users` - Your admin account will be here
   - `auditors` - Will populate when you add auditors
   - `audits` - Will populate when you add audits

5. **Check your user**:
   - Click on `users` collection
   - You should see your registered user with hashed password

---

## 📊 Step 8: Start Using the App

### ✅ Create Auditors (FULLY INTEGRATED):
1. Go to **Auditors** tab
2. Click **\"Create Auditor\"** button
3. Fill in details:
   - Full Name
   - Email Address
   - Phone Number (optional)
   - Select Circles to Cover
4. Click **\"Create Auditor\"**
5. ✅ Toast notification: "✅ Auditor created successfully!"
6. **Check MongoDB Compass** → Refresh `auditors` collection → New auditor appears instantly!

### ✅ Edit Auditors:
1. Click **Edit icon** on any auditor card
2. Modify fields
3. Click **\"Update Auditor\"**
4. ✅ Toast notification: "✅ Auditor updated successfully!"
5. **Check MongoDB Compass** → Refresh → Changes saved!

### ✅ Delete Auditors:
1. Click **Delete icon** on any auditor card
2. Confirm deletion
3. ✅ Toast notification: "🗑️ [Name] deleted successfully"
4. **Check MongoDB Compass** → Refresh → Auditor removed!

### ✅ Bulk Upload Auditors:
1. Click **\"Bulk Upload\"** button
2. Click **\"Choose File\"**
3. Select CSV file (Format: Name, Email, Phone, Circles)
4. ✅ Toast notification: "✅ X auditors uploaded successfully!"
5. **Check MongoDB Compass** → Refresh → All auditors appear!

### ✅ Refresh Auditors:
1. Click **\"Refresh\"** button
2. Latest data loads from MongoDB
3. Always in sync!

### ⚠️ Create Audits (NOT YET INTEGRATED):
1. Go to **Audits** tab
2. Click **\"+ Create Audit\"** or **\"Bulk Upload\"**
3. For bulk upload, download the template
4. Fill the template and upload
5. **Note**: This module is still using mock data
6. **Coming soon**: Full API integration

### ⚠️ Assign Audits (NOT YET INTEGRATED):
1. Go to **Audits** tab
2. Find an unassigned audit
3. Click the auditor dropdown
4. Select an auditor
5. **Note**: Still using mock data
6. **Coming soon**: Full API integration

### ⚠️ View Reports (NOT YET INTEGRATED):
1. Go to **Reports** tab
2. See analytics (currently mock data)
3. **Coming soon**: Real-time MongoDB data

---

## 🎯 Integration Status

### ✅ **Fully Integrated Modules:**

#### **1. Authentication (Login/Signup)**
- ✅ Create account → Saves to MongoDB `users` collection
- ✅ Login → Validates against MongoDB
- ✅ JWT tokens → Stored in localStorage
- ✅ Protected routes → Auth required
- ✅ Logout → Clears tokens
- ✅ Persistent sessions → Token refresh

#### **2. Auditor Management** 
- ✅ **GET** all auditors → Fetches from MongoDB
- ✅ **POST** create auditor → Saves to MongoDB
- ✅ **PUT** update auditor → Updates MongoDB document
- ✅ **DELETE** remove auditor → Removes from MongoDB
- ✅ Bulk upload CSV → Multiple creates
- ✅ Refresh button → Re-fetch data
- ✅ Loading states → Spinner during API calls
- ✅ Toast notifications → Success/Error messages
- ✅ Edit functionality → Pre-fill form
- ✅ Real-time sync with MongoDB Compass

**All auditor operations are instantly visible in MongoDB Compass!**

---

### ⚠️ **Pending Integration:**

#### **3. Audit Management** (High Priority)
- ⚠️ Still using mock data
- ⚠️ Needs full CRUD API integration
- ⚠️ Bulk upload needs API
- ⚠️ Status updates need API
- ⚠️ Assignment needs API

#### **4. Dashboard/Reports** (Medium Priority)
- ⚠️ Still showing mock statistics
- ⚠️ Needs real-time data from MongoDB
- ⚠️ Charts need API integration

#### **5. Assignment Management** (Medium Priority)
- ⚠️ Still using mock data
- ⚠️ Needs API integration

#### **6. Other Features** (Low Priority)
- ⚠️ Location tracking
- ⚠️ AI analysis
- ⚠️ Advanced filters

---

## 🎯 Common Issues & Solutions

### Issue 1: \"Cannot connect to MongoDB\"
**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB
```

### Issue 2: \"Port 5000 already in use\"
**Solution:**
```bash
# Find and kill the process
lsof -i :5000
kill -9 <PID>

# Or change the port in backend/.env
PORT=5001
```

### Issue 3: \"CORS Error\"
**Solution:**
- Ensure backend `.env` has: `CORS_ORIGIN=http://localhost:3000`
- Make sure frontend is running on port 3000
- Restart both servers

### Issue 4: \"Token expired\" or \"Unauthorized\"
**Solution:**
- Logout and login again
- Check if JWT_SECRET matches in backend/.env
- Clear browser localStorage

### Issue 5: Changes not visible in MongoDB Compass
**Solution:**
- Click the **Refresh** button in Compass
- Ensure you're looking at the correct database: `mercury_mystery_admin`
- Check if the operation was successful in the app (look for toast notification)

### Issue 6: \"Cannot find module 'sonner'\"
**Solution:**
```bash
# Install sonner for toast notifications
npm install sonner@2.0.3
```

### Issue 7: Auditor form not showing
**Solution:**
- Check browser console for errors
- Ensure all services are imported correctly
- Verify backend is running

---

## 📁 Project Structure

```
mercury-mystery-admin/
├── backend/
│   ├── controllers/      # ✅ API logic (auth, auditor, audit, upload, reports)
│   ├── models/          # ✅ MongoDB schemas (User, Auditor, Audit)
│   ├── routes/          # ✅ API endpoints (all defined)
│   ├── middleware/      # ✅ Auth, upload, error handling
│   ├── utils/           # ✅ Helper functions
│   ├── uploads/         # ✅ Uploaded files (auto-created)
│   ├── .env            # ✅ Backend config
│   └── server.js        # ✅ Entry point
│
├── components/          # React components
│   ├── LoginPage.tsx    # ✅ INTEGRATED - Auth page (login/signup)
│   ├── Dashboard.tsx    # ✅ INTEGRATED - Main dashboard
│   ├── AuditorManagement.tsx # ✅ INTEGRATED - Full CRUD
│   ├── AuditorForm.tsx  # ✅ INTEGRATED - Create/Edit form
│   ├── AuditManagement.tsx   # ⚠️ NOT INTEGRATED - Still mock
│   ├── AssignmentManagement.tsx # ⚠️ NOT INTEGRATED - Still mock
│   ├── DashboardHome.tsx # ⚠️ NOT INTEGRATED - Still mock
│   ├── ReportsView.tsx  # ⚠️ NOT INTEGRATED - Still mock
│   └── ...
│
├── services/           # ✅ API service layer
│   ├── api.ts          # ✅ Axios config with interceptors
│   ├── auth.service.ts # ✅ INTEGRATED - All auth methods
│   ├── auditor.service.ts # ✅ INTEGRATED - All auditor methods
│   ├── audit.service.ts   # ✅ READY - Needs component integration
│   ├── upload.service.ts  # ✅ READY - Needs component integration
│   └── reports.service.ts # ✅ READY - Needs component integration
│
├── contexts/
│   └── AuthContext.tsx  # ✅ INTEGRATED - Global auth state
│
├── .env                # ✅ Frontend config
└── App.tsx             # ✅ INTEGRATED - Main app with routing
```

---

## 🔐 Security Notes

### For Development:
- ✅ JWT secret is set
- ✅ Passwords are hashed with bcrypt (12 rounds)
- ✅ CORS is configured
- ✅ Rate limiting enabled (100 requests per 15 min)
- ✅ Input validation on all endpoints
- ✅ Protected routes with auth middleware

### For Production:
- ⚠️ Generate a strong JWT secret (use crypto.randomBytes)
- ⚠️ Use MongoDB Atlas (cloud) instead of local
- ⚠️ Enable HTTPS
- ⚠️ Set secure CORS origins
- ⚠️ Use environment-specific configs
- ⚠️ Enable MongoDB authentication
- ⚠️ Use .env.production files
- ⚠️ Add request logging
- ⚠️ Set up monitoring

---

## 🧪 Testing the Integration

### ✅ Test 1: Signup → MongoDB
1. Sign up with a new account
2. Open MongoDB Compass
3. Refresh `users` collection
4. ✅ Should see new user with hashed password
5. ✅ Toast: "Welcome! Account created successfully"

### ✅ Test 2: Login → JWT Token
1. Login with credentials
2. Check browser localStorage
3. ✅ Should see `mercury_admin_token`
4. ✅ Toast: "Login successful!"

### ✅ Test 3: Create Auditor → MongoDB
1. Create a new auditor in the app
2. ✅ Toast: "✅ Auditor created successfully!"
3. Check MongoDB Compass `auditors` collection
4. ✅ Should see new auditor immediately with all fields

### ✅ Test 4: Edit Auditor → MongoDB
1. Click edit on an auditor
2. Change name and circles
3. Click "Update Auditor"
4. ✅ Toast: "✅ Auditor updated successfully!"
5. Check MongoDB Compass
6. ✅ Document updated with new values
7. ✅ `updatedAt` timestamp changed

### ✅ Test 5: Delete Auditor → MongoDB
1. Click delete on an auditor
2. Confirm deletion
3. ✅ Toast: "🗑️ [Name] deleted successfully"
4. Check MongoDB Compass
5. ✅ Document removed from collection

### ✅ Test 6: Bulk Upload → MongoDB
1. Download auditor CSV template (or create manually)
2. Add 5 auditors to the CSV
3. Upload the file
4. ✅ Toast: "✅ 5 auditors uploaded successfully!"
5. Check MongoDB Compass `auditors` collection
6. ✅ Should see all 5 auditors with proper structure

### ✅ Test 7: Refresh → Latest Data
1. Open MongoDB Compass
2. Manually add an auditor directly in Compass
3. Go back to app
4. Click "Refresh" button
5. ✅ New auditor appears in the list

### ⚠️ Test 8: Bulk Upload Audits (Pending)
1. Download audit template
2. Add 10 audits to the CSV
3. Upload the file
4. ⚠️ Currently saves to mock data
5. ⚠️ Will save to MongoDB after integration

### ⚠️ Test 9: Assign Audit (Pending)
1. Assign an audit to an auditor
2. ⚠️ Currently updates mock data
3. ⚠️ Will update MongoDB after integration

### ⚠️ Test 10: Update Status (Pending)
1. Change audit status to \"completed\"
2. ⚠️ Currently updates mock data
3. ⚠️ Will update MongoDB after integration

---

## 📱 API Endpoints

All APIs are available at: `http://localhost:5000/api`

### ✅ Authentication (INTEGRATED):
- `POST /api/auth/register` - Create account ✅ Working
- `POST /api/auth/login` - Login ✅ Working
- `GET /api/auth/me` - Get current user ✅ Working
- `POST /api/auth/logout` - Logout ✅ Working

### ✅ Auditors (INTEGRATED):
- `GET /api/auditors` - Get all auditors ✅ Working
- `GET /api/auditors/:id` - Get single auditor ✅ Working
- `POST /api/auditors` - Create auditor ✅ Working
- `PUT /api/auditors/:id` - Update auditor ✅ Working
- `DELETE /api/auditors/:id` - Delete auditor ✅ Working
- `GET /api/auditors/circle/:circle` - Get by circle ✅ Working

### ⚠️ Audits (READY - NOT INTEGRATED):
- `GET /api/audits` - Get all audits ✅ Backend ready
- `GET /api/audits/:id` - Get single audit ✅ Backend ready
- `POST /api/audits` - Create audit ✅ Backend ready
- `PUT /api/audits/:id` - Update audit ✅ Backend ready
- `PATCH /api/audits/:id/assign` - Assign auditor ✅ Backend ready
- `PATCH /api/audits/:id/status` - Update status ✅ Backend ready
- `DELETE /api/audits/:id` - Delete audit ✅ Backend ready
- `GET /api/audits/type/:type` - Get by type ✅ Backend ready
- `GET /api/audits/status/:status` - Get by status ✅ Backend ready

### ⚠️ Upload (READY - NOT INTEGRATED):
- `POST /api/upload/excel` - Upload Excel/CSV ✅ Backend ready
- `GET /api/upload/template/:type` - Download template ✅ Backend ready

### ⚠️ Reports (READY - NOT INTEGRATED):
- `GET /api/reports/overview` - Get statistics ✅ Backend ready
- `GET /api/reports/auditor-performance` - Auditor reports ✅ Backend ready
- `GET /api/reports/circle-performance` - Circle reports ✅ Backend ready
- `GET /api/reports/audit-type-distribution` - Type distribution ✅ Backend ready

---

## ✅ Success Checklist

### Environment Setup:
- [ ] MongoDB is running (`mongosh` connects)
- [ ] Backend server started (port 5000)
- [ ] Frontend app started (port 3000)
- [ ] Both .env files configured

### Authentication:
- [ ] Created an account via signup
- [ ] Can see user in MongoDB Compass `users` collection
- [ ] Can login successfully
- [ ] JWT token stored in localStorage
- [ ] Can logout

### Auditor Management (Fully Integrated):
- [ ] Created an auditor
- [ ] Can see auditor in MongoDB Compass `auditors` collection
- [ ] Edited an auditor
- [ ] Changes reflect in MongoDB Compass
- [ ] Deleted an auditor
- [ ] Auditor removed from MongoDB Compass
- [ ] Bulk uploaded auditors
- [ ] All auditors appear in MongoDB Compass
- [ ] Refreshed auditor list
- [ ] Latest data loads from MongoDB

### Pending Integrations:
- [ ] Create/upload audits (still mock data)
- [ ] Assign audits (still mock data)
- [ ] View real-time reports (still mock data)
- [ ] Dashboard statistics (still mock data)

---

## 🎉 You're All Set!

### What's Working Now:
✅ **Authentication** - Full signup, login, logout with MongoDB
✅ **Auditor Management** - Complete CRUD operations with MongoDB
✅ **Real-time Sync** - All changes instantly visible in MongoDB Compass
✅ **Toast Notifications** - Clear user feedback
✅ **Loading States** - Professional UX
✅ **Error Handling** - User-friendly messages

### What's Next:
🔜 **Audit Management** - Full API integration
🔜 **Dashboard** - Real-time statistics from MongoDB
🔜 **Reports** - Live analytics
🔜 **Assignment Management** - API integration

Every auditor operation you perform in the app is saved to your local MongoDB database and visible in MongoDB Compass in real-time!

**Happy Auditing! 📊✨**

---

## 📚 Additional Documentation

- **API_INTEGRATION_COMPLETE.md** - Detailed integration docs for AuditorManagement
- **QUICK_START_FIXED.md** - Quick setup guide
- **ERROR_FIXES_SUMMARY.md** - All errors fixed
- **TROUBLESHOOTING.md** - Common issues & solutions
- **API_INTEGRATION_GUIDE.md** - How to use all services
- **POSTMAN_GUIDE.md** - API testing with Postman
- **backend/README.md** - Complete backend documentation
- **backend/SETUP_GUIDE.md** - Backend setup details

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Check the backend terminal for errors
3. Verify MongoDB is running (`mongosh`)
4. Ensure all ports are available (3000, 5000, 27017)
5. Try restarting all services
6. Check toast notifications for specific error messages
7. Look at MongoDB Compass to verify data
8. Review the troubleshooting guide

---

**Last Updated**: November 28, 2024
**Version**: 1.0.0
**Status**: Authentication & Auditor Management Fully Integrated ✅
