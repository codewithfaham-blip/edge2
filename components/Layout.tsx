
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { LayoutDashboard, Wallet, History, Users, Settings, LogOut, Menu, X, ShieldCheck, TrendingUp } from 'lucide-react';
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#0b0e14] flex">
      {/* Sidebar Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-[#0e121a] border-r border-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 z-50`}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">C</div>
            <span className="text-xl font-bold tracking-tight text-white">CryptoYield</span>
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

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-800">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="h-20 bg-[#0e121a]/80 backdrop-blur-lg sticky top-0 border-b border-gray-800 px-6 flex items-center justify-between z-30">
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

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Account Balance</span>
              <span className="text-lg font-bold text-green-500 font-mono">${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
              {currentUser.name[0]}
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
