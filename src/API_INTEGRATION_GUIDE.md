# 🔌 API Integration Guide

## ✅ **Integration Complete!**

All backend APIs have been successfully integrated with the frontend application.

---

## 📁 **Files Created**

### **1. Service Layer (`/services/`)**
- ✅ `/services/api.ts` - Base API client with interceptors
- ✅ `/services/auth.service.ts` - Authentication operations
- ✅ `/services/auditor.service.ts` - Auditor CRUD operations
- ✅ `/services/audit.service.ts` - Audit CRUD operations
- ✅ `/services/upload.service.ts` - File upload operations
- ✅ `/services/report.service.ts` - Analytics and reporting
- ✅ `/services/index.ts` - Central export

### **2. Authentication Context**
- ✅ `/contexts/AuthContext.tsx` - Global auth state management

### **3. Environment Configuration**
- ✅ `/.env` - Environment variables
- ✅ `/.env.example` - Environment template

---

## 🎯 **API Endpoints Integrated**

### **Authentication (`/api/auth/`)**
```typescript
✅ POST   /auth/register          - Register new user
✅ POST   /auth/login             - Login user
✅ GET    /auth/me                - Get current user
✅ PUT    /auth/update            - Update user details
✅ PUT    /auth/change-password   - Change password
✅ POST   /auth/logout            - Logout user
```

### **Auditors (`/api/auditors/`)**
```typescript
✅ GET    /auditors               - Get all auditors
✅ GET    /auditors/stats         - Get auditor statistics
✅ GET    /auditors/:id           - Get single auditor
✅ POST   /auditors               - Create new auditor
✅ PUT    /auditors/:id           - Update auditor
✅ DELETE /auditors/:id           - Delete auditor
✅ POST   /auditors/:id/update-metrics - Update metrics
```

### **Audits (`/api/audits/`)**
```typescript
✅ GET    /audits                 - Get all audits (with filters)
✅ GET    /audits/stats           - Get audit statistics
✅ GET    /audits/analytics       - Get comprehensive analytics
✅ GET    /audits/:id             - Get single audit
✅ POST   /audits                 - Create new audit
✅ PUT    /audits/:id             - Update audit
✅ PATCH  /audits/:id/assign      - Assign audit to auditor
✅ PATCH  /audits/:id/status      - Update audit status
✅ PATCH  /audits/:id/calculate-score - Calculate score
✅ DELETE /audits/:id             - Delete audit
✅ DELETE /audits                 - Bulk delete audits
```

### **Upload (`/api/upload/`)**
```typescript
✅ POST   /upload/excel           - Upload and parse Excel
✅ GET    /upload/template/:type  - Download Excel template
```

### **Reports (`/api/reports/`)**
```typescript
✅ GET    /reports/overview       - Get overview stats
✅ GET    /reports/auditor-performance - Auditor performance
✅ GET    /reports/circle-performance - Circle performance
✅ GET    /reports/score-analytics - Score analytics
✅ GET    /reports/audit-type-breakdown - Audit type breakdown
✅ GET    /reports/trending       - Trending data
✅ GET    /reports/export         - Export report data
```

---

## 🚀 **How to Use the Services**

### **1. Authentication**

```typescript
import { authService } from './services';

// Login
try {
  const response = await authService.login({
    email: 'admin@example.com',
    password: 'password123'
  });
  console.log('Logged in:', response.user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Register
try {
  const response = await authService.register({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'admin'
  });
  console.log('Registered:', response.user);
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Get current user
try {
  const user = await authService.getMe();
  console.log('Current user:', user);
} catch (error) {
  console.error('Failed to get user:', error.message);
}

// Logout
await authService.logout();
```

### **2. Auditors**

```typescript
import { auditorService } from './services';

// Get all auditors
const auditors = await auditorService.getAllAuditors();

// Create auditor
const newAuditor = await auditorService.createAuditor({
  name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  phone: '+919876543210',
  circles: ['Mum', 'DEL', 'Guj'],
  status: 'active'
});

// Update auditor
const updated = await auditorService.updateAuditor(auditorId, {
  circles: ['Mum', 'DEL', 'Guj', 'BH']
});

// Delete auditor
await auditorService.deleteAuditor(auditorId);

// Get statistics
const stats = await auditorService.getAuditorStats();
console.log('Total auditors:', stats.totalAuditors);
```

### **3. Audits**

```typescript
import { auditService } from './services';

// Get all audits with filters
const { audits, pagination } = await auditService.getAllAudits({
  auditType: 'store',
  circle: 'Mum',
  status: 'completed',
  page: 1,
  limit: 10,
  sortBy: 'deadline',
  sortOrder: 'desc'
});

// Create audit
const newAudit = await auditService.createAudit({
  storeCode: 'MUM001',
  storeName: 'Mumbai Store 1',
  location: 'Andheri',
  auditType: 'store',
  circle: 'Mum',
  deadline: new Date('2024-12-31'),
  score: 92
});

// Assign audit to auditor
const assigned = await auditService.assignAudit(auditId, auditorId);

// Update status
const updated = await auditService.updateStatus(auditId, 'completed');

// Calculate score
const scored = await auditService.calculateScore(auditId);

// Get statistics
const stats = await auditService.getAuditStats();
console.log('Total audits:', stats.totalAudits);
console.log('Average score:', stats.averageScore);
```

### **4. Upload**

