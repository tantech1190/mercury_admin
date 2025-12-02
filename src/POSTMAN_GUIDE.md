# 📮 Postman Collection Guide

## 🎯 **Complete API Testing with Postman**

This guide will help you import and use the Mercury Mystery Admin API collection in Postman.

---

## 📦 **Import Collection**

### **Method 1: Direct Import**

1. Open **Postman**
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose: `Mercury_Mystery_Admin_Postman_Collection.json`
5. Click **Import**

### **Method 2: Drag & Drop**

1. Open **Postman**
2. Drag the `Mercury_Mystery_Admin_Postman_Collection.json` file
3. Drop it into Postman window
4. Collection will be imported automatically

---

## ⚙️ **Configure Variables**

### **Collection Variables (Already Set)**

The collection comes with pre-configured variables:

```
baseUrl = http://localhost:5000/api
token = (empty - will be auto-filled after login)
```

### **Change Base URL (if needed)**

If your backend runs on a different URL:

1. Right-click collection → **Edit**
2. Go to **Variables** tab
3. Update `baseUrl` value
4. Click **Update**

Example for production:
```
baseUrl = https://api.mercurymystery.com/api
```

---

## 🚀 **Quick Start - Test the API**

### **Step 1: Health Check**

**Purpose:** Verify API is running

1. Expand collection → **🏥 Health Check**
2. Click **Health Check**
3. Click **Send**

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

✅ **Status:** 200 OK

---

### **Step 2: Register Admin User**

**Purpose:** Create your first admin account

1. Expand **🔐 Authentication**
2. Click **Register User**
3. Click **Send**

**Request Body (already filled):**
```json
{
  "name": "Admin User",
  "email": "admin@mercury.com",
  "password": "admin123",
  "role": "admin"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@mercury.com",
    "role": "admin"
  }
}
```

✅ **Token automatically saved to collection variable!**

---

### **Step 3: Login**

**Purpose:** Get authentication token

1. Click **Login**
2. Click **Send**

**Request Body:**
```json
{
  "email": "admin@mercury.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

✅ **Token automatically saved!**

**Note:** After successful login, the token is automatically stored in the `{{token}}` variable and will be used for all subsequent requests.

---

### **Step 4: Get Current User**

**Purpose:** Verify authentication works

1. Click **Get Current User**
2. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@mercury.com",
    "role": "admin"
  }
}
```

✅ **You're authenticated!**

---

## 📋 **Collection Structure**

The collection is organized into **6 folders**:

### **🏥 Health Check (1 endpoint)**
```
✅ Health Check - Verify API status
```

### **🔐 Authentication (6 endpoints)**
```
✅ Register User - Create new admin
✅ Login - Get JWT token (auto-saves token)
✅ Get Current User - Get logged in user details
✅ Update User Details - Update name/email
✅ Change Password - Change user password
✅ Logout - Logout current user
```

### **👥 Auditors (7 endpoints)**
```
✅ Get All Auditors - List all auditors (with filters)
✅ Get Auditor Statistics - Get metrics
✅ Get Single Auditor - Get by ID
✅ Create Auditor - Create new auditor
✅ Update Auditor - Update auditor details
✅ Delete Auditor - Delete auditor
✅ Update Auditor Metrics - Recalculate performance
```

### **📋 Audits (12 endpoints)**
```
✅ Get All Audits - List all audits (with filters)
✅ Get Audit Statistics - Get metrics
✅ Get Audit Analytics - Comprehensive analytics
✅ Get Single Audit - Get by ID
✅ Create Audit - Create new audit
✅ Update Audit - Update audit details
✅ Assign Audit to Auditor - Assign to auditor
✅ Update Audit Status - Change status
✅ Calculate Audit Score - Auto-calculate score
✅ Delete Audit - Delete single audit
✅ Bulk Delete Audits - Delete multiple audits
```

### **📤 Upload (4 endpoints)**
```
✅ Upload Excel File - Upload and parse Excel
✅ Download Store Template - Get Store template
✅ Download ILMS Template - Get ILMS template
✅ Download XFE Template - Get XFE template
```

### **📊 Reports (9 endpoints)**
```
✅ Get Overview - Overview statistics
✅ Get Auditor Performance - Auditor metrics
✅ Get Circle Performance - Circle metrics
✅ Get Score Analytics - Score analysis
✅ Get Audit Type Breakdown - Type analysis
✅ Get Trending Data - Time-based trends
✅ Export Audits (CSV) - Export as CSV
✅ Export Audits (Excel) - Export as Excel
✅ Export Auditors (CSV) - Export auditors
```

