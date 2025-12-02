import { useEffect } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log('🔍 Auth State:', { isAuthenticated, isLoading, user: user?.email });
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F7FA' }}>
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#0AAE9A] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg" style={{ color: '#6B7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'white',
            color: '#111827',
            border: '1px solid #E5E7EB',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          },
          className: 'toast-custom',
        }}
        richColors 
      />
      <AppContent />
    </AuthProvider>
  );
}
