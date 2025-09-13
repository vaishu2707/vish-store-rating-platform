import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Star } from 'lucide-react';
import api from '../services/api';
import StoreModal from './StoreModal';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'

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

      const response = await api.get(`/admin/stores?${params}`);
      setStores(response.data.stores);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = () => {
    setSelectedStore(null);
    setModalMode('create');
    setShowStoreModal(true);
  };

  const handleEditStore = (store) => {
    setSelectedStore(store);
    setModalMode('edit');
    setShowStoreModal(true);
  };

  const handleViewStore = (store) => {
    setSelectedStore(store);
    setModalMode('view');
    setShowStoreModal(true);
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await api.delete(`/stores/${storeId}`);
        fetchStores();
      } catch (error) {
        console.error('Error deleting store:', error);
        alert('Failed to delete store');
      }
    }
  };

  const handleStoreSaved = () => {
    setShowStoreModal(false);
    fetchStores();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="star" size={14} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="star" size={14} style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<Star key={i} className="star empty" size={14} />);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#111827' }}>Store Management</h1>
        <button onClick={handleCreateStore} className="btn btn-primary">
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Add Store
        </button>
      </div>

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
            placeholder="Search stores by name, email, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        
        <div className="filter-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="average_rating">Rating</option>
            <option value="created_at">Date Created</option>
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

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Owner</th>
                <th>Rating</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    No stores found
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id}>
                    <td>{store.name}</td>
                    <td>{store.email}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {store.address}
                    </td>
                    <td>{store.owner_name || 'No Owner'}</td>
                    <td>
                      <div className="rating">
                        {renderStars(parseFloat(store.average_rating))}
                        <span style={{ marginLeft: '0.25rem', color: '#6b7280' }}>
                          {parseFloat(store.average_rating).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td>{new Date(store.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleViewStore(store)}
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleEditStore(store)}
                          className="btn btn-primary"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteStore(store.id)}
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showStoreModal && (
        <StoreModal
          store={selectedStore}
          mode={modalMode}
          onClose={() => setShowStoreModal(false)}
          onSave={handleStoreSaved}
        />
      )}
    </div>
  );
};

export default StoreManagement;



