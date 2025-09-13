import React, { useState, useEffect } from 'react';
import { Users, Store, Star, BarChart3 } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_stores: 0,
    total_ratings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#111827' }}>Admin Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <Users size={32} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
          <div className="stat-number">{stats.total_users}</div>
          <div className="stat-label">Total Users</div>
        </div>
        
        <div className="stat-card">
          <Store size={32} style={{ color: '#10b981', marginBottom: '1rem' }} />
          <div className="stat-number">{stats.total_stores}</div>
          <div className="stat-label">Total Stores</div>
        </div>
        
        <div className="stat-card">
          <Star size={32} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
          <div className="stat-number">{stats.total_ratings}</div>
          <div className="stat-label">Total Ratings</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <a href="/admin/users" className="btn btn-primary" style={{ textAlign: 'center', padding: '1rem' }}>
            <Users size={20} style={{ marginBottom: '0.5rem' }} />
            <div>Manage Users</div>
          </a>
          <a href="/admin/stores" className="btn btn-primary" style={{ textAlign: 'center', padding: '1rem' }}>
            <Store size={20} style={{ marginBottom: '0.5rem' }} />
            <div>Manage Stores</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



