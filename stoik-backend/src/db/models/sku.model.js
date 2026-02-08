const mongoose = require('mongoose');

const skuSchema = new mongoose.Schema({
  skuCode: { type: String, required: true, unique: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  packCount: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'skus'
});

skuSchema.index({ productId: 1, isActive: 1 });

module.exports = mongoose.model('Sku', skuSchema);
