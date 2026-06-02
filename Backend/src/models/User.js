// models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');


const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },         // null for GitHub 
  githubId: { type: String, default: null },
  avatar:   { type: String, default: null },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt:{ type: Date, default: Date.now },
});

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
UserSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
