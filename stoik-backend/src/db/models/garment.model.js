const mongoose = require('mongoose');
const { GARMENT_STATUS, STOIK_COLORS } = require('../../config/constants.js');

const garmentSchema = new mongoose.Schema({
  garmentId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  skuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sku',
    required: true
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  returnRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReturnRequest'
  },
  colorSnapshot: {
    type: String,
    enum: STOIK_COLORS
  },
  deliveredAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: Object.values(GARMENT_STATUS),
    default: GARMENT_STATUS.ACTIVE
  },
  conditionGrade: {
    type: String,
    enum: ['A', 'B', 'C', 'reject']
  }
}, {
  timestamps: true,
  collection: 'garments',
  versionKey: false
});

garmentSchema.index({ garmentId: 1 }, { unique: true });
garmentSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Garment', garmentSchema);
