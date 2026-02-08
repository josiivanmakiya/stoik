const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'products'
});

productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
