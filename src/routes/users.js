// routes/users.js
const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'qazaqtrip-jwt-secret';

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Token жоқ' });
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token жарамсыз' });
  }
}

// GET /api/users/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Табылмады' });
    res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar, createdAt: user.createdAt });
  } catch {
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// PATCH /api/users/profile — update name/avatar
router.patch('/profile', auth, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...(name && { name }), ...(avatar && { avatar }) },
      { new: true }
    );
    res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar });
  } catch {
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

module.exports = router;
