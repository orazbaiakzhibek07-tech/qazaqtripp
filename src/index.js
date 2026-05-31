// QazaqTrip Backend — src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const passport = require('passport');

require('./middleware/passport')(passport);

const authRoutes  = require('./routes/auth');
const planRoutes  = require('./routes/plans');
const userRoutes  = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'qazaqtrip-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// ── Routes ──
app.use('/api/auth',  authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── Database ──
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/qazaqtrip')
  .then(() => {
    console.log('✅  MongoDB қосылды');
    app.listen(PORT, () => console.log(`🚀  Сервер http://localhost:${PORT} мекенжайында жұмыс істеуде`));
  })
  .catch(err => {
    console.error('❌  MongoDB қатесі:', err.message);
    process.exit(1);
  });

module.exports = app;
