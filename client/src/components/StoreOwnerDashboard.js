import React, { useState, useEffect } from 'react';
import { Star, Users, BarChart3 } from 'lucide-react';
import api from '../services/api';

const StoreOwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      
      // Get user's store
      const userResponse = await api.get('/auth/profile');
      const userId = userResponse.data.user.id;
      
      // Find store owned by this user
      const storesResponse = await api.get('/admin/stores');
      const userStore = storesResponse.data.stores.find(s => s.owner_id === userId);
      
      if (userStore) {
        setStore(userStore);
        
        // Get ratings for this store
        const ratingsResponse = await api.get(`/ratings/store/${userStore.id}`);
        setRatings(ratingsResponse.data.ratings);
      }
    } catch (error) {
      console.error('Error fetching store data:', error);
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

  if (!store) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ color: '#6b7280', marginBottom: '1rem' }}>No Store Found</h2>
        <p style={{ color: '#6b7280' }}>
          You don't have a store assigned to your account. Please contact an administrator.
        </p>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="star" size={16} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="star" size={16} style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<Star key={i} className="star empty" size={16} />);
      }
    }

    return stars;
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#111827' }}>Store Owner Dashboard</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">{store.name}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <strong>Email:</strong> {store.email}
          </div>
          <div>
            <strong>Address:</strong> {store.address}
          </div>
          <div>
            <strong>Average Rating:</strong>
            <div className="rating" style={{ marginTop: '0.25rem' }}>
              {renderStars(parseFloat(store.average_rating))}
              <span style={{ marginLeft: '0.5rem' }}>
                {parseFloat(store.average_rating).toFixed(1)} ({store.total_ratings} ratings)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <BarChart3 size={32} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
          <div className="stat-number">{parseFloat(store.average_rating).toFixed(1)}</div>
          <div className="stat-label">Average Rating</div>
        </div>
        
        <div className="stat-card">
          <Users size={32} style={{ color: '#10b981', marginBottom: '1rem' }} />
          <div className="stat-number">{ratings.length}</div>
          <div className="stat-label">Total Ratings</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Ratings</h2>
        </div>
        
        {ratings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            No ratings yet. Encourage customers to rate your store!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.user_name}</td>
                    <td>{rating.user_email}</td>
                    <td>
                      <div className="rating">
                        {renderStars(rating.rating)}
                        <span style={{ marginLeft: '0.5rem' }}>
                          {rating.rating} star{rating.rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                    <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;



