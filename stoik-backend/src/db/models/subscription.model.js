const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: String,
    required: true,
    enum: ['core', 'premium', 'enterprise'] // Add more plans as needed
  },
  status: {
    type: String,
    enum: ['inactive', 'active', 'paused', 'cancelled', 'expired'],
    default: 'inactive',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  nextBillingDate: {
    type: Date,
    required: true
  },
  commitmentEndDate: {
    type: Date,
    default: null
  },
  priceLocked: {
    type: Boolean,
    default: false
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  pauseReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'subscriptions'
});

// Indexes for performance
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ nextBillingDate: 1, status: 1 });
subscriptionSchema.index({ status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
