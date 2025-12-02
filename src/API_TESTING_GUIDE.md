# 🧪 API Testing Guide - Mercury Mystery Admin

Complete guide to test all API endpoints using cURL, Postman, or browser.

---

## 📋 Prerequisites

1. ✅ Backend server running on `http://localhost:5002`
2. ✅ MongoDB running on `localhost:27017`
3. ✅ MongoDB Compass connected (optional, for verification)

---

## 🔐 Authentication Flow

### 1. Health Check (No Auth Required)

**cURL:**
```bash
curl http://localhost:5002/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Mercury Mystery Admin API is running",
  "timestamp": "2024-11-28T10:00:00.000Z",
  "environment": "development",
  "database": "Connected"
}
```

**✅ Verify in Compass:** Database connection is live

---

### 2. Sign Up (Create Admin Account)

**cURL:**
```bash
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "Admin@123456",
    "role": "admin"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "65abc123def456789012345",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**✅ Verify in Compass:**
1. Refresh database list
2. Expand `mercury_mystery_admin`
3. Click `users` collection
4. See your user document with hashed password

**📝 Save the token for next requests!**

---

### 3. Login (Get Token)

**cURL:**
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "65abc123def456789012345",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "lastLogin": "2024-11-28T10:05:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**📝 Copy the token - you'll need it for all protected routes!**

---

## 🔑 Set Your Token

For all subsequent requests, you'll need to include the token in the Authorization header.

**Set as environment variable (easier):**
```bash
# Mac/Linux
export TOKEN="your_token_here"

# Windows (PowerShell)
$env:TOKEN="your_token_here"

# Windows (CMD)
set TOKEN=your_token_here
```

**Or include in each request:**
```bash
-H "Authorization: Bearer your_token_here"
```

---

## 👥 Auditor Endpoints

### 4. Create Auditor

**cURL:**
```bash
curl -X POST http://localhost:5002/api/auditors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "circles": ["DEL", "Mum", "BLR"],
    "status": "active"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Auditor created successfully",
  "data": {
    "_id": "65abc456def789012345678",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "circles": ["DEL", "Mum", "BLR"],
    "status": "active",
    "performanceMetrics": {
      "totalAuditsAssigned": 0,
      "totalAuditsCompleted": 0,
      "averageScore": 0,
      "completionRate": 0
    },
    "createdAt": "2024-11-28T10:10:00.000Z",
    "updatedAt": "2024-11-28T10:10:00.000Z"
  }
}
```

**✅ Verify in Compass:**
1. Click `auditors` collection
2. See new auditor document
3. Note the `_id` field

**📝 Save the auditor ID for later!**

---

### 5. Get All Auditors

**cURL:**
```bash
curl -X GET http://localhost:5002/api/auditors \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65abc456def789012345678",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "circles": ["DEL", "Mum", "BLR"],
      "status": "active",
      "performanceMetrics": {
        "totalAuditsAssigned": 0,
        "totalAuditsCompleted": 0,
        "averageScore": 0,
        "completionRate": 0
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 1,
    "pages": 1
  }
}
```

**✅ Verify:** List matches what you see in Compass

---

### 6. Get Single Auditor

**cURL:**
```bash
curl -X GET http://localhost:5002/api/auditors/65abc456def789012345678 \
  -H "Authorization: Bearer $TOKEN"
```

**Replace `65abc456def789012345678` with your actual auditor ID**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65abc456def789012345678",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "circles": ["DEL", "Mum", "BLR"],
    "status": "active",
    "performanceMetrics": {
      "totalAuditsAssigned": 0,
      "totalAuditsCompleted": 0,
      "averageScore": 0,
      "completionRate": 0
    }
  },
  "recentAudits": []
}
```

---

### 7. Update Auditor

**cURL:**
```bash
curl -X PUT http://localhost:5002/api/auditors/65abc456def789012345678 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "John Doe Updated",
    "phone": "9999999999",
    "circles": ["DEL", "Mum", "BLR", "CHN"]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Auditor updated successfully",
  "data": {
    "_id": "65abc456def789012345678",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "phone": "9999999999",
    "circles": ["DEL", "Mum", "BLR", "CHN"],
    "status": "active"
  }
}
```

**✅ Verify in Compass:**
1. Click on the auditor document
2. See updated fields
3. Check `updatedAt` timestamp changed

---

### 8. Get Auditor Statistics