**Total: 39 endpoints**

---

## 🎯 **Common Workflows**

### **Workflow 1: Create and Assign Audit**

**Step 1: Create Auditor**
```
1. Open "👥 Auditors" → "Create Auditor"
2. Click Send
3. Copy auditor ID from response
```

**Step 2: Create Audit**
```
1. Open "📋 Audits" → "Create Audit"
2. Click Send
3. Copy audit ID from response
```

**Step 3: Assign Audit**
```
1. Open "📋 Audits" → "Assign Audit to Auditor"
2. Replace :id with audit ID
3. Update auditorId in body with auditor ID
4. Click Send
```

**Step 4: Update Status**
```
1. Open "📋 Audits" → "Update Audit Status"
2. Replace :id with audit ID
3. Change status to "in-progress" or "completed"
4. Click Send
```

---

### **Workflow 2: Upload Excel and Get Reports**

**Step 1: Upload Excel**
```
1. Open "📤 Upload" → "Upload Excel File"
2. In Body → form-data
3. Click "Select Files" and choose your Excel file
4. Click Send
```

**Step 2: Get Overview**
```
1. Open "📊 Reports" → "Get Overview"
2. Click Send
3. View statistics
```

**Step 3: Get Auditor Performance**
```
1. Open "📊 Reports" → "Get Auditor Performance"
2. Click Send
3. View auditor rankings
```

**Step 4: Export Report**
```
1. Open "📊 Reports" → "Export Audits (Excel)"
2. Click Send
3. Save the downloaded file
```

---

### **Workflow 3: Filter and Search**

**Get Audits by Circle:**
```
1. Open "📋 Audits" → "Get All Audits"
2. In Params tab, enable "circle" parameter
3. Set value to "Mum" (or any circle)
4. Click Send
```

**Get Audits by Type:**
```
1. Enable "auditType" parameter
2. Set value to "store", "ilms", or "xfe"
3. Click Send
```

**Get Completed Audits:**
```
1. Enable "status" parameter
2. Set value to "completed"
3. Click Send
```

**Search Audits:**
```
1. Enable "search" parameter
2. Set value to store name or code
3. Click Send
```

---

## 🔐 **Authentication**

### **How Token Works**

1. **Login** or **Register** → Token automatically saved to `{{token}}` variable
2. All subsequent requests use `Bearer {{token}}` in Authorization header
3. Token is valid until you logout or it expires

### **Manual Token Management**

If you need to set token manually:

1. Right-click collection → **Edit**
2. Go to **Variables** tab
3. Set `token` current value
4. Click **Update**

### **Check if Authenticated**

1. Open **Get Current User**
2. Click **Send**
3. If you get user data → Authenticated ✅
4. If you get 401 → Not authenticated ❌ (Login again)

---

## 🎨 **Tips & Tricks**

### **1. Use Variables for IDs**

Instead of copying IDs manually:

**Create Environment Variable:**
```
1. Create new environment
2. Add variable: auditorId, auditId
3. Save IDs after creating resources
4. Use {{auditorId}} in requests
```

### **2. Test Scripts**

The collection includes automatic test scripts:

- ✅ **Login** - Auto-saves token
- ✅ **Register** - Auto-saves token
- ✅ **All requests** - Log success/error messages

**View Console:**
1. Click "Console" at bottom
2. See request/response logs
3. View auto-save messages

### **3. Quick Navigation**

**Keyboard Shortcuts:**
- `Ctrl/Cmd + K` - Search requests
- `Ctrl/Cmd + Enter` - Send request
- `Ctrl/Cmd + S` - Save request

### **4. Duplicate Requests**

To test variations:
1. Right-click request → **Duplicate**
2. Rename (e.g., "Create Audit - Mumbai")
3. Modify parameters
4. Save

### **5. Organize with Folders**

Create sub-folders for testing:
```
📋 Audits
  ├── Testing
  │   ├── Create Audit - Test 1
  │   ├── Create Audit - Test 2
  └── Production
      ├── Create Audit - Prod
```

---

## 🐛 **Troubleshooting**

### **Issue: "Could not send request"**

**Cause:** Backend not running

**Solution:**
```bash
cd backend
npm run dev
```

Verify at: http://localhost:5000/api/health

---

### **Issue: "401 Unauthorized"**

**Cause:** Not logged in or token expired

**Solution:**
1. Open **Login** request
2. Click **Send**
3. Token will be auto-saved
4. Retry your request

