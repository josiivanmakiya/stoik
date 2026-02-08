const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
    enum: ['core', 'premium', 'enterprise']
  },
  name: {
    type: String,
    required: true
  },
  monthlyPrice: {
    type: Number,
    required: true,
    min: 0
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
  collection: 'plans'
});

planSchema.index({ planId: 1 });
planSchema.index({ isActive: 1 });

module.exports = mongoose.model('Plan', planSchema);
