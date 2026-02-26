const mongoose = require('mongoose');
const { STOIK_COLORS, STOIK_SIZES } = require('../../config/constants.js');
const { isValidColorQuantity } = require('../../domain/plans/planRules.js');

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
  size: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    enum: STOIK_SIZES
  },
  color: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: STOIK_COLORS
  },
  packCount: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator(value) {
        return isValidColorQuantity(this.color, value);
      },
      message: 'packCount is not allowed for this color'
    }
  },
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
