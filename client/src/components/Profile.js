import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Save } from 'lucide-react';

const Profile = () => {
  const { user, updatePassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8 || passwordData.newPassword.length > 16) {
      errors.newPassword = 'Password must be between 8 and 16 characters';
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter and one special character';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updatePassword(passwordData.newPassword);
      
      if (result.success) {
        setSuccess('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred while updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#111827' }}>Profile</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Account Information</h2>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <strong>Name:</strong> {user?.name}
          </div>
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
          <div>
            <strong>Address:</strong> {user?.address}
          </div>
          <div>
            <strong>Role:</strong> 
            <span style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              marginLeft: '0.5rem',
              backgroundColor: user?.role === 'admin' ? '#ef4444' : user?.role === 'store_owner' ? '#10b981' : '#6b7280',
              color: 'white'
            }}>
              {user?.role?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div>
            <strong>Member Since:</strong> {new Date(user?.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Change Password</h2>
        </div>
        
        <form onSubmit={handlePasswordSubmit}>
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              Current Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={`form-input ${validationErrors.currentPassword ? 'error' : ''}`}
                required
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
            {validationErrors.currentPassword && (
              <div className="error-message">{validationErrors.currentPassword}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className={`form-input ${validationErrors.newPassword ? 'error' : ''}`}
              required
              placeholder="8-16 characters, uppercase + special character"
            />
            {validationErrors.newPassword && (
              <div className="error-message">{validationErrors.newPassword}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
              required
            />
            {validationErrors.confirmPassword && (
              <div className="error-message">{validationErrors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            <Save size={16} style={{ marginRight: '0.5rem' }} />
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;



