const mongoose = require('mongoose');
const { RETURN_PICKUP_STATUS } = require('../../config/constants.js');

const makeRequestId = () => `RR_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const returnRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    default: makeRequestId,
    immutable: true,
    uppercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  garmentIds: [{
    type: String,
    required: true,
    uppercase: true,
    trim: true
  }],
  pickupStatus: {
    type: String,
    enum: Object.values(RETURN_PICKUP_STATUS),
    default: RETURN_PICKUP_STATUS.SCHEDULED
  },
  potentialCredit: {
    type: Number,
    default: 0,
    min: 0
  },
  approvedCredit: {
    type: Number,
    default: 0,
    min: 0
  },
  scheduledPickupAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'return_requests',
  versionKey: false
});

returnRequestSchema.path('garmentIds').validate((value) => {
  if (!Array.isArray(value) || !value.length) return false;
  return new Set(value.map((id) => String(id))).size === value.length;
}, 'garmentIds must be a non-empty unique list');

returnRequestSchema.index({ requestId: 1 }, { unique: true });
returnRequestSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
