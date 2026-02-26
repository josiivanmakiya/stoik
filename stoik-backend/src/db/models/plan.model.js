const mongoose = require('mongoose');
const { STOIK_COLORS } = require('../../config/constants.js');
const { isValidColorQuantity } = require('../../domain/plans/planRules.js');

const planSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
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
  color: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: STOIK_COLORS
  },
  monthlyQuantity: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator(value) {
        return isValidColorQuantity(this.color, value);
      },
      message: 'monthlyQuantity is not allowed for this color'
    }
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

planSchema.pre('validate', function(next) {
  if (!this.unitsPerMonth && this.monthlyQuantity) {
    this.unitsPerMonth = this.monthlyQuantity;
  }
  if (!this.monthlyQuantity && this.unitsPerMonth) {
    this.monthlyQuantity = this.unitsPerMonth;
  }
  next();
});

planSchema.index({ isActive: 1 });

module.exports = mongoose.model('Plan', planSchema);
