
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  LayoutDashboard, Wallet, Users, ShieldCheck, TrendingUp, 
  LogOut as LogOutIcon, Menu, X, LayoutGrid, CreditCard, Layers, Settings 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../types';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isAtAdminPage = location.pathname.startsWith('/admin');

  const navigation = [
    { name: 'Overview', icon: LayoutDashboard, path: isAdmin ? '/admin' : '/dashboard' },
    ...(!isAdmin ? [
      { name: 'Invest', icon: TrendingUp, path: '/invest' },
      { name: 'Transactions', icon: Wallet, path: '/transactions' },
      { name: 'Referrals', icon: Users, path: '/referrals' },
    ] : [
      { name: 'Admin Panel', icon: ShieldCheck, path: '/admin' },
    ]),
  ];

  // Specific admin sub-menus for mobile hamburger
  const adminSubNav = [
    { name: 'Summary', icon: LayoutGrid, tab: 'overview' },
    { name: 'Payouts', icon: CreditCard, tab: 'withdrawals' },
    { name: 'Members', icon: Users, tab: 'users' },
    { name: 'Engine', icon: Layers, tab: 'plans' },
    { name: 'Kernel', icon: Settings, tab: 'system' },
  ];

  const mobileNav = [
    { name: 'Home', icon: LayoutDashboard, path: isAdmin ? '/admin' : '/dashboard' },
    ...(!isAdmin ? [
      { name: 'Invest', icon: TrendingUp, path: '/invest' },
      { name: 'Finance', icon: Wallet, path: '/transactions' },
      { name: 'Refs', icon: Users, path: '/referrals' }
    ] : [
      { name: 'Admin', icon: ShieldCheck, path: '/admin' }
    ])
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

      {/* Sidebar (Desktop & Mobile Hamburger Drawer) */}
      <div 
        className={`fixed inset-y-0 left-0 bg-[#0e121a] border-r border-gray-800 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-all duration-300 z-50 flex flex-col ${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } w-64 shadow-2xl`}
      >
        <div className={`p-6 ${isCollapsed ? 'md:px-4' : ''} flex-1 overflow-y-auto no-scrollbar`}>
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/40 text-white flex-shrink-0">C</div>
            </Link>
            {/* Close icon for mobile hamburger */}
            <button className="md:hidden text-gray-500 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 ml-4">General</p>
            {navigation.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                    active 
                    ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                  title={isCollapsed ? item.name : ''}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-500' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className={`font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    isCollapsed ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* Mobile Hamburger ONLY Admin Sub-menus */}
            {isAdmin && (
              <div className="md:hidden mt-8 space-y-1">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 ml-4">Admin Kernel</p>
                {adminSubNav.map((sub) => (
                  <Link
                    key={sub.name}
                    to={`/admin?tab=${sub.tab}`}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-transparent"
                  >
                    <sub.icon className="w-5 h-5 text-blue-500/60" />
                    <span className="font-medium">{sub.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>

        <div className={`mt-auto p-6 border-t border-gray-800 mb-24 md:mb-0 hidden md:block ${isCollapsed ? 'md:px-4' : ''}`}>
           <div className={`flex items-center gap-3 px-4 py-2 bg-blue-600/5 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 ${isCollapsed ? 'md:px-2 md:justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name[0]
                )}
              </div>
              <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'}`}>
                 <span className="text-sm font-bold text-white truncate">{currentUser.name}</span>
                 <span className="text-[10px] text-gray-500 truncate uppercase tracking-tighter">{currentUser.role}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Full Header */}
        <header className="h-20 bg-[#0e121a]/80 backdrop-blur-lg sticky top-0 border-b border-gray-800 px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Toggle */}
            <button 
              className="md:hidden text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Desktop Hamburger (Collapse) */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-2 text-gray-500 hover:text-white bg-white/5 rounded-lg transition-colors mr-2"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
               <h2 className="text-sm font-bold text-white truncate max-w-[150px] md:max-w-none">Welcome, {currentUser.name}</h2>
               <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{currentUser.role} Account</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex flex-col items-end mr-4">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Balance</span>
               <span className="text-sm font-black text-emerald-500 font-mono">${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            {/* Logout Button */}
            <button 
              onClick={logout}
              className="p-2.5 text-gray-500 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all border border-white/5 group order-last md:order-none"
              title="Sign Out"
            >
              <LogOutIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm border-2 border-white/5 shadow-lg flex-shrink-0 overflow-hidden">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser.name[0]
              )}
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-7xl mx-auto pb-28 md:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="bg-[#0e121a]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] h-20 flex items-center justify-around px-2 shadow-[0_-20_50px_-12px_rgba(0,0,0,0.8)]">
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
