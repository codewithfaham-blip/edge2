
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Copy, Check, Share2, AtSign } from 'lucide-react';
import { PublicNavbar } from './Navbar';

export const AuthForm: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userId: '', // New field for user-defined ID / Referral Code
    password: '',
    referralCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<'admin' | 'user' | null>(null);

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
        if (formData.userId.length < 4) {
          setError('User ID must be at least 4 characters');
          setLoading(false);
          return;
        }
        const response = await register(formData.name, formData.email, formData.userId, formData.referralCode);
        if (response.success) navigate('/dashboard');
        else setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const autoFill = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setFormData({
        ...formData,
        name: 'Platform Administrator',
        email: 'admin@hyip.com',
        password: 'admin123',
      });
    } else {
      setFormData({
        ...formData,
        name: 'John Doe',
        email: 'demo@user.com',
        userId: 'JOHNDOE77',
        password: 'password123',
      });
    }
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] pt-32 pb-20 px-6 flex flex-col items-center">
      <PublicNavbar />

      <div className="w-full max-w-md bg-[#0e121a] border border-white/5 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
        
        <div className="mb-10 text-center relative">
          <h2 className="text-4xl font-bold mb-3 tracking-tight text-white">
            {mode === 'login' ? 'Welcome Back' : 'Join the Elite'}
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            {mode === 'login' ? 'Sign in to access your dashboard' : 'Create your secure investment account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-[#11141b] border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-700 font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Unique User ID (Referral Code)</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  required
                  type="text"
                  placeholder="MYWEALTHCODE"
                  className="w-full bg-[#11141b] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-700 font-bold tracking-tight uppercase"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value.replace(/[^a-zA-Z0-9]/g, '') })}
                />
              </div>
              <p className="text-[9px] text-gray-600 ml-1">Alphanumeric only. This will be your login and referral ID.</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <input
                required
                type="email"
                placeholder="name@provider.com"
                className="w-full bg-[#11141b] border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-700 font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#11141b] border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-700 font-medium"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Referral Code (Optional)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="INVITER_CODE"
                  className="w-full bg-[#11141b] border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-700 font-medium uppercase"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-4 rounded-2xl border border-red-500/20">{error}</p>}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-[24px] font-bold text-white transition-all shadow-2xl shadow-blue-900/50 flex items-center justify-center gap-3 group text-lg"
          >
            {loading ? 'Processing...' : (
               <div className="flex items-center gap-2">
                 <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </div>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm font-medium">
            {mode === 'login' ? (
              <>Don't have an account? <Link to="/register" className="text-blue-500 font-bold hover:underline ml-1">Register now</Link></>
            ) : (
              <>Already have an account? <Link to="/login" className="text-blue-500 font-bold hover:underline ml-1">Sign in</Link></>
            )}
          </p>
        </div>
      </div>

      {/* Auto-fill Credentials Section */}
      <div className="mt-12 w-full max-w-sm">
        <div className="p-8 bg-[#0e121a] rounded-[32px] border border-blue-500/10 shadow-xl relative overflow-hidden group/box">
          <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/box:opacity-100 transition-opacity" />
          <p className="font-bold text-blue-500 uppercase tracking-[0.2em] text-[10px] text-center mb-6 relative">Quick Access Demo Credentials</p>
          
          <div className="space-y-4 relative">
            <button 
              onClick={() => autoFill('admin')}
              className="w-full group flex items-center justify-between p-5 bg-[#11141b] border border-white/5 rounded-2xl hover:border-blue-500/40 hover:bg-blue-600/5 transition-all"
            >
              <div className="text-left">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 group-hover:text-blue-400">Admin Account</p>
                <p className="text-sm text-white font-mono">admin@hyip.com / admin123</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-blue-500/20 text-gray-500 group-hover:text-blue-500 transition-all">
                {copiedType === 'admin' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </div>
            </button>

            <button 
              onClick={() => autoFill('user')}
              className="w-full group flex items-center justify-between p-5 bg-[#11141b] border border-white/5 rounded-2xl hover:border-blue-500/40 hover:bg-blue-600/5 transition-all"
            >
              <div className="text-left">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 group-hover:text-blue-400">Standard User</p>
                <p className="text-sm text-white font-mono">demo@user.com / (any)</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-blue-500/20 text-gray-500 group-hover:text-blue-500 transition-all">
                {copiedType === 'user' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