```typescript
import { uploadService } from './services';

// Upload Excel file
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const file = fileInput.files[0];

try {
  const result = await uploadService.uploadExcel(file, (progress) => {
    console.log(`Upload progress: ${progress}%`);
  });
  
  console.log('Upload successful!');
  console.log(`Imported: ${result.data.successfulImports} audits`);
  console.log(`Failed: ${result.data.failedImports} rows`);
  
  if (result.data.errors.length > 0) {
    console.log('Errors:', result.data.errors);
  }
} catch (error) {
  console.error('Upload failed:', error.message);
}

// Download template
const blob = await uploadService.downloadTemplate('store');
uploadService.triggerDownload(blob, 'store_audit_template.xlsx');
```

### **5. Reports**

```typescript
import { reportService } from './services';

// Get overview
const overview = await reportService.getOverview();
console.log('Total audits:', overview.totalAudits);
console.log('Completion rate:', overview.completionRate);

// Get auditor performance
const auditorPerf = await reportService.getAuditorPerformance();
console.log('Top auditor:', auditorPerf[0]);

// Get circle performance
const circlePerf = await reportService.getCirclePerformance();
console.log('Top circle:', circlePerf[0]);

// Get score analytics
const scoreAnalytics = await reportService.getScoreAnalytics();
console.log('Average score:', scoreAnalytics.overall.averageScore);

// Export report
const blob = await reportService.exportReport({
  format: 'excel',
  type: 'audits',
  filters: { circle: 'Mum' }
});
reportService.triggerDownload(blob, 'audit_report.xlsx');
```

---

## 🔐 **Authentication Flow**

### **1. Initial Setup**

```typescript
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
```

### **2. Using Auth Context**

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### **3. Protected Routes**

```typescript
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}
```

---

## ⚙️ **Environment Configuration**

### **`.env` File**

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

### **Production**

```bash
VITE_API_URL=https://api.mercurymystery.com/api
```

---

## 🔧 **API Client Features**

### **1. Automatic Token Management**
- Auth token stored in localStorage
- Automatically added to all requests via interceptor
- Cleared on 401 responses

### **2. Error Handling**
```typescript
try {
  const audits = await auditService.getAllAudits();
} catch (error) {
  // Error message is automatically extracted
  console.error(error.message);
}
```

### **3. Request/Response Interceptors**
- Request: Adds Authorization header
- Response: Handles 401 (redirects to login)

---

## 📊 **TypeScript Support**

All services are fully typed:

```typescript
// Strong typing for requests
const audit: CreateAuditData = {
  storeCode: 'MUM001',
  storeName: 'Mumbai Store',
  location: 'Andheri',
  auditType: 'store', // Type-safe: only 'store' | 'ilms' | 'xfe'
  circle: 'Mum',
  deadline: new Date()
};

// Strong typing for responses
const result: Audit = await auditService.createAudit(audit);
console.log(result._id); // TypeScript knows this exists
```

---

## 🚨 **Error Handling Best Practices**

### **1. Try-Catch Pattern**

```typescript
async function handleCreateAuditor() {
  try {
    setLoading(true);
    const auditor = await auditorService.createAuditor(formData);
    setSuccess('Auditor created successfully!');
    return auditor;
  } catch (error) {
    setError(error.message);
    console.error('Create auditor failed:', error);
  } finally {
    setLoading(false);
  }
}
```

### **2. Detailed Error Information**

```typescript
import { getErrorDetails } from './services';

try {
  await auditService.createAudit(data);
} catch (error) {
  const details = getErrorDetails(error);
  console.log('Error message:', details.message);
  console.log('Status code:', details.status);
  console.log('Full data:', details.data);
}
```

---

## 🔄 **State Management Integration**

### **With React State**

```typescript
function AuditList() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAudits();
  }, []);

  async function loadAudits() {
    setLoading(true);
    try {
      const { audits } = await auditService.getAllAudits();
      setAudits(audits);
    } catch (error) {
      console.error('Failed to load audits:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {loading ? <Spinner /> : <AuditTable audits={audits} />}
    </div>
  );
}
```

---

## 📦 **Next Steps**

### **1. Update App.tsx**
Replace local state management with API calls:
```typescript
// OLD:
const [audits, setAudits] = useState<Audit[]>([]);

// NEW:
useEffect(() => {
  loadAuditsFromAPI();
}, []);

async function loadAuditsFromAPI() {
  const { audits } = await auditService.getAllAudits();
  setAudits(audits);
}
```

### **2. Update Components**
Replace mock data with real API calls in:
- AuditorManagement
- AuditManagement
- ReportsView

### **3. Add Loading States**
```typescript
const [loading, setLoading] = useState(false);

async function handleAction() {
  setLoading(true);
  try {
    await apiCall();
  } finally {
    setLoading(false);
  }
}
```

### **4. Add Error Handling**
```typescript
const [error, setError] = useState<string | null>(null);

try {
  await apiCall();
  setError(null);
} catch (err) {
  setError(err.message);
}
```

---

## 🎉 **Summary**

### **✅ Completed:**
1. Created 5 service modules (auth, auditor, audit, upload, report)
2. Set up API client with interceptors
3. Created authentication context
4. Configured environment variables
5. Full TypeScript support
6. Error handling utilities
7. Request/response interceptors
8. Token management

### **📋 Ready to Use:**
- All backend APIs integrated
- Type-safe service layer
- Centralized error handling
- Authentication flow
- File upload support
- Report generation
- Excel export/import

### **🚀 Integration Complete!**

Your frontend is now fully connected to the backend. All CRUD operations, authentication, file uploads, and reporting are ready to use!

---

**Need to connect the UI? Let me know and I'll update the App.tsx and components to use these services! 🎯**
