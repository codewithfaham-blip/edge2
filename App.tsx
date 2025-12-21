
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
 * Enhanced Route Guard
 * Manages access control and redirects based on authentication status and user roles.
 */
const RouteWrapper: React.FC<{ 
  children: React.ReactNode; 
  isPrivate?: boolean;
  adminOnly?: boolean;
}> = ({ children, isPrivate, adminOnly }) => {
  const { currentUser } = useApp();
  
  // 1. Not logged in but trying to access a private route
  if (isPrivate && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in as user but trying to access admin-only route
  if (adminOnly && currentUser?.role !== UserRole.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // 3. Authenticated - Wrap in shared layout
  if (isPrivate) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // 4. Public route
  return <>{children}</>;
};

const AppRoutes = () => {
  const { currentUser } = useApp();

  return (
    <Routes>
      {/* Landing / Public Entry */}
      <Route path="/" element={
        currentUser ? (
          currentUser.role === UserRole.ADMIN ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />
        ) : (
          <LandingPage />
        )
      } />
      
      <Route path="/login" element={
        currentUser ? <Navigate to="/" replace /> : <AuthForm mode="login" />
      } />
      
      <Route path="/register" element={
        currentUser ? <Navigate to="/" replace /> : <AuthForm mode="register" />
      } />
      
      <Route path="/public-plans" element={<PublicPlansPage />} />
      
      {/* Protected Member Dashboard */}
      <Route path="/dashboard" element={
        <RouteWrapper isPrivate>
          {currentUser?.role === UserRole.ADMIN ? <Navigate to="/admin" replace /> : <UserDashboard />}
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
      
      {/* Admin Operations Center */}
      <Route path="/admin" element={
        <RouteWrapper isPrivate adminOnly>
          <AdminPanel />
        </RouteWrapper>
      } />
      
      {/* Catch-all fallback */}
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
