const mongoose = require('mongoose');

const PLAN_IDS = ['core', 'premium', 'enterprise'];

const planSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
    enum: PLAN_IDS,
    trim: true,
    lowercase: true,
    immutable: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  monthlyPrice: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isFinite,
      message: 'monthlyPrice must be a finite number'
    }
  },
  unitsPerMonth: {
    type: Number,
    default: 1,
    min: 1
  },
  description: {
    type: String,
    trim: true
  },
  includedSkus: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sku'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'plans',
  versionKey: false
});

planSchema.path('includedSkus').validate(function(value) {
  if (!Array.isArray(value)) return false;
  const uniqueCount = new Set(value.map((id) => String(id))).size;
  return uniqueCount === value.length;
}, 'includedSkus must not contain duplicates');

planSchema.index({ isActive: 1 });

module.exports = mongoose.model('Plan', planSchema);
