const mongoose = require('mongoose');

const consumableSchema = new mongoose.Schema({
  consumableId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  tooltip: {
    type: String,
    trim: true
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  defaultCadenceMonths: {
    type: Number,
    default: 1,
    min: 1,
    max: 6
  },
  allowedCadenceMonths: [{
    type: Number,
    min: 1,
    max: 6
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'consumables'
});

consumableSchema.pre('save', function(next) {
  if (!Array.isArray(this.allowedCadenceMonths) || !this.allowedCadenceMonths.length) {
    this.allowedCadenceMonths = [1, 2, 3, 4, 5, 6];
  }

  const uniqueCadence = Array.from(new Set(this.allowedCadenceMonths.map((value) => Number(value))))
    .filter((value) => value >= 1 && value <= 6)
    .sort((a, b) => a - b);

  this.allowedCadenceMonths = uniqueCadence.length ? uniqueCadence : [1, 2, 3, 4, 5, 6];

  if (!this.allowedCadenceMonths.includes(this.defaultCadenceMonths)) {
    this.defaultCadenceMonths = this.allowedCadenceMonths[0];
  }

  next();
});

consumableSchema.index({ consumableId: 1 });
consumableSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Consumable', consumableSchema);