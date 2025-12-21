
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const AuthForm: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(formData.email, formData.password);
        if (success) navigate('/dashboard');
        else setError('Invalid email or password');
      } else {
        const success = await register(formData.name, formData.email);
        if (success) navigate('/dashboard');
        else setError('Email already in use');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col justify-center items-center px-6 py-12">
      <div className="mb-10 text-center">
        <Link to="/" className="flex items-center gap-2 justify-center mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">C</div>
          <span className="text-2xl font-bold tracking-tight text-white">CryptoYield</span>
        </Link>
        <p className="text-gray-500 max-w-xs mx-auto">
          {mode === 'login' ? 'Sign in to access your investment dashboard' : 'Join thousands of investors worldwide and start earning'}
        </p>
      </div>

      <div className="w-full max-w-md bg-[#0e121a] border border-gray-800 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
        
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-[#141922] border border-gray-800 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-blue-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                required
                type="email"
                placeholder="name@company.com"
                className="w-full bg-[#141922] border border-gray-800 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-blue-500 outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#141922] border border-gray-800 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-blue-500 outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-2xl font-bold text-white transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {mode === 'login' ? (
              <>Don't have an account? <Link to="/register" className="text-blue-500 font-bold hover:underline">Register now</Link></>
            ) : (
              <>Already have an account? <Link to="/login" className="text-blue-500 font-bold hover:underline">Sign in</Link></>
            )}
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
           <div className="flex items-center gap-3 text-gray-600">
             <ShieldCheck className="w-5 h-5" />
             <p className="text-[10px] leading-tight">
               Your connection to CryptoYield is secured with 256-bit SSL encryption. We never share your data with third parties.
             </p>
           </div>
        </div>
      </div>

      {mode === 'login' && (
        <div className="mt-8 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-xs text-blue-400">
          <p className="font-bold mb-1">Demo Access Credentials:</p>
          <p>Admin: admin@hyip.com / admin123</p>
          <p>User: demo@user.com / (any password)</p>
        </div>
      )}
    </div>
  );
};
