import React, { useState, useEffect } from 'react';
import { Star, Search, Filter } from 'lucide-react';
import api from '../services/api';
import RatingModal from './RatingModal';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedStore, setSelectedStore] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [searchTerm, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await api.get(`/stores?${params}`);
      setStores(response.data.stores);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      await api.post('/ratings', { store_id: storeId, rating });
      fetchStores(); // Refresh the list
      setShowRatingModal(false);
      setSelectedStore(null);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search 
            size={16} 
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280'
            }}
          />
          <input
            type="text"
            placeholder="Search stores by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={16} style={{ color: '#6b7280' }} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Name</option>
            <option value="address">Address</option>
            <option value="average_rating">Rating</option>
            <option value="created_at">Date Added</option>
          </select>
          
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {stores.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              No stores found. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          stores.map((store) => (
            <div key={store.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '0.5rem', color: '#111827' }}>
                    {store.name}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    {store.address}
                  </p>
                  <div className="rating" style={{ marginBottom: '1rem' }}>
                    {renderStars(parseFloat(store.average_rating))}
                    <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
                      {parseFloat(store.average_rating).toFixed(1)} ({store.total_ratings} ratings)
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedStore(store);
                    setShowRatingModal(true);
                  }}
                  className="btn btn-primary"
                >
                  Rate Store
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showRatingModal && selectedStore && (
        <RatingModal
          store={selectedStore}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedStore(null);
          }}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default StoreList;



