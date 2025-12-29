
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext.tsx';
import { LandingPage } from './pages/Landing.tsx';
import { UserDashboard } from './pages/Dashboard.tsx';
import { AdminPanel } from './pages/Admin.tsx';
import { InvestPage } from './pages/Invest.tsx';
import { TransactionsPage } from './pages/Transactions.tsx';
import { ReferralsPage } from './pages/Referrals.tsx';
import { SupportPage } from './pages/Support.tsx';
import { SettingsPage } from './pages/Settings.tsx';
import { AuthForm } from './components/Auth.tsx';
import { DashboardLayout } from './components/Layout.tsx';
import { PublicPlansPage } from './pages/PublicPlans.tsx';
import { UserRole } from './types.ts';

const RouteWrapper: React.FC<{ 
  children: React.ReactNode; 
  isPrivate?: boolean;
  adminOnly?: boolean;
  userOnly?: boolean;
}> = ({ children, isPrivate, adminOnly, userOnly }) => {
  const { currentUser, isHydrated } = useApp();
  
  if (!isHydrated) return null;

  if (isPrivate && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser?.role !== UserRole.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  if (userOnly && currentUser?.role === UserRole.ADMIN) {
    return <Navigate to="/admin" replace />;
  }
  
  if (isPrivate) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { currentUser, isHydrated } = useApp();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-blue-500 tracking-widest text-xs uppercase animate-pulse">Initializing Kernel...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        currentUser ? (
          currentUser.role === UserRole.ADMIN ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />
        ) : (
          <LandingPage />
        )
      } />
      
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <AuthForm mode="login" />} />
      <Route path="/register" element={currentUser ? <Navigate to="/" replace /> : <AuthForm mode="register" />} />
      <Route path="/public-plans" element={<PublicPlansPage />} />
      
      <Route path="/dashboard" element={
        <RouteWrapper isPrivate userOnly>
          <UserDashboard />
        </RouteWrapper>
      } />
      
      <Route path="/invest" element={
        <RouteWrapper isPrivate userOnly>
          <InvestPage />
        </RouteWrapper>
      } />
      
      <Route path="/transactions" element={
        <RouteWrapper isPrivate>
          <TransactionsPage />
        </RouteWrapper>
      } />
      
      <Route path="/referrals" element={
        <RouteWrapper isPrivate userOnly>
          <ReferralsPage />
        </RouteWrapper>
      } />

      <Route path="/support" element={
        <RouteWrapper isPrivate userOnly>
          <SupportPage />
        </RouteWrapper>
      } />

      <Route path="/settings" element={
        <RouteWrapper isPrivate userOnly>
          <SettingsPage />
        </RouteWrapper>
      } />
      
      <Route path="/admin" element={
        <RouteWrapper isPrivate adminOnly>
          <AdminPanel />
        </RouteWrapper>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="antialiased selection:bg-blue-500/30">
          <AppRoutes />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
