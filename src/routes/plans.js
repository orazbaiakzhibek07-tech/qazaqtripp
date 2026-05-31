// routes/plans.js
const express = require('express');
const jwt     = require('jsonwebtoken');
const Plan    = require('../models/Plan');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'qazaqtrip-jwt-secret';

// ── Auth middleware ──
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Token жоқ' });
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token жарамсыз' });
  }
}

// ── GET /api/plans  — менің жоспарларым ──
router.get('/', auth, async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('-days');   // list view, no heavy days array
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// ── POST /api/plans  — жаңа жоспар сақтау ──
router.post('/', auth, async (req, res) => {
  try {
    const { title, from, to, days, numDays, numPeople, budget, budgetBreak } = req.body;

    if (!title || !from || !to)
      return res.status(400).json({ message: 'Міндетті өрістерді толтырыңыз' });

    const plan = await Plan.create({
      user: req.user.id, title, from, to,
      days: days || [], numDays, numPeople,
      budget, budgetBreak
    });

    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// ── GET /api/plans/:id  — бір жоспар ──
router.get('/:id', auth, async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user.id });
    if (!plan) return res.status(404).json({ message: 'Жоспар табылмады' });
    res.json(plan);
  } catch {
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// ── PUT /api/plans/:id  — жоспарды өзгерту ──
router.put('/:id', auth, async (req, res) => {
  try {
    const plan = await Plan.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ message: 'Жоспар табылмады' });
    res.json(plan);
  } catch {
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// ── DELETE /api/plans/:id  — жоспарды жою ──
router.delete('/:id', auth, async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!plan) return res.status(404).json({ message: 'Жоспар табылмады' });
    res.json({ message: 'Жоспар жойылды' });
  } catch {
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

module.exports = router;
