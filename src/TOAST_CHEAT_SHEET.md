# 🍞 Toast Notifications - Quick Cheat Sheet

**Mercury Mystery Admin - Toast Implementation Reference**

---

## 🚀 Quick Start

### 1. Import Toast
```typescript
import { toast } from 'sonner@2.0.3';
```

### 2. Show Toast
```typescript
toast.success('✅ Success message!');
toast.error('❌ Error message!');
toast.info('ℹ️ Info message!');
toast.warning('⚠️ Warning message!');
```

---

## 📝 Common Patterns

### Success with Try-Catch
```typescript
try {
  await apiCall();
  toast.success('✅ Operation successful!');
} catch (error: any) {
  toast.error(error.message || 'Operation failed');
}
```

### With Variable Data
```typescript
toast.success(`✅ ${name} created successfully!`);
toast.error(`❌ Failed to create ${name}`);
```

### After Form Submit
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await saveData(formData);
    toast.success('✅ Data saved!');
    setShowForm(false);
  } catch (error: any) {
    toast.error(error.message || 'Failed to save');
  }
};
```

---

## 🎨 Message Templates

### Authentication
```typescript
// Login
toast.success('🎉 Login successful! Welcome back!');
toast.error('❌ Invalid credentials');

// Signup  
toast.success('✅ Account created successfully!');
toast.error('❌ Email already exists');

// Logout
toast.success('👋 Logged out successfully!');
```

### CRUD Operations
```typescript
// Create
toast.success('✅ Item created successfully!');
toast.error('❌ Failed to create item');

// Update
toast.success('✅ Item updated successfully!');
toast.error('❌ Failed to update item');

// Delete
toast.success('🗑️ Item deleted successfully');
toast.error('❌ Failed to delete item');

// Fetch
toast.success('Data loaded successfully');
toast.error('❌ Failed to load data');
```

### Validation
```typescript
toast.error('Passwords do not match');
toast.error('Email is required');
toast.error('Password must be at least 6 characters');
toast.warning('⚠️ Please review the form');
```

### File Upload
```typescript
toast.success('✅ File uploaded successfully!');
toast.success(`✅ ${count} files uploaded!`);
toast.error('❌ Invalid file format');
toast.error('❌ File too large');
```

### Bulk Operations
```typescript
toast.success(`✅ ${count} items processed!`);
toast.success(`✅ Uploaded: ${breakdown}`);
toast.error(`❌ ${failed} items failed`);
```

---

## 🎯 Best Practices

### DO ✅
```typescript
// Use emojis for clarity
toast.success('✅ Success!');
toast.error('❌ Error!');

// Include details
toast.success(`✅ ${count} audits uploaded!`);

// Show API errors
catch (error: any) {
  toast.error(error.message || 'Operation failed');
}

// Keep messages short
toast.success('✅ Saved!');
```

### DON'T ❌
```typescript
// Don't use alert()
alert('Success!'); // ❌ OLD WAY

// Don't use long messages
toast.success('This is a very long message...'); // ❌

// Don't forget error handling
await apiCall(); // ❌ No try-catch
toast.success('Done!');

// Don't show multiple errors
toast.error('Error 1');
toast.error('Error 2');
toast.error('Error 3'); // ❌ Overwhelming
```

---

## 📍 Implementation Locations

### Already Implemented ✅
```typescript
// App.tsx - Toaster setup
<Toaster position="top-right" richColors />

// LoginPage.tsx - Auth toasts
toast.success('🎉 Login successful!');
toast.error('❌ Invalid credentials');

// Dashboard.tsx - Logout toast
toast.success('👋 Logged out!');

// AuditorManagement.tsx - CRUD toasts
toast.success('✅ Auditor created!');
toast.success(`🗑️ ${name} deleted!`);

// AuditManagement.tsx - Create toast
toast.success('✅ Audit created!');
```

### Needs Manual Fix 🚧
```typescript
// AuditManagement.tsx - Lines 155, 157, 161
// Replace alert() with toast.success() or toast.error()
```

---

## 🔧 Quick Fix Guide

### Replace Alert with Toast

**Before:**
```typescript
alert('Success!');
alert('Error!');
```

**After:**
```typescript
toast.success('✅ Success!');
toast.error('❌ Error!');
```

### Add Error Handling

**Before:**
```typescript
await apiCall();
```

**After:**
```typescript
try {
  await apiCall();
  toast.success('✅ Success!');
} catch (error: any) {
  toast.error(error.message || 'Failed');
}
```

---

## 🎨 Styling (Already Configured)

The Toaster in App.tsx is pre-configured with Mercury Mystery styling:
- ✅ White background
- ✅ Glass morphism
- ✅ Top-right position
- ✅ Auto-dismiss
- ✅ Rich colors (green/red)

**No additional styling needed!**

---

## 🧪 Testing Commands

```typescript
// Test success
toast.success('Test success!');

// Test error
toast.error('Test error!');

// Test info
toast.info('Test info!');

// Test warning
toast.warning('Test warning!');
```

---

## 📊 Status

```
✅ Toaster configured
✅ LoginPage.tsx
✅ Dashboard.tsx
✅ AuditorManagement.tsx
🚧 AuditManagement.tsx (95%)
⏳ Other components (optional)
```

---

## 🚀 Quick Reference

| Action | Code |
|--------|------|
| **Import** | `import { toast } from 'sonner@2.0.3';` |
| **Success** | `toast.success('✅ Message')` |
| **Error** | `toast.error('❌ Message')` |
| **Info** | `toast.info('ℹ️ Message')` |
| **Warning** | `toast.warning('⚠️ Message')` |

---

**Print this and keep it handy! 📌**

**Last Updated:** November 28, 2024
