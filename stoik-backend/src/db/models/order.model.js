const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['plan'], default: 'plan' },
  itemRef: { type: String, required: true },
  planId: { type: String },
  color: { type: String, enum: ['white', 'grey', 'black'] },
  name: { type: String, required: true },
  category: { type: String },
  tooltip: { type: String },
  unitPrice: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  cadenceMonths: { type: Number, default: 1, min: 1, max: 6 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true, lowercase: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  cadenceMonths: { type: Number, default: 1, min: 1, max: 6 },
  currency: { type: String, default: 'NGN' },
  reference: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  items: [orderItemSchema],
  shipping: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  customer: {
    fullName: { type: String },
    phone: { type: String }
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'standard'],
    default: 'card'
  },
  provider: { type: String, default: 'paystack' },
  providerData: { type: Object },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }
}, {
  timestamps: true,
  collection: 'orders'
});

orderSchema.index({ reference: 1 });
orderSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
