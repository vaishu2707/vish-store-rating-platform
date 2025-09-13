import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import StoreList from './components/StoreList';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';
import StoreManagement from './components/StoreManagement';
import StoreOwnerDashboard from './components/StoreOwnerDashboard';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';

const AppContent = () => {
  const { user, loading, loggingOut } = useAuth();

  if (loading || loggingOut) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        
        <Routes>
          {/* Public routes - only accessible when not logged in */}
          <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/" replace />} />
          
          {/* Home route - landing page for unauthenticated, store list for authenticated */}
          <Route path="/" element={
            user ? (
              <Layout>
                <StoreList />
              </Layout>
            ) : (
              <LandingPage />
            )
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/stores" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <Layout>
                <StoreManagement />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Store owner routes */}
          <Route path="/store-owner/dashboard" element={
            <ProtectedRoute requiredRoles={['store_owner']}>
              <Layout>
                <StoreOwnerDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;



