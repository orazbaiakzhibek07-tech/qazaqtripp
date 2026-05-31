// routes/auth.js
const express  = require('express');
const jwt      = require('jsonwebtoken');
const passport = require('passport');
const User     = require('../models/User');

const router = express.Router();
const JWT_SECRET  = process.env.JWT_SECRET || 'qazaqtrip-jwt-secret';
const CLIENT_URL  = process.env.CLIENT_URL || 'http://localhost:3000';

// Helper: sign token
const signToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/register ──
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Барлық өрістерді толтырыңыз' });

    if (password.length < 8)
      return res.status(400).json({ message: 'Құпиясөз кем дегенде 8 символ болуы керек' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Бұл email тіркелген' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password)
      return res.status(401).json({ message: 'Email немесе құпиясөз қате' });

    const valid = await user.comparePassword(password);
    if (!valid)
      return res.status(401).json({ message: 'Email немесе құпиясөз қате' });

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// ── GET /api/auth/me ──
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token жоқ' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'Пайдаланушы табылмады' });

    res.json({ user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch {
    res.status(401).json({ message: 'Token жарамсыз' });
  }
});

// ── GitHub OAuth ──
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${CLIENT_URL}/login.html` }),
  (req, res) => {
    const token = signToken(req.user._id);
    // Redirect to frontend with token in URL (frontend reads and stores it)
    res.redirect(`${CLIENT_URL}/plan.html?token=${token}&name=${encodeURIComponent(req.user.name)}`);
  }
);

// ── POST /api/auth/logout ──
router.post('/logout', (req, res) => {
  req.logout(() => res.json({ message: 'Шықтыңыз' }));
});

module.exports = router;
