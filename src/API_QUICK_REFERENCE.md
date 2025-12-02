# 📌 API Quick Reference Card

## 🚀 **Quick Start**

### **1. Start Backend**
```bash
cd backend && npm run dev
```

### **2. Start Frontend**
```bash
npm run dev
```

### **3. Import Services**
```typescript
import { 
  authService,
  auditorService,
  auditService,
  uploadService,
  reportService 
} from './services';
```

---

## 🔐 **Authentication**

### **Login**
```typescript
await authService.login({
  email: 'admin@mercury.com',
  password: 'admin123'
});
```

### **Register**
```typescript
await authService.register({
  name: 'Admin User',
  email: 'admin@mercury.com',
  password: 'admin123',
  role: 'admin'
});
```

### **Get Current User**
```typescript
const user = await authService.getMe();
```

### **Logout**
```typescript
await authService.logout();
```

---

## 👥 **Auditors**

### **Get All**
```typescript
const auditors = await auditorService.getAllAuditors();
```

### **Create**
```typescript
const auditor = await auditorService.createAuditor({
  name: 'Rajesh Kumar',
  email: 'rajesh@mercury.com',
  phone: '+919876543210',
  circles: ['Mum', 'DEL', 'Guj'],
  status: 'active'
});
```

### **Update**
```typescript
await auditorService.updateAuditor(id, {
  circles: ['Mum', 'DEL', 'Guj', 'HR']
});
```

### **Delete**
```typescript
await auditorService.deleteAuditor(id);
```

---

## 📋 **Audits**

### **Get All (with filters)**
```typescript
const { audits } = await auditService.getAllAudits({
  circle: 'Mum',
  status: 'completed',
  auditType: 'store',
  page: 1,
  limit: 10
});
```

### **Create**
```typescript
const audit = await auditService.createAudit({
  storeCode: 'MUM001',
  storeName: 'Mumbai Store',
  location: 'Andheri',
  circle: 'Mum',
  auditType: 'store',
  deadline: new Date('2024-12-31')
});
```

### **Assign to Auditor**
```typescript
await auditService.assignAudit(auditId, auditorId);
```

### **Update Status**
```typescript
await auditService.updateStatus(auditId, 'completed');
```

### **Calculate Score**
```typescript
await auditService.calculateScore(auditId);
```

### **Delete**
```typescript
await auditService.deleteAudit(id);
```

### **Bulk Delete**
```typescript
await auditService.bulkDeleteAudits([id1, id2, id3]);
```

---

## 📤 **Upload**

### **Upload Excel**
```typescript
const result = await uploadService.uploadExcel(file, (progress) => {
  console.log(`Upload: ${progress}%`);
});
```

### **Download Template**
```typescript
const blob = await uploadService.downloadTemplate('store');
uploadService.triggerDownload(blob, 'store_template.xlsx');
```

---

## 📊 **Reports**

### **Get Overview**
```typescript
const stats = await reportService.getOverview();
```

### **Auditor Performance**
```typescript
const performance = await reportService.getAuditorPerformance();
```

### **Circle Performance**
```typescript
const circles = await reportService.getCirclePerformance();
```

### **Score Analytics**
```typescript
const analytics = await reportService.getScoreAnalytics();
```

### **Export Report**
```typescript
const blob = await reportService.exportReport({
  format: 'excel',
  type: 'audits'
});
reportService.triggerDownload(blob, 'report.xlsx');
```

---

## 🎨 **Error Handling**

### **Try-Catch Pattern**
```typescript
try {
  const audits = await auditService.getAllAudits();
  setAudits(audits);
} catch (error) {
  console.error('Failed:', error.message);
  setError(error.message);
}
```

### **With Loading State**
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

async function loadData() {
  setLoading(true);
  setError(null);
  try {
    const data = await auditService.getAllAudits();
    setData(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

---

## 🔑 **API Endpoints**

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication**
```
POST   /auth/register
POST   /auth/login
GET    /auth/me
PUT    /auth/update
PUT    /auth/change-password
POST   /auth/logout
```

### **Auditors**
```
GET    /auditors
GET    /auditors/stats
GET    /auditors/:id
POST   /auditors
PUT    /auditors/:id
DELETE /auditors/:id
POST   /auditors/:id/update-metrics
```

### **Audits**
```
GET    /audits
GET    /audits/stats
GET    /audits/analytics
GET    /audits/:id
POST   /audits
PUT    /audits/:id
PATCH  /audits/:id/assign
PATCH  /audits/:id/status
PATCH  /audits/:id/calculate-score
DELETE /audits/:id
DELETE /audits (bulk)
```

### **Upload**
```
POST   /upload/excel
GET    /upload/template/:type
```

### **Reports**
```
GET    /reports/overview
GET    /reports/auditor-performance
GET    /reports/circle-performance
GET    /reports/score-analytics
GET    /reports/audit-type-breakdown
GET    /reports/trending
GET    /reports/export
```

---

## 📋 **Environment Variables**

### **Frontend (.env)**
```bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Mercury Mystery Admin
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_EXPORT=true
VITE_DEFAULT_PAGE_SIZE=10
VITE_MAX_UPLOAD_SIZE_MB=10
```

---

## 🎯 **Common Filters**

### **Audit Filters**
```typescript
{
  auditType: 'store' | 'ilms' | 'xfe',
  circle: 'Mum' | 'DEL' | 'Guj' | ...,
  status: 'unassigned' | 'open' | 'in-progress' | 'at-risk' | 'completed',
  auditorId: 'string',
  search: 'string',
  page: number,
  limit: number,
  sortBy: 'deadline' | 'createdAt' | 'score' | ...,
  sortOrder: 'asc' | 'desc'
}
```

---

## 🐛 **Troubleshooting**

| Issue | Solution |
|-------|----------|
| Network Error | Check backend is running |
| 401 Unauthorized | Run login first |
| 404 Not Found | Check endpoint URL |
| 500 Server Error | Check backend logs |
| CORS Error | Check CORS_ORIGIN in backend |

---

## 📚 **Documentation**

- **Detailed Guide:** `/API_INTEGRATION_GUIDE.md`
- **Postman:** `/POSTMAN_GUIDE.md`
- **Setup:** `/QUICK_START.md`
- **Summary:** `/API_INTEGRATION_COMPLETE.md`

---

## 🎊 **Quick Commands**

### **Test Backend**
```bash
curl http://localhost:5000/api/health
```

### **Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@mercury.com","password":"admin123","role":"admin"}'
```

### **Postman**
```
Import: Mercury_Mystery_Admin_Postman_Collection.json
```

---

**🚀 Ready to use! All 34 endpoints integrated!**
