import { useState } from 'react';
import { Lock, Mail, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        console.log('🔐 Attempting login...');
        await login({ email, password });
        console.log('✅ Login successful!');
        toast.success('🎉 Login successful! Welcome back!');
        console.log('⏱️ Waiting 2 seconds before redirect to show console logs...');
        // Wait 2 seconds before redirect to see console logs
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Redirect happens automatically via AuthContext
      } else {
        // Signup validation
        if (password !== confirmPassword) {
          const errorMsg = 'Passwords do not match';
          setError(errorMsg);
          toast.error(errorMsg);
          setLoading(false);
          return;
        }
        
        if (password.length < 6) {
          const errorMsg = 'Password must be at least 6 characters';
          setError(errorMsg);
          toast.error(errorMsg);
          setLoading(false);
          return;
        }

        // Register
        console.log('📝 Attempting registration...');
        await register({ name, email, password, role: 'admin' });
        console.log('✅ Registration successful!');
        toast.success('✅ Account created successfully! Welcome to Mercury Mystery!');
        // Redirect happens automatically via AuthContext
      }
    } catch (err: any) {
      console.error('❌ Auth error:', err);
      
      // Better error messages
      let errorMsg = err.message || 'An error occurred. Please try again.';
      
      // Network error - backend not reachable
      if (errorMsg.includes('Network Error')) {
        errorMsg = 'Cannot connect to server. Please make sure the backend is running on port 5000.';
        console.error('💡 Troubleshooting:', {
          issue: 'Backend not reachable',
          solution1: 'Check if backend is running: cd backend && npm start',
          solution2: 'Check API URL in /config/api.config.ts',
          expectedURL: 'http://localhost:5000/api'
        });
      }
      
      // Timeout error
      if (errorMsg.includes('timeout')) {
        errorMsg = 'Request timeout. Backend is taking too long to respond.';
      }
      
      setError(errorMsg);
      toast.error(`❌ ${errorMsg}`);
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#F5F7FA' }}>
      {/* Premium Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 animate-float" style={{ background: 'radial-gradient(circle, #0AAE9A 0%, transparent 70%)', filter: 'blur(60px)' }}></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full opacity-20 animate-float" style={{ background: 'radial-gradient(circle, #078672 0%, transparent 70%)', filter: 'blur(60px)', animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full opacity-15 animate-float" style={{ background: 'radial-gradient(circle, #0AAE9A 0%, transparent 70%)', filter: 'blur(60px)', animationDelay: '2s' }}></div>
      </div>
      
      <div className="bg-white backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-10 w-full max-w-md relative z-10 border border-[#E5E7EB]">
        <div className="text-center mb-10">
          <div className="inline-flex p-5 rounded-3xl mb-6 relative overflow-hidden group shadow-[0_10px_30px_rgba(10,174,154,0.3)]" style={{ background: 'linear-gradient(135deg, #0AAE9A 0%, #078672 50%, #0AAE9A 100%)' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Lock className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
          </div>
          <h1 className="mb-3 bg-gradient-to-r from-[#0AAE9A] via-[#0CC9B3] to-[#078672] bg-clip-text text-transparent animate-gradient" style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.02em' }}>Mercury Mystery</h1>
          <p className="text-lg" style={{ color: '#6B7280', fontWeight: '500' }}>Admin Portal</p>
          <p className="mt-2 text-sm" style={{ color: '#9CA3AF' }}>
            {isLogin ? 'Sign in to your account' : 'Create your admin account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block mb-3 flex items-center gap-2" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>
                <User className="w-4 h-4" />
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0AAE9A] to-[#078672] rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity"></div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none relative z-10 bg-white transition-all duration-300 shadow-sm"
                  style={{ 
                    borderColor: '#E5E7EB',
                    fontSize: '0.95rem',
                    color: '#111827'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0AAE9A';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-3 flex items-center gap-2" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0AAE9A] to-[#078672] rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity"></div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none relative z-10 bg-white transition-all duration-300 shadow-sm"
                style={{ 
                  borderColor: '#E5E7EB',
                  fontSize: '0.95rem',
                  color: '#111827'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#0AAE9A';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="admin@mercury.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-3 flex items-center gap-2" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>
              <Lock className="w-4 h-4" />
              Password
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0AAE9A] to-[#078672] rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity"></div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none relative z-10 bg-white transition-all duration-300 shadow-sm"
                style={{ 
                  borderColor: '#E5E7EB',
                  fontSize: '0.95rem',
                  color: '#111827'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#0AAE9A';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block mb-3 flex items-center gap-2" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>
                <Lock className="w-4 h-4" />
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0AAE9A] to-[#078672] rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity"></div>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none relative z-10 bg-white transition-all duration-300 shadow-sm"
                  style={{ 
                    borderColor: '#E5E7EB',
                    fontSize: '0.95rem',
                    color: '#111827'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0AAE9A';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="••••••••"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-[#EF4444] px-5 py-4 rounded-xl animate-shake backdrop-blur-sm shadow-lg" style={{ color: '#EF4444' }}>
              <p className="flex items-center gap-2 m-0">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group shadow-[0_10px_30px_rgba(10,174,154,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: 'linear-gradient(135deg, #0AAE9A 0%, #078672 50%, #0AAE9A 100%)',
              backgroundSize: '200% 100%',
              fontWeight: '600',
              fontSize: '1rem',
              letterSpacing: '0.02em'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundPosition = '100% 0';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(10, 174, 154, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundPosition = '0% 0';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(10, 174, 154, 0.3)';
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-sm transition-colors duration-300 hover:underline"
            style={{ color: '#0AAE9A' }}
          >
            {isLogin ? (
              <>Don't have an account? <strong>Sign Up</strong></>
            ) : (
              <>Already have an account? <strong>Sign In</strong></>
            )}
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}