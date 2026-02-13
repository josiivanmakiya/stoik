const mongoose = require('mongoose');

const skuSchema = new mongoose.Schema({
  skuCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    immutable: true
  },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true, trim: true, uppercase: true },
  color: { type: String, required: true, trim: true, lowercase: true },
  packCount: { type: Number, default: 1, min: 1 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'skus',
  versionKey: false
});

skuSchema.index({ productId: 1, isActive: 1 });
skuSchema.index(
  { productId: 1, size: 1, color: 1, packCount: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

module.exports = mongoose.model('Sku', skuSchema);
