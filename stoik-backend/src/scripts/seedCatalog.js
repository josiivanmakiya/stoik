const { connectDB } = require('../db/connection.js');
const Product = require('../db/models/product.model.js');
const Sku = require('../db/models/sku.model.js');
const Plan = require('../db/models/plan.model.js');
const logger = require('../config/logger');
const { LOG_ACTIONS } = require('../config/logActions');

const seed = async () => {
  await connectDB();

  // Products
  const innerShirt = await Product.findOneAndUpdate(
    { productId: 'inner-shirt' },
    { name: 'White Inner Shirt', description: 'Stoik core innerwear', isActive: true },
    { upsert: true, new: true }
  );

  // SKUs
  const sizes = ['S', 'M', 'L', 'XL'];
  const skuDocs = [];
  for (const size of sizes) {
    const skuCode = `WS-${size}`;
    const sku = await Sku.findOneAndUpdate(
      { skuCode },
      { productId: innerShirt._id, size, color: 'white', packCount: 1, isActive: true },
      { upsert: true, new: true }
    );
    skuDocs.push(sku);
  }

  // Plans
  const planSeed = [
    { planId: 'core', name: 'Core', monthlyPrice: 6500, unitsPerMonth: 1 },
    { planId: 'premium', name: 'Premium', monthlyPrice: 9800, unitsPerMonth: 2 },
    { planId: 'enterprise', name: 'Enterprise', monthlyPrice: 13500, unitsPerMonth: 3 }
  ];

  for (const plan of planSeed) {
    await Plan.findOneAndUpdate(
      { planId: plan.planId },
      {
        ...plan,
        description: plan.description || '',
        includedSkus: skuDocs.map((sku) => sku._id),
        isActive: true
      },
      { upsert: true, new: true }
    );
  }

  logger.info(LOG_ACTIONS.CATALOG_SEEDED, { products: 1, skus: skuDocs.length, plans: planSeed.length });
  process.exit(0);
};

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Seed failed', err);
  process.exit(1);
});
