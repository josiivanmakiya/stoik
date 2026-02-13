const mongoose = require('mongoose');

const bagItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['plan', 'consumable'],
    default: 'plan'
  },
  itemRef: {
    type: String,
    required: true,
    trim: true
  },
  planId: {
    type: String,
    required: false
  },
  consumableId: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  tooltip: {
    type: String
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  cadenceMonths: {
    type: Number,
    default: 1,
    min: 1,
    max: 6
  },
  unitsPerMonth: {
    type: Number,
    default: 1,
    min: 1
  }
}, { _id: false });

const bagSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  cadenceMonths: {
    type: Number,
    default: 1,
    min: 1,
    max: 6
  },
  items: [bagItemSchema],
  currency: { type: String, default: 'NGN' }
}, {
  timestamps: true,
  collection: 'bags'
});

bagSchema.index({ userId: 1 });

module.exports = mongoose.model('Bag', bagSchema);
