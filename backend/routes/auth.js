const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user (DISABLED)
router.post('/register', async (req, res) => {
  return res.status(403).json({ error: 'Registration is disabled on this server.' });
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate request
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // 2. Check for user in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Generate & return JWT
    const payload = { userId: user._id };
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: { id: user._id, email: user.email } 
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