**cURL:**
```bash
curl -X GET http://localhost:5002/api/auditors/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "overview": [
      {
        "_id": null,
        "totalAuditors": 1,
        "activeAuditors": 1,
        "avgScore": 0,
        "totalAuditsAssigned": 0,
        "totalAuditsCompleted": 0
      }
    ],
    "byCircle": [
      { "_id": "DEL", "count": 1, "avgScore": 0 },
      { "_id": "Mum", "count": 1, "avgScore": 0 },
      { "_id": "BLR", "count": 1, "avgScore": 0 },
      { "_id": "CHN", "count": 1, "avgScore": 0 }
    ],
    "topPerformers": []
  }
}
```

---

## 📋 Audit Endpoints

### 9. Create Audit

**cURL:**
```bash
curl -X POST http://localhost:5002/api/audits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "storeCode": "DEL001",
    "storeName": "Delhi Store 1",
    "location": "Delhi",
    "auditType": "store",
    "circle": "DEL",
    "deadline": "2024-12-31",
    "status": "unassigned",
    "rawData": {
      "customerService": 8,
      "storeAmbience": 7,
      "productDisplay": 9
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Audit created successfully",
  "data": {
    "_id": "65abc789def012345678901",
    "storeCode": "DEL001",
    "storeName": "Delhi Store 1",
    "location": "Delhi",
    "auditType": "store",
    "circle": "DEL",
    "deadline": "2024-12-31T00:00:00.000Z",
    "status": "unassigned",
    "score": 80,
    "rawData": {
      "customerService": 8,
      "storeAmbience": 7,
      "productDisplay": 9
    },
    "createdAt": "2024-11-28T10:20:00.000Z"
  }
}
```

**✅ Verify in Compass:**
1. Click `audits` collection
2. See new audit document
3. Note the auto-calculated score

**📝 Save the audit ID!**

---

### 10. Get All Audits

**cURL:**
```bash
curl -X GET http://localhost:5002/api/audits \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65abc789def012345678901",
      "storeCode": "DEL001",
      "storeName": "Delhi Store 1",
      "location": "Delhi",
      "auditType": "store",
      "circle": "DEL",
      "deadline": "2024-12-31T00:00:00.000Z",
      "status": "unassigned",
      "score": 80
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1,
    "pages": 1
  }
}
```

---

### 11. Assign Audit to Auditor

**cURL:**
```bash
curl -X PATCH http://localhost:5002/api/audits/65abc789def012345678901/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "auditorId": "65abc456def789012345678"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Audit assigned successfully",
  "data": {
    "_id": "65abc789def012345678901",
    "storeCode": "DEL001",
    "storeName": "Delhi Store 1",
    "auditorId": "65abc456def789012345678",
    "auditorName": "John Doe Updated",
    "auditorEmail": "john@example.com",
    "status": "open"
  }
}
```

**✅ Verify in Compass:**
1. Click on audit document
2. See `auditorId`, `auditorName`, `auditorEmail` fields populated
3. Status changed to "open"
4. Go to `auditors` collection
5. See `totalAuditsAssigned` increased

---

### 12. Update Audit Status

**cURL:**
```bash
curl -X PATCH http://localhost:5002/api/audits/65abc789def012345678901/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "completed"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {
    "_id": "65abc789def012345678901",
    "storeCode": "DEL001",
    "storeName": "Delhi Store 1",
    "status": "completed",
    "completedAt": "2024-11-28T10:25:00.000Z"
  }
}
```

**✅ Verify in Compass:**
1. Audit status = "completed"
2. `completedAt` timestamp added
3. Auditor's `totalAuditsCompleted` increased

---

## 📊 Report Endpoints

### 13. Get Overview Statistics

**cURL:**
```bash
curl -X GET http://localhost:5002/api/reports/overview \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totals": [
      {
        "_id": null,
        "totalAudits": 1,
        "completed": 1,
        "inProgress": 0,
        "open": 0,
        "unassigned": 0,
        "atRisk": 0,
        "avgScore": 80
      }
    ],
    "byType": [
      { "_id": "store", "count": 1 }
    ],
    "byCircle": [
      { "_id": "DEL", "count": 1 }
    ],
    "auditors": {
      "totalAuditors": 1,
      "activeAuditors": 1
    }
  }
}
```

---

### 14. Get Auditor Performance

**cURL:**
```bash
curl -X GET http://localhost:5002/api/reports/auditor-performance \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "65abc456def789012345678",
      "name": "John Doe Updated",
      "email": "john@example.com",
      "circles": ["DEL", "Mum", "BLR", "CHN"],
      "totalAssigned": 1,
      "completed": 1,
      "inProgress": 0,
      "open": 0,
      "completionRate": 100,
      "averageScore": 80
    }
  ]
}
```

