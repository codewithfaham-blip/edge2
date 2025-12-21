
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Copy, Check, Share2 } from 'lucide-react';
import { PublicNavbar } from './Navbar';

export const AuthForm: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
        const success = await register(formData.name, formData.email, formData.referralCode);
        if (success) navigate('/dashboard');
        else setError('Email already in use');
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
          <h2 className="text-3xl font-bold mb-3 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Join the Elite'}
          </h2>
          <p className="text-gray-500 text-sm">
            {mode === 'login' ? 'Sign in to access your dashboard' : 'Create your secure investment account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-[#141922] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-700"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                required
                type="email"
                placeholder="name@provider.com"
                className="w-full bg-[#141922] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-700"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#141922] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-700"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Referral Code (Optional)</label>
              <div className="relative">
                <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="text"
                  placeholder="CODE123"
                  className="w-full bg-[#141922] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-700"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">{error}</p>}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-3xl font-bold text-white transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 group"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
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

        <div className="mt-10 pt-8 border-t border-white/5">
           <div className="flex items-center gap-4 text-gray-600">
             <div className="p-2 bg-white/5 rounded-xl"><ShieldCheck className="w-5 h-5 text-blue-500" /></div>
             <p className="text-[10px] leading-relaxed uppercase tracking-widest font-bold">
               Secured by 256-bit AES<br />Military-Grade Encryption
             </p>
           </div>
        </div>
      </div>

      {/* Auto-fill Credentials Section */}
      <div className="mt-12 w-full max-w-sm">
        <div className="p-6 bg-[#0e121a] rounded-[32px] border border-blue-500/10 shadow-xl relative overflow-hidden group/box">
          <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/box:opacity-100 transition-opacity" />
          <p className="font-bold text-blue-500 uppercase tracking-[0.2em] text-[10px] text-center mb-6 relative">Quick Access Demo Credentials</p>
          
          <div className="space-y-3 relative">
            <button 
              onClick={() => autoFill('admin')}
              className="w-full group flex items-center justify-between p-4 bg-[#141922] border border-white/5 rounded-2xl hover:border-blue-500/40 hover:bg-blue-600/5 transition-all"
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
              className="w-full group flex items-center justify-between p-4 bg-[#141922] border border-white/5 rounded-2xl hover:border-blue-500/40 hover:bg-blue-600/5 transition-all"
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
          
          <p className="mt-4 text-center text-[9px] text-gray-600 font-medium italic">Click a credential above to automatically fill the form.</p>
        </div>
      </div>
    </div>
  );
};
