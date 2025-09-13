import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const UserModal = ({ user, mode, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user && mode !== 'create') {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        password: '',
        role: user.role || 'user'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        address: '',
        password: '',
        role: 'user'
      });
    }
    setError('');
    setValidationErrors({});
  }, [user, mode]);

  const validateForm = () => {
    const errors = {};

    if (formData.name.length < 20 || formData.name.length > 60) {
      errors.name = 'Name must be between 20 and 60 characters';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email';
    }

    if (formData.address.length > 400) {
      errors.address = 'Address must not exceed 400 characters';
    }

    if (mode === 'create' && (!formData.password || formData.password.length < 8 || formData.password.length > 16)) {
      errors.password = 'Password must be between 8 and 16 characters';
    } else if (mode === 'create' && formData.password && !/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter and one special character';
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
      if (mode === 'create') {
        await api.post('/admin/users', formData);
      } else if (mode === 'edit') {
        const { password, ...updateData } = formData;
        await api.put(`/admin/users/${user.id}`, updateData);
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
            {mode === 'create' ? 'Create User' : mode === 'edit' ? 'Edit User' : 'User Details'}
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
              Full Name
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
              placeholder="Enter full name (20-60 characters)"
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
              placeholder="Enter address (max 400 characters)"
            />
            {validationErrors.address && (
              <div className="error-message">{validationErrors.address}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              required
              disabled={isReadOnly}
            >
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {mode === 'create' && (
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${validationErrors.password ? 'error' : ''}`}
                  required
                  placeholder="8-16 characters, uppercase + special character"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {validationErrors.password && (
                <div className="error-message">{validationErrors.password}</div>
              )}
            </div>
          )}

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
                {loading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
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

export default UserModal;



