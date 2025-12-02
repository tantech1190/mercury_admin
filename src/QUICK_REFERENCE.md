# ⚡ Mercury Mystery Admin - Quick Reference Card

**Keep this handy for daily development!**

---

## 🚀 Quick Start Commands

### Start Everything
```bash
# 1. Start MongoDB (Mac)
brew services start mongodb-community

# 2. Start Backend
cd backend && npm start

# 3. Start Frontend (new terminal)
npm run dev
```

**✅ Ready!** Open: `http://localhost:3000`

---

## 📊 Essential URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:5002/api | API endpoints |
| **Health Check** | http://localhost:5002/api/health | Verify backend |
| **MongoDB** | mongodb://localhost:27017 | Database connection |
| **Compass** | mongodb://localhost:27017 | Visual database |

---

## 🔑 Key Configuration

### Backend `.env`
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
JWT_SECRET=mercury_mystery_admin_super_secret_jwt_key_2024
```

### Frontend API
```typescript
BASE_URL: 'http://localhost:5002/api'
```

---

## 📁 Database Info

```
Database:   mercury_mystery_admin
Port:       27017
Host:       localhost

Collections:
├── users      (Admin accounts)
├── auditors   (Auditor profiles)
└── audits     (Audit records)
```

---

## 🔐 Authentication

### Sign Up
```bash
POST /api/auth/register
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "Admin@123456",
  "role": "admin"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "Admin@123456"
}
# Returns: { token: "..." }
```

### Use Token
```bash
Authorization: Bearer YOUR_TOKEN
```

---

## 👥 Auditor Endpoints

```bash
GET    /api/auditors           # List all
POST   /api/auditors           # Create new
GET    /api/auditors/:id       # Get one
PUT    /api/auditors/:id       # Update
DELETE /api/auditors/:id       # Delete
GET    /api/auditors/stats     # Statistics
```

---

## 📋 Audit Endpoints

```bash
GET    /api/audits             # List all
POST   /api/audits             # Create new
GET    /api/audits/:id         # Get one
PUT    /api/audits/:id         # Update
DELETE /api/audits/:id         # Delete
PATCH  /api/audits/:id/assign  # Assign
PATCH  /api/audits/:id/status  # Update status
```

---

## 📊 Report Endpoints

```bash
GET /api/reports/overview              # Dashboard
GET /api/reports/auditor-performance   # Performance
GET /api/reports/circle-performance    # Circles
GET /api/reports/export                # Export CSV
```

---

## 🔍 Common cURL Commands

### Health Check
```bash
curl http://localhost:5002/api/health
```

### Get All Auditors
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5002/api/auditors
```

### Create Auditor
```bash
curl -X POST http://localhost:5002/api/auditors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "circles": ["DEL", "Mum"]
  }'
```

---

## 🗄️ MongoDB Compass

### Connect
```
mongodb://localhost:27017
```

### View Data
1. Refresh databases
2. Click `mercury_mystery_admin`
3. Select collection (users/auditors/audits)
4. Browse documents

### Filter Documents
```javascript
{ "status": "active" }
{ "circle": "DEL" }
{ "auditType": "store" }
```

---

## 🐛 Quick Troubleshooting

### Backend Won't Start
```bash
# Check if port 5002 is free
lsof -i :5002

# Kill process if needed
kill -9 <PID>
```

### MongoDB Not Connected
```bash
# Check MongoDB status
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community
```

### CORS Error
```bash
# Check backend/.env
CORS_ORIGIN=http://localhost:3000

# Restart backend
```

### Data Not Showing
```bash
# Refresh MongoDB Compass
# Check backend console for errors
# Verify API call in browser network tab
```

---

## 🎨 Color Palette

```css
#0AAE9A  /* Primary Teal */
#078672  /* Dark Teal */
#E0F7F4  /* Soft Teal */
#20252B  /* Navy Navbar */
#F5F7FA  /* Background */
```

---

## 📊 Circle Codes

