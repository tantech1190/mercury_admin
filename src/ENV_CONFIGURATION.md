# ⚙️ Environment Configuration Guide

## 🎯 **Important: .env File Location**

**Note:** In Figma Make, `.env` files might not persist. Instead, use one of these methods:

---

## ✅ **Method 1: Use .env.local (Recommended)**

I've created `.env.local` for you in the root directory!

**File:** `/.env.local`

```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Mercury Mystery Admin
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_EXPORT=true

# UI Configuration
VITE_DEFAULT_PAGE_SIZE=10
VITE_MAX_UPLOAD_SIZE_MB=10

# Development Settings
VITE_DEBUG_MODE=false
VITE_SHOW_CONSOLE_LOGS=false
```

**Vite automatically loads `.env.local` files!** ✅

---

## ✅ **Method 2: Hardcode in api.ts**

If `.env` files don't work, you can hardcode the API URL directly in `/services/api.ts`:

**Current code:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

**Hardcoded version:**
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## ✅ **Method 3: Create .env Manually**

If you're running this locally (not in Figma Make):

### **Step 1: Create .env file**
```bash
# In project root directory
touch .env
```

### **Step 2: Add content**
```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Mercury Mystery Admin
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_EXPORT=true

# UI Configuration
VITE_DEFAULT_PAGE_SIZE=10
VITE_MAX_UPLOAD_SIZE_MB=10
```

### **Step 3: Restart dev server**
```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

---

## 🔧 **Vite Environment File Priority**

Vite loads environment files in this order (highest priority first):

1. `.env.local` ⭐ **Best for local development**
2. `.env.development.local`
3. `.env.development`
4. `.env`

**I've created `.env.local` for you!** This works in most cases.

---

## 📝 **Environment Variables Needed**

### **Frontend (Root Directory)**

**Required:**
```bash
VITE_API_URL=http://localhost:5000/api
```

**Optional:**
```bash
VITE_APP_NAME=Mercury Mystery Admin
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_EXPORT=true
VITE_DEFAULT_PAGE_SIZE=10
VITE_MAX_UPLOAD_SIZE_MB=10
VITE_DEBUG_MODE=false
VITE_SHOW_CONSOLE_LOGS=false
```

---

### **Backend (/backend/.env)**

**Required:**
```bash
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

**Optional:**
```bash
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

---

## 🎯 **Quick Setup**

### **For Figma Make:**

**Option A: Use .env.local (Already Created!)**
```
✅ File created: /.env.local
✅ Contains: VITE_API_URL=http://localhost:5000/api
✅ Vite will auto-load it
```

**Option B: Hardcode in api.ts**
```typescript
// In /services/api.ts
const API_BASE_URL = 'http://localhost:5000/api'; // Hardcoded
```

---

### **For Local Development:**

**Step 1: Create .env**
```bash
# In project root
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Mercury Mystery Admin
VITE_APP_VERSION=1.0.0
EOF
```

**Step 2: Create backend .env**
```bash
# In backend directory
cd backend
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/mercury_mystery_admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
CORS_ORIGIN=http://localhost:3000
EOF
```

**Step 3: Restart servers**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev
```

---

## ✅ **Verify Configuration**

### **Check if environment variables are loaded:**

**Frontend (Browser Console):**
```javascript
console.log(import.meta.env.VITE_API_URL);
// Expected: http://localhost:5000/api
```

**Backend (Server Console):**
```javascript
console.log(process.env.PORT);
// Expected: 5000
```

---

## 🔍 **Troubleshooting**

### **Issue: Environment variables not loading**

**Solution:**
1. Use `.env.local` instead of `.env`
2. Restart dev server
3. Clear browser cache
4. Check variable names start with `VITE_`

---

### **Issue: API calls fail with network error**

**Solution:**
1. Check `VITE_API_URL` is set correctly
2. Verify backend is running on port 5000
3. Check browser console for API URL being used

---

### **Issue: CORS errors**

**Solution:**
1. Check backend `.env` has `CORS_ORIGIN=http://localhost:3000`
2. Restart backend server
3. Verify frontend is running on port 3000

---

## 📂 **File Locations**

```
mercury-mystery-admin/
│
├── .env.local              ← CREATED FOR YOU! ✅
├── .env                    ← Create manually if needed
├── .env.example            ← Template
│
├── services/
│   └── api.ts              ← Uses VITE_API_URL
│
└── backend/
    ├── .env                ← Backend config
    └── server.js           ← Uses backend .env
```

---

## 🎉 **Summary**

**✅ Solution:** I've created `.env.local` for you!

**File:** `/.env.local`
**Content:** Contains all necessary frontend environment variables
**Status:** Ready to use! Vite will automatically load it.

**If you still have issues:**
1. Try hardcoding the API URL in `/services/api.ts`
2. Or manually create `.env` file in your local environment

---

## 📚 **Additional Resources**

- **Vite Env Docs:** https://vitejs.dev/guide/env-and-mode.html
- **Service Layer:** `/services/api.ts`
- **API Integration:** `/API_INTEGRATION_GUIDE.md`

---

**🚀 You're ready to go! The .env.local file is created and configured!**
