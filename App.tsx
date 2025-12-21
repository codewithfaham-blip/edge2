
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
      
      <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
      <Route path="/invest" element={<PrivateRoute><InvestPage /></PrivateRoute>} />
      <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
      <Route path="/referrals" element={<PrivateRoute><div className="bg-[#0e121a] p-10 rounded-3xl border border-gray-800 text-center">
        <h2 className="text-2xl font-bold mb-4">Referral Program</h2>
        <p className="text-gray-400 mb-8">Earn 5% of all deposits made by your invited friends.</p>
        <div className="max-w-md mx-auto p-4 bg-[#141922] border border-gray-800 rounded-2xl flex items-center justify-between">
           <span className="font-mono text-blue-500">https://cryptoyield.io/?ref={currentUser?.referralCode}</span>
           <button className="bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold">Copy</button>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 text-center">
           <div className="p-6 bg-[#141922] rounded-3xl">
              <p className="text-gray-500 text-sm mb-1">Total Referrals</p>
              <p className="text-3xl font-bold">0</p>
           </div>
           <div className="p-6 bg-[#141922] rounded-3xl">
              <p className="text-gray-500 text-sm mb-1">Referral Earnings</p>
              <p className="text-3xl font-bold text-emerald-500">$0.00</p>
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