---

### 15. Get Circle Performance

**cURL:**
```bash
curl -X GET http://localhost:5002/api/reports/circle-performance \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "circle": "DEL",
      "total": 1,
      "completed": 1,
      "completionRate": 100,
      "avgScore": 80,
      "breakdown": {
        "store": 1,
        "ilms": 0,
        "xfe": 0
      }
    }
  ]
}
```

---

## 🗑️ Delete Operations

### 16. Delete Audit

**cURL:**
```bash
curl -X DELETE http://localhost:5002/api/audits/65abc789def012345678901 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Audit deleted successfully"
}
```

**✅ Verify in Compass:**
1. Audit document removed from `audits` collection
2. Auditor metrics updated

---

### 17. Delete Auditor

**Note:** Can only delete if no pending audits assigned

**cURL:**
```bash
curl -X DELETE http://localhost:5002/api/auditors/65abc456def789012345678 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Auditor deleted successfully"
}
```

**✅ Verify in Compass:**
- Auditor document removed from `auditors` collection

---

## 📤 File Upload (Excel)

### 18. Upload Excel File

**Note:** Requires multipart/form-data

**Using Postman:**
1. Method: POST
2. URL: `http://localhost:5002/api/upload/excel`
3. Headers: `Authorization: Bearer YOUR_TOKEN`
4. Body: form-data
   - Key: `file`
   - Type: File
   - Value: Select your Excel file

**Expected Response:**
```json
{
  "success": true,
  "message": "5 audit(s) uploaded successfully",
  "data": {
    "auditType": "store",
    "totalRows": 5,
    "successfulRows": 5,
    "failedRows": 0,
    "audits": [...],
    "fileInfo": {
      "filename": "upload_12345.xlsx",
      "originalName": "store_audits.xlsx",
      "size": 12345
    }
  }
}
```

**✅ Verify in Compass:**
1. Multiple new audit documents in `audits` collection
2. Each has `uploadedFile` object with file info

---

## 🎯 Quick Test Script

Save this as `test_api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5002/api"

echo "🧪 Testing Mercury Mystery Admin API"
echo "===================================="

# Health Check
echo "\n1️⃣ Health Check..."
curl -s $BASE_URL/health | jq .

# Sign Up
echo "\n2️⃣ Creating Admin User..."
SIGNUP_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Admin","email":"test@example.com","password":"Test@123456","role":"admin"}')
echo $SIGNUP_RESPONSE | jq .

# Extract token
TOKEN=$(echo $SIGNUP_RESPONSE | jq -r .token)
echo "Token: $TOKEN"

# Create Auditor
echo "\n3️⃣ Creating Auditor..."
AUDITOR_RESPONSE=$(curl -s -X POST $BASE_URL/auditors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test Auditor","email":"auditor@example.com","phone":"1234567890","circles":["DEL"]}')
echo $AUDITOR_RESPONSE | jq .

# Get All Auditors
echo "\n4️⃣ Getting All Auditors..."
curl -s -X GET $BASE_URL/auditors \
  -H "Authorization: Bearer $TOKEN" | jq .

echo "\n✅ API Test Complete!"
```

**Run:**
```bash
chmod +x test_api.sh
./test_api.sh
```

---

## 🎉 Success Indicators

After running all tests, you should see in MongoDB Compass:

### Users Collection
```json
{
  "_id": "...",
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$...",
  "role": "admin",
  "isActive": true
}
```

### Auditors Collection
```json
{
  "_id": "...",
  "name": "John Doe Updated",
  "email": "john@example.com",
  "phone": "9999999999",
  "circles": ["DEL", "Mum", "BLR", "CHN"],
  "status": "active",
  "performanceMetrics": {
    "totalAuditsAssigned": 1,
    "totalAuditsCompleted": 1,
    "averageScore": 80,
    "completionRate": 100
  }
}
```

### Audits Collection
```json
{
  "_id": "...",
  "storeCode": "DEL001",
  "storeName": "Delhi Store 1",
  "auditType": "store",
  "circle": "DEL",
  "status": "completed",
  "score": 80,
  "auditorId": "...",
  "auditorName": "John Doe Updated",
  "completedAt": "2024-11-28T..."
}
```

---

## 📚 Additional Resources

- **Postman Collection:** `/backend/Mercury_Mystery_Admin_API_Collection.json`
- **Backend README:** `/backend/README.md`
- **API Integration Guide:** `/API_INTEGRATION_GUIDE.md`

---

**Happy Testing! 🚀**
