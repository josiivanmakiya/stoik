const mongoose = require('mongoose');
const { CREDIT_ENTRY_TYPE, CREDIT_ENTRY_SOURCE } = require('../../config/constants.js');

const creditLedgerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: Object.values(CREDIT_ENTRY_TYPE),
    required: true
  },
  source: {
    type: String,
    enum: Object.values(CREDIT_ENTRY_SOURCE),
    required: true
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator(value) {
        return Number.isFinite(value) && value !== 0;
      },
      message: 'amount must be a non-zero finite number'
    }
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  referenceType: {
    type: String,
    enum: ['return_request', 'invoice', 'subscription', 'manual'],
    default: 'manual'
  },
  referenceId: {
    type: String
  },
  description: {
    type: String,
    trim: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  collection: 'credit_ledger',
  versionKey: false
});

creditLedgerSchema.index({ userId: 1, createdAt: -1 });
creditLedgerSchema.index({ referenceType: 1, referenceId: 1 });

module.exports = mongoose.model('CreditLedger', creditLedgerSchema);
