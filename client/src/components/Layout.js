import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Store, BarChart3, Home } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    // Use setTimeout to ensure state is updated before navigation
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 50);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="navbar-brand">
              Store Rating Platform
            </Link>
            
            {user && (
              <div className="navbar-nav">
                <Link 
                  to="/" 
                  className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                >
                  <Home size={16} style={{ marginRight: '0.5rem' }} />
                  Home
                </Link>
                
                {user.role === 'admin' && (
                  <>
                    <Link 
                      to="/admin/dashboard" 
                      className={`navbar-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                    >
                      <BarChart3 size={16} style={{ marginRight: '0.5rem' }} />
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/users" 
                      className={`navbar-link ${isActive('/admin/users') ? 'active' : ''}`}
                    >
                      <User size={16} style={{ marginRight: '0.5rem' }} />
                      Users
                    </Link>
                    <Link 
                      to="/admin/stores" 
                      className={`navbar-link ${isActive('/admin/stores') ? 'active' : ''}`}
                    >
                      <Store size={16} style={{ marginRight: '0.5rem' }} />
                      Stores
                    </Link>
                  </>
                )}
                
                {user.role === 'store_owner' && (
                  <Link 
                    to="/store-owner/dashboard" 
                    className={`navbar-link ${isActive('/store-owner/dashboard') ? 'active' : ''}`}
                  >
                    <BarChart3 size={16} style={{ marginRight: '0.5rem' }} />
                    Dashboard
                  </Link>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Welcome, {user.name}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container">
        {children}
      </main>
    </div>
  );
};

export default Layout;



