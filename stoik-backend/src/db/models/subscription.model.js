const mongoose = require('mongoose');

const { SUBSCRIPTION_STATUS } = require('../../config/constants.js');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    planId: {
      type: String,
      required: true,
      trim: true
    },
    cadenceMonths: {
      type: Number,
      default: 1,
      min: 1,
      max: 6
    },
    status: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.INACTIVE,
      index: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    nextBillingDate: { type: Date },
    commitmentEndDate: { type: Date },
    priceLocked: { type: Boolean, default: false },
    bagSnapshot: { type: [mongoose.Schema.Types.Mixed], default: [] },
    // Optional Paystack metadata for sync/exports
    planName: { type: String },
    paystackPlanCode: { type: String, index: true },
    paystackSubscriptionCode: { type: String, index: true },
    paystackEmailToken: { type: String },
    authorizationCode: { type: String },
    cancelledAt: { type: Date },
    metadata: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1, status: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
