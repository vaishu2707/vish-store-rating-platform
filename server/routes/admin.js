const express = require('express');
const pool = require('../config/database');
const { userValidation, handleValidationErrors } = require('../middleware/validation');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics (admin only)
router.get('/dashboard', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    // Get total users
    const [usersResult] = await pool.execute('SELECT COUNT(*) as total_users FROM users');
    
    // Get total stores
    const [storesResult] = await pool.execute('SELECT COUNT(*) as total_stores FROM stores');
    
    // Get total ratings
    const [ratingsResult] = await pool.execute('SELECT COUNT(*) as total_ratings FROM ratings');

    res.json({
      total_users: parseInt(usersResult[0].total_users),
      total_stores: parseInt(storesResult[0].total_stores),
      total_ratings: parseInt(ratingsResult[0].total_ratings)
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all users with filtering and sorting (admin only)
router.get('/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { search, role, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
    const queryParams = [];
    let paramCount = 0;

    if (search) {
      query += ` AND (name LIKE ? OR email LIKE ? OR address LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (role) {
      query += ` AND role = ?`;
      queryParams.push(role);
    }

    // Add sorting
    const validSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortField} ${order}`;

    const [result] = await pool.execute(query, queryParams);
    res.json({ users: result });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all stores with filtering and sorting (admin only)
router.get('/stores', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    let query = `
      SELECT s.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings,
             u.name as owner_name
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN users u ON s.owner_id = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCount = 0;

    if (search) {
      query += ` AND (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY s.id, u.name`;

    // Add sorting
    const validSortFields = ['name', 'email', 'address', 'average_rating', 'created_at'];
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

// Create new user (admin only)
router.post('/users', authenticateToken, requireRole(['admin']), userValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, password, address, role = 'user' } = req.body;

    // Check if user already exists
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    const [newUser] = await pool.execute(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: newUser[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user details by ID (admin only)
router.get('/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];

    // If user is a store owner, get their store rating
    if (user.role === 'store_owner') {
      const [storeResult] = await pool.execute(
        `SELECT s.id, s.name, COALESCE(AVG(r.rating), 0) as average_rating
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = ?
         GROUP BY s.id, s.name`,
        [id]
      );

      user.store_rating = storeResult[0]?.average_rating || 0;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user (admin only)
router.put('/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role } = req.body;

    // Check if user exists
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    const [emailCheck] = await pool.execute(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (emailCheck.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    await pool.execute(
      'UPDATE users SET name = ?, email = ?, address = ?, role = ? WHERE id = ?',
      [name, email, address, role, id]
    );

    const [updatedUser] = await pool.execute(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
      [id]
    );

    res.json({
      message: 'User updated successfully',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