---

### **Issue: "404 Not Found"**

**Cause:** Wrong URL or endpoint doesn't exist

**Solution:**
- Check `baseUrl` variable is correct
- Verify endpoint path
- Check backend logs

---

### **Issue: "500 Internal Server Error"**

**Cause:** Backend error

**Solution:**
1. Check backend console for errors
2. Verify MongoDB is running
3. Check request body format
4. Verify all required fields

---

### **Issue: "Token not saving automatically"**

**Cause:** Test script not running

**Solution:**
1. Open **Login** request
2. Go to **Tests** tab
3. Verify script exists
4. Click **Send** again
5. Check Console for "✅ Token saved" message

---

### **Issue: "Cannot upload Excel file"**

**Cause:** Wrong file type or size too large

**Solution:**
- Use .xlsx or .xls files only
- Maximum file size: 10MB
- Verify "file" field name in form-data
- Check file is not corrupted

---

## 📊 **Response Codes**

### **Success Codes**
```
200 OK - Request successful
201 Created - Resource created successfully
```

### **Client Error Codes**
```
400 Bad Request - Invalid request data
401 Unauthorized - Not authenticated or invalid token
403 Forbidden - Not authorized for this action
404 Not Found - Resource not found
422 Unprocessable Entity - Validation error
```

### **Server Error Codes**
```
500 Internal Server Error - Server error
503 Service Unavailable - Service temporarily unavailable
```

---

## 🎯 **Best Practices**

### **1. Use Environments**

Create separate environments:
```
Development:
  baseUrl = http://localhost:5000/api

Production:
  baseUrl = https://api.mercurymystery.com/api
```

### **2. Save Example Responses**

After successful request:
1. Click **Save Response**
2. Click **Save as Example**
3. Use for reference later

### **3. Add Descriptions**

Document your requests:
1. Click request
2. Click **Description** tab
3. Add notes about what it does
4. Save

### **4. Use Pre-request Scripts**

For dynamic data:
```javascript
// Generate random email
pm.variables.set("randomEmail", `test${Date.now()}@mercury.com`);
```

### **5. Chain Requests**

Use **Runner** to execute multiple requests:
1. Click **Runner** button
2. Select collection or folder
3. Click **Run**
4. View results

---

## 📚 **Example Request Bodies**

### **Create Auditor**
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@mercury.com",
  "phone": "+919876543210",
  "circles": ["Mum", "DEL", "Guj"],
  "status": "active"
}
```

### **Create Store Audit**
```json
{
  "storeCode": "MUM001",
  "storeName": "Mumbai Downtown Store",
  "location": "Andheri, Mumbai",
  "circle": "Mum",
  "auditType": "store",
  "deadline": "2024-12-31T23:59:59.999Z",
  "status": "unassigned",
  "pincode": "400058",
  "rawData": {
    "Were you greeted?": "Yes",
    "Was store clean?": "Yes",
    "Was CRO polite?": "Yes"
  }
}
```

### **Create ILMS Audit**
```json
{
  "storeCode": "DEL001",
  "storeName": "Delhi Store",
  "location": "Connaught Place",
  "circle": "DEL",
  "auditType": "ilms",
  "deadline": "2024-12-31T23:59:59.999Z",
  "webInquiryDate": "2024-01-15",
  "advisorName": "John Doe",
  "advisorContact": "+919876543210"
}
```

### **Create XFE Audit**
```json
{
  "storeCode": "GUJ001",
  "storeName": "Gujarat Store",
  "location": "Ahmedabad",
  "circle": "Guj",
  "auditType": "xfe",
  "deadline": "2024-12-31T23:59:59.999Z",
  "callDate": "2024-01-15",
  "xfeName": "Jane Smith",
  "xfeNumber": "+919876543210"
}
```

---

## 🎉 **You're Ready!**

### **Quick Reference:**

1. **Import collection** → `Mercury_Mystery_Admin_Postman_Collection.json`
2. **Health check** → Verify API is running
3. **Register/Login** → Get authenticated (auto-saves token)
4. **Start testing** → All endpoints are ready to use!

---

## 📖 **Additional Resources**

- **API Documentation:** `/API_INTEGRATION_GUIDE.md`
- **Quick Start:** `/QUICK_START.md`
- **Backend Setup:** `/backend/SETUP_GUIDE.md`
- **Backend README:** `/backend/README.md`

---

**Happy Testing! 🚀**

**All 39 endpoints are ready to use in Postman!** 🎯
