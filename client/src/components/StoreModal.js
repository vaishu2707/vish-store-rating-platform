import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const StoreModal = ({ store, mode, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: ''
  });
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchOwners();
    
    if (store && mode !== 'create') {
      setFormData({
        name: store.name || '',
        email: store.email || '',
        address: store.address || '',
        owner_id: store.owner_id || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        address: '',
        owner_id: ''
      });
    }
    setError('');
    setValidationErrors({});
  }, [store, mode]);

  const fetchOwners = async () => {
    try {
      const response = await api.get('/admin/users?role=store_owner');
      setOwners(response.data.users);
    } catch (error) {
      console.error('Error fetching owners:', error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Store name is required';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address.length > 400) {
      errors.address = 'Address must not exceed 400 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        owner_id: formData.owner_id || null
      };

      if (mode === 'create') {
        await api.post('/stores', submitData);
      } else if (mode === 'edit') {
        await api.put(`/stores/${store.id}`, submitData);
      }
      
      onSave();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '90%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          <X size={20} />
        </button>

        <div className="card-header">
          <h3 className="card-title">
            {mode === 'create' ? 'Create Store' : mode === 'edit' ? 'Edit Store' : 'Store Details'}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Store Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${validationErrors.name ? 'error' : ''}`}
              required
              readOnly={isReadOnly}
              placeholder="Enter store name"
            />
            {validationErrors.name && (
              <div className="error-message">{validationErrors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${validationErrors.email ? 'error' : ''}`}
              required
              readOnly={isReadOnly}
              placeholder="Enter store email"
            />
            {validationErrors.email && (
              <div className="error-message">{validationErrors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`form-input ${validationErrors.address ? 'error' : ''}`}
              required
              readOnly={isReadOnly}
              rows="3"
              placeholder="Enter store address (max 400 characters)"
            />
            {validationErrors.address && (
              <div className="error-message">{validationErrors.address}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="owner_id" className="form-label">
              Store Owner (Optional)
            </label>
            <select
              id="owner_id"
              name="owner_id"
              value={formData.owner_id}
              onChange={handleChange}
              className="form-input"
              disabled={isReadOnly}
            >
              <option value="">No Owner</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
          </div>

          {!isReadOnly && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? 'Saving...' : mode === 'create' ? 'Create Store' : 'Update Store'}
              </button>
            </div>
          )}

          {isReadOnly && (
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StoreModal;