```
DEL - Delhi       Mum - Mumbai      BLR - Bangalore
CHN - Chennai     KOL - Kolkata     HYD - Hyderabad
PUN - Pune        AHM - Ahmedabad   JDP - Jodhpur
LKW - Lucknow     UPE - UP East     UPW - UP West
```

---

## 🧪 Test Sequence

```bash
# 1. Health check
curl http://localhost:5002/api/health

# 2. Sign up
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test@123"}'

# 3. Save token from response

# 4. Test authenticated endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5002/api/auditors
```

---

## 📁 Project Structure

```
mercury-mystery-admin/
├── backend/
│   ├── controllers/    # Request handlers
│   ├── models/         # DB schemas
│   ├── routes/         # API routes
│   ├── .env            # Config
│   └── server.js       # Entry
├── components/         # React components
├── services/           # API calls
├── config/             # Config files
└── App.tsx             # Main app
```

---

## 📚 Documentation Quick Links

| Need | Read This | Time |
|------|-----------|------|
| **Setup** | START_HERE_MONGODB_LOCAL.md | 2 min |
| **Checklist** | STARTUP_CHECKLIST.md | 10 min |
| **API Usage** | API_INTEGRATION_GUIDE.md | 15 min |
| **Testing** | API_TESTING_GUIDE.md | 10 min |
| **MongoDB** | MONGODB_COMPASS_INSTRUCTIONS.md | 10 min |
| **Overview** | README.md | 10 min |

---

## ⚡ Power Commands

### Reset Everything
```bash
# Stop all
pkill -f "node.*server.js"
pkill -f "vite"

# Restart MongoDB
brew services restart mongodb-community

# Start fresh
cd backend && npm start &
npm run dev
```

### Clean Install
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd ..
rm -rf node_modules package-lock.json
npm install
```

### Export All Data
```bash
# In MongoDB Compass
# Select collection → Export Collection → CSV
```

---

## 🔧 Environment Variables

```env
# Backend
NODE_ENV=development
PORT=5002
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

---

## 📊 Response Formats

### Success (Single)
```json
{
  "success": true,
  "data": { "id": "...", "name": "..." }
}
```

### Success (List)
```json
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "total": 10 }
}
```

### Success (Auth)
```json
{
  "success": true,
  "data": { "id": "...", "name": "..." },
  "token": "eyJhbG..."
}
```

### Error
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🎯 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## ⚙️ Audit Types

| Type | Fields | Use Case |
|------|--------|----------|
| **store** | 150+ | Store audits |
| **ilms** | 60+ | ILMS audits |
| **xfe** | 40+ | XFE audits |

---

## 🔄 Status Workflow

```
unassigned → open → in-progress → completed
            ↓
         at-risk
```

---

## 💡 Pro Tips

1. **Keep Compass Open** - Watch data changes live
2. **Use .env.example** - Template for team members
3. **Check Health First** - Before debugging
4. **Save Tokens** - Use environment variables
5. **Test in Postman** - Import collection from `/backend`

---

## 🚨 Emergency Commands

### Backend Stuck
```bash
pkill -f "node.*server.js"
cd backend && npm start
```

### MongoDB Issues
```bash
brew services restart mongodb-community
```

### Port in Use
```bash
lsof -i :5002
kill -9 <PID>
```

### Clear Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Daily Checklist

- [ ] MongoDB running
- [ ] Backend started (port 5002)
- [ ] Frontend started (port 3000)
- [ ] Compass connected
- [ ] No console errors
- [ ] Health check passes

---

## 📞 Support

**Issue?** Check:
1. STARTUP_CHECKLIST.md → Troubleshooting
2. MongoDB connection in Compass
3. Backend console for errors
4. Browser console for errors

---

**🚀 Quick Reference Complete!**

**Bookmark this page for daily use!** 📌

---

**Version:** 1.0.0 | **Updated:** Nov 28, 2024 | **Status:** ✅ Ready
