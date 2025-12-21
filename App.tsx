
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { LandingPage } from './pages/Landing';
import { UserDashboard } from './pages/Dashboard';
import { AdminPanel } from './pages/Admin';
import { InvestPage } from './pages/Invest';
import { TransactionsPage } from './pages/Transactions';
import { ReferralsPage } from './pages/Referrals';
import { AuthForm } from './components/Auth';
import { DashboardLayout } from './components/Layout';
import { PublicPlansPage } from './pages/PublicPlans';
import { UserRole } from './types';

/**
 * Next.js inspired Route Guard
 * Handles protected layout wrapping and role checks
 */
const RouteWrapper: React.FC<{ 
  children: React.ReactNode; 
  isPrivate?: boolean;
  adminOnly?: boolean;
}> = ({ children, isPrivate, adminOnly }) => {
  const { currentUser } = useApp();
  
  if (isPrivate && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser?.role !== UserRole.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (isPrivate) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { currentUser } = useApp();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={
        <RouteWrapper>
          {currentUser ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        </RouteWrapper>
      } />
      
      <Route path="/login" element={<AuthForm mode="login" />} />
      <Route path="/register" element={<AuthForm mode="register" />} />
      <Route path="/public-plans" element={<PublicPlansPage />} />
      
      {/* Protected Dashboard Pages */}
      <Route path="/dashboard" element={
        <RouteWrapper isPrivate>
          <UserDashboard />
        </RouteWrapper>
      } />
      
      <Route path="/invest" element={
        <RouteWrapper isPrivate>
          <InvestPage />
        </RouteWrapper>
      } />
      
      <Route path="/transactions" element={
        <RouteWrapper isPrivate>
          <TransactionsPage />
        </RouteWrapper>
      } />
      
      <Route path="/referrals" element={
        <RouteWrapper isPrivate>
          <ReferralsPage />
        </RouteWrapper>
      } />
      
      {/* Admin Restricted Pages */}
      <Route path="/admin" element={
        <RouteWrapper isPrivate adminOnly>
          <AdminPanel />
        </RouteWrapper>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/**
 * Main App entry mimicking Next.js Root Layout functionality
 */
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
