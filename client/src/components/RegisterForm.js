import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (formData.name.length < 20 || formData.name.length > 60) {
      errors.name = 'Name must be between 20 and 60 characters';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email';
    }

    if (formData.password.length < 8 || formData.password.length > 16) {
      errors.password = 'Password must be between 8 and 16 characters';
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter and one special character';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.address.length > 400) {
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
    // Clear validation error for this field
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

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    
    if (result.success) {
      // Navigate based on user role
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (result.user.role === 'store_owner') {
        navigate('/store-owner/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <div className="card-header">
        <h2 className="card-title">Create Account</h2>
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
            placeholder="Enter your full name (20-60 characters)"
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
            rows="3"
            placeholder="Enter your address (max 400 characters)"
          />
          {validationErrors.address && (
            <div className="error-message">{validationErrors.address}</div>
          )}
        </div>
        
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
        
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <div className="error-message">{validationErrors.confirmPassword}</div>
          )}
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p style={{ color: '#6b7280' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;



