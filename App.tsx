
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { LandingPage } from './pages/Landing';
import { UserDashboard } from './pages/Dashboard';
import { AdminPanel } from './pages/Admin';
import { InvestPage } from './pages/Invest';
import { TransactionsPage } from './pages/Transactions';
import { AuthForm } from './components/Auth';
import { DashboardLayout } from './components/Layout';
import { PublicPlansPage } from './pages/PublicPlans';
import { UserRole } from './types';

const PrivateRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { currentUser } = useApp();
  
  if (!currentUser) return <Navigate to="/login" />;
  if (adminOnly && currentUser.role !== UserRole.ADMIN) return <Navigate to="/dashboard" />;
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

const MainContent = () => {
  const { currentUser } = useApp();

  return (
    <Routes>
      <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={<AuthForm mode="login" />} />
      <Route path="/register" element={<AuthForm mode="register" />} />
      <Route path="/public-plans" element={<PublicPlansPage />} />
      
      <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
      <Route path="/invest" element={<PrivateRoute><InvestPage /></PrivateRoute>} />
      <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
      <Route path="/referrals" element={<PrivateRoute><div className="bg-[#0e121a] p-10 rounded-[48px] border border-white/5 text-center">
        <h2 className="text-3xl font-bold mb-6 tracking-tight">Referral Ecosystem</h2>
        <p className="text-gray-500 mb-10 max-w-lg mx-auto">Build your network and earn 5% commission on every capital allocation made by your invited associates.</p>
        <div className="max-w-xl mx-auto p-6 bg-[#141922] border border-white/5 rounded-3xl flex items-center justify-between gap-4">
           <span className="font-mono text-blue-500 truncate text-sm">https://cryptoyield.io/?ref={currentUser?.referralCode}</span>
           <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-blue-900/20 whitespace-nowrap">Copy Link</button>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-8 text-center max-w-2xl mx-auto">
           <div className="p-10 bg-[#141922] rounded-[32px] border border-white/5">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Active Network</p>
              <p className="text-4xl font-bold font-mono text-white">0</p>
           </div>
           <div className="p-10 bg-[#141922] rounded-[32px] border border-white/5">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Total Commission</p>
              <p className="text-4xl font-bold font-mono text-emerald-500">$0.00</p>
           </div>
        </div>
      </div></PrivateRoute>} />
      
      <Route path="/admin" element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <MainContent />
      </Router>
    </AppProvider>
  );
};

export default App;
