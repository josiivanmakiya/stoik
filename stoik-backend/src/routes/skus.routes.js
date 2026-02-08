const express = require('express');
const Sku = require('../db/models/sku.model.js');
const Product = require('../db/models/product.model.js');
const { authenticateToken, requireAdmin } = require('../domain/auth/auth.middleware.js');

const router = express.Router();

// Public: list active skus (optionally by productId)
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.productId) {
      const product = await Product.findOne({ productId: req.query.productId });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      filter.productId = product._id;
    }
    const skus = await Sku.find(filter).populate('productId', 'productId name');
    res.json(skus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: create sku
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { skuCode, productId, size, color, packCount } = req.body;
  if (!skuCode || !productId || !size || !color) {
    return res.status(400).json({ error: 'Missing required fields: skuCode, productId, size, color' });
  }

  try {
    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const existing = await Sku.findOne({ skuCode });
    if (existing) return res.status(409).json({ error: 'SKU already exists' });

    const sku = await Sku.create({
      skuCode,
      productId: product._id,
      size,
      color,
      packCount: packCount || 1
    });
    res.status(201).json(sku);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: deactivate sku
router.patch('/:skuCode/deactivate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sku = await Sku.findOneAndUpdate(
      { skuCode: req.params.skuCode },
      { isActive: false },
      { new: true }
    );
    if (!sku) return res.status(404).json({ error: 'SKU not found' });
    res.json(sku);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
