const express = require('express');
const pool = require('../config/database');
const { storeValidation, handleValidationErrors } = require('../middleware/validation');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all stores (public)
router.get('/', async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    let query = `
      SELECT s.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    
    const queryParams = [];
    let paramCount = 0;

    if (search) {
      query += ` WHERE (s.name LIKE ? OR s.address LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY s.id`;

    // Add sorting
    const validSortFields = ['name', 'address', 'average_rating', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortField} ${order}`;

    const [result] = await pool.execute(query, queryParams);
    res.json({ stores: result });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get store by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      `SELECT s.*, 
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(r.id) as total_ratings
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.id = ?
       GROUP BY s.id`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json({ store: result[0] });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new store (admin only)
router.post('/', authenticateToken, requireRole(['admin']), storeValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    // Check if store email already exists
    const [existingStore] = await pool.execute(
      'SELECT id FROM stores WHERE email = ?',
      [email]
    );

    if (existingStore.length > 0) {
      return res.status(400).json({ message: 'Store with this email already exists' });
    }

    // If owner_id is provided, verify the user exists and is a store owner
    if (owner_id) {
      const [ownerResult] = await pool.execute(
        'SELECT id, role FROM users WHERE id = ?',
        [owner_id]
      );

      if (ownerResult.length === 0) {
        return res.status(400).json({ message: 'Owner not found' });
      }

      if (ownerResult[0].role !== 'store_owner') {
        return res.status(400).json({ message: 'Owner must be a store owner' });
      }
    }

    const [result] = await pool.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id || null]
    );

    const [newStore] = await pool.execute(
      'SELECT * FROM stores WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: newStore[0]
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update store (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), storeValidation, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, owner_id } = req.body;

    // Check if store exists
    const [existingStore] = await pool.execute(
      'SELECT id FROM stores WHERE id = ?',
      [id]
    );

    if (existingStore.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if email is already taken by another store
    const [emailCheck] = await pool.execute(
      'SELECT id FROM stores WHERE email = ? AND id != ?',
      [email, id]
    );

    if (emailCheck.length > 0) {
      return res.status(400).json({ message: 'Store with this email already exists' });
    }

    // If owner_id is provided, verify the user exists and is a store owner
    if (owner_id) {
      const [ownerResult] = await pool.execute(
        'SELECT id, role FROM users WHERE id = ?',
        [owner_id]
      );

      if (ownerResult.length === 0) {
        return res.status(400).json({ message: 'Owner not found' });
      }

      if (ownerResult[0].role !== 'store_owner') {
        return res.status(400).json({ message: 'Owner must be a store owner' });
      }
    }

    await pool.execute(
      'UPDATE stores SET name = ?, email = ?, address = ?, owner_id = ? WHERE id = ?',
      [name, email, address, owner_id || null, id]
    );

    const [updatedStore] = await pool.execute(
      'SELECT * FROM stores WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Store updated successfully',
      store: updatedStore[0]
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete store (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM stores WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
