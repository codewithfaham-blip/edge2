
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { LayoutDashboard, Wallet, History, Users, Settings, LogOut, Menu, X, ShieldCheck, TrendingUp, LogOut as LogOutIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../types';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === UserRole.ADMIN;

  const navigation = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Invest', icon: TrendingUp, path: '/invest' },
    { name: 'Transactions', icon: Wallet, path: '/transactions' },
    { name: 'Referrals', icon: Users, path: '/referrals' },
    ...(isAdmin ? [{ name: 'Admin Panel', icon: ShieldCheck, path: '/admin' }] : []),
  ];

  const mobileNav = [
    { name: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Invest', icon: TrendingUp, path: '/invest' },
    { name: 'Finance', icon: Wallet, path: '/transactions' },
    isAdmin 
      ? { name: 'Admin', icon: ShieldCheck, path: '/admin' }
      : { name: 'Refs', icon: Users, path: '/referrals' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#0b0e14] flex">
      {/* Sidebar Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop) */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-[#0e121a] border-r border-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 z-50 flex flex-col`}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/40 text-white">C</div>
            {/* Brand text removed as per request */}
          </Link>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.path) 
                  ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer - Logout button hidden from here as requested */}
        <div className="mt-auto p-6 border-t border-gray-800 mb-24 md:mb-0 hidden md:block">
           <div className="flex items-center gap-3 px-4 py-2 bg-blue-600/5 rounded-2xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">{currentUser.name[0]}</div>
              <div className="flex flex-col overflow-hidden">
                 <span className="text-sm font-bold text-white truncate">{currentUser.name}</span>
                 <span className="text-[10px] text-gray-500 truncate uppercase tracking-tighter">{currentUser.role}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="h-20 bg-[#0e121a]/80 backdrop-blur-lg sticky top-0 border-b border-gray-800 px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-400"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex flex-col">
              <h1 className="text-lg font-semibold text-white">Welcome, {currentUser.name}</h1>
              <p className="text-sm text-gray-500">Track your portfolio performance</p>
            </div>
            {/* Mobile Logo in Header */}
            <Link to="/" className="md:hidden">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">C</div>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Balance</span>
              <span className="text-sm md:text-lg font-bold text-green-500 font-mono">${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            
            {/* Unified Action Bar Header for both mobile and desktop */}
            <div className="flex items-center gap-2">
              <button 
                onClick={logout}
                className="p-2.5 text-gray-500 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all border border-white/5 group"
                title="Sign Out"
              >
                <LogOutIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <div className="hidden sm:flex w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center font-bold text-sm border-2 border-white/5 shadow-lg">
                {currentUser.name[0]}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-7xl mx-auto pb-28 md:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="bg-[#0e121a]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] h-20 flex items-center justify-around px-2 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.8)]">
          {mobileNav.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all active:scale-95 ${
                  active ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <div className={`relative p-2 rounded-2xl transition-all duration-300 ${active ? 'bg-blue-600/10 shadow-[inset_0_0_15px_rgba(37,99,235,0.1)]' : ''}`}>
                  <item.icon className={`w-5 h-5 ${active ? 'fill-blue-500/10' : ''}`} />
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,1)]" />
                  )}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tight transition-all ${active ? 'opacity-100' : 'opacity-60'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
