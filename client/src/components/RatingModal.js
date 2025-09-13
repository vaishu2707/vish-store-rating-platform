import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import api from '../services/api';

const RatingModal = ({ store, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserRating();
  }, [store.id]);

  const fetchUserRating = async () => {
    try {
      const response = await api.get(`/ratings/user/${store.id}`);
      if (response.data.rating) {
        setRating(response.data.rating.rating);
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(store.id, rating);
    } catch (error) {
      setError('Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
        >
          <Star
            className={i <= (hoverRating || rating) ? 'star' : 'star empty'}
            size={24}
          />
        </button>
      );
    }
    return stars;
  };

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
      <div className="card" style={{ maxWidth: '400px', width: '90%', position: 'relative' }}>
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
          <h3 className="card-title">Rate {store.name}</h3>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            {store.address}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ marginBottom: '1rem', color: '#374151' }}>
              How would you rate this store?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {renderStars()}
            </div>
            {rating > 0 && (
              <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                {rating} star{rating !== 1 ? 's' : ''}
              </p>
            )}
          </div>

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
              disabled={loading || rating === 0}
            >
              {loading ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;



