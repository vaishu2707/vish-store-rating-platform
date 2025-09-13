const express = require('express');
const pool = require('../config/database');
const { ratingValidation, handleValidationErrors } = require('../middleware/validation');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Submit or update rating (authenticated users)
router.post('/', authenticateToken, ratingValidation, handleValidationErrors, async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const [storeResult] = await pool.execute(
      'SELECT id FROM stores WHERE id = ?',
      [store_id]
    );

    if (storeResult.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already rated this store
    const [existingRating] = await pool.execute(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, store_id]
    );

    if (existingRating.length > 0) {
      // Update existing rating
      await pool.execute(
        'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
        [rating, userId, store_id]
      );

      const [updatedRating] = await pool.execute(
        'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
        [userId, store_id]
      );

      res.json({
        message: 'Rating updated successfully',
        rating: updatedRating[0]
      });
    } else {
      // Create new rating
      const [result] = await pool.execute(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
        [userId, store_id, rating]
      );

      const [newRating] = await pool.execute(
        'SELECT * FROM ratings WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json({
        message: 'Rating submitted successfully',
        rating: newRating[0]
      });
    }
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's rating for a specific store
router.get('/user/:storeId', authenticateToken, async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const [result] = await pool.execute(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (result.length === 0) {
      return res.json({ rating: null });
    }

    res.json({ rating: result[0] });
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all ratings for a store (store owner only)
router.get('/store/:storeId', authenticateToken, requireRole(['store_owner', 'admin']), async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    // Check if user is store owner or admin
    if (req.user.role === 'store_owner') {
      const [storeResult] = await pool.execute(
        'SELECT owner_id FROM stores WHERE id = ?',
        [storeId]
      );

      if (storeResult.length === 0) {
        return res.status(404).json({ message: 'Store not found' });
      }

      if (storeResult[0].owner_id !== userId) {
        return res.status(403).json({ message: 'Access denied. You can only view ratings for your own store.' });
      }
    }

    const [result] = await pool.execute(
      `SELECT r.*, u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );

    res.json({ ratings: result });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete rating (user can delete their own rating)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if rating exists and belongs to user
    const [ratingResult] = await pool.execute(
      'SELECT id FROM ratings WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (ratingResult.length === 0) {
      return res.status(404).json({ message: 'Rating not found or access denied' });
    }

    await pool.execute(
      'DELETE FROM ratings WHERE id = ?',
      [id]
    );

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
