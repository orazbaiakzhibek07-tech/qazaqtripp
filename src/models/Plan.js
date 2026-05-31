// models/Plan.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  time: String,
  name: String,
  desc: String,
  tag:  { type: String, enum: ['food', 'sight', 'hotel', 'transport'] },
}, { _id: false });

const DaySchema = new mongoose.Schema({
  dayNum:     Number,
  title:      String,
  desc:       String,
  activities: [ActivitySchema],
}, { _id: false });

const PlanSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  from:        { type: String, required: true },
  to:          { type: String, required: true },
  days:        [DaySchema],
  numDays:     Number,
  numPeople:   Number,
  budget:      { type: Number, default: 0 },
  budgetBreak: {
    hotel:      Number,
    food:       Number,
    transport:  Number,
    activities: Number,
  },
  isPublic:   { type: Boolean, default: false },
  createdAt:  { type: Date, default: Date.now },
  updatedAt:  { type: Date, default: Date.now },
});

PlanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Plan', PlanSchema);
