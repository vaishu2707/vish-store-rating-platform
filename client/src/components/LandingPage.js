import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Store, Shield } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <nav style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(10px)',
        padding: '1rem 0',
        marginBottom: '2rem'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>
              Store Rating Platform
            </h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="btn btn-primary" style={{ background: 'white', color: '#667eea' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '3rem', 
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Rate & Review Stores
        </h1>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.9)', 
          fontSize: '1.25rem', 
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          Discover the best stores in your area and share your experiences with others. 
          Join our community of store reviewers today!
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ 
            padding: '1rem 2rem', 
            fontSize: '1.1rem',
            background: 'white',
            color: '#667eea'
          }}>
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ 
            padding: '1rem 2rem', 
            fontSize: '1.1rem',
            background: 'transparent',
            color: 'white',
            border: '2px solid white'
          }}>
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container" style={{ padding: '4rem 0' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          marginTop: '2rem'
        }}>
          <div className="card" style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            color: 'white'
          }}>
            <Star size={48} style={{ color: '#fbbf24', marginBottom: '1rem' }} />
            <h3>Rate Stores</h3>
            <p>Share your experiences by rating stores from 1 to 5 stars</p>
          </div>
          
          <div className="card" style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            color: 'white'
          }}>
            <Store size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
            <h3>Discover Stores</h3>
            <p>Find new stores in your area and see what others think</p>
          </div>
          
          <div className="card" style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            color: 'white'
          }}>
            <Users size={48} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
            <h3>Community</h3>
            <p>Join a community of store reviewers and share insights</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        background: 'rgba(0, 0, 0, 0.2)', 
        padding: '2rem 0', 
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        <div className="container">
          <p>&copy; 2024 Store Rating Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
