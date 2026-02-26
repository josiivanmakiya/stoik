const { connectDB } = require('../db/connection.js');
const Product = require('../db/models/product.model.js');
const Sku = require('../db/models/sku.model.js');
const Plan = require('../db/models/plan.model.js');
const logger = require('../config/logger');
const { LOG_ACTIONS } = require('../config/logActions');
const { STOIK_COLORS, STOIK_SIZES, STOIK_PLAN_RULES } = require('../config/constants.js');

const COLOR_CODE = {
  white: 'WHT',
  grey: 'GRY',
  black: 'BLK'
};

const seed = async () => {
  await connectDB();

  // Products
  const innerShirt = await Product.findOneAndUpdate(
    { productId: 'inner-shirt' },
    { name: 'Stoik Inner Shirt', description: 'White, grey, and black inner shirts for men', isActive: true },
    { upsert: true, new: true }
  );

  // SKUs
  const skuDocs = [];
  for (const color of STOIK_COLORS) {
    for (const packCount of STOIK_PLAN_RULES[color]) {
      for (const size of STOIK_SIZES) {
        const skuCode = `STK-${COLOR_CODE[color]}-${packCount}-${size}`;
        const sku = await Sku.findOneAndUpdate(
          { skuCode },
          { productId: innerShirt._id, size, color, packCount, isActive: true },
          { upsert: true, new: true }
        );
        skuDocs.push(sku);
      }
    }
  }

  // Plans
  const planSeed = [
    { planId: 'weekend-3', name: 'The Weekend-3', color: 'white', monthlyQuantity: 3, monthlyPrice: 15000 },
    { planId: 'executive-6', name: 'The Executive-6', color: 'white', monthlyQuantity: 6, monthlyPrice: 27000 },
    { planId: 'tropical-9', name: 'The Tropical-9', color: 'white', monthlyQuantity: 9, monthlyPrice: 39000 },
    { planId: 'invisible-2', name: 'The Invisible-2', color: 'grey', monthlyQuantity: 2, monthlyPrice: 12000 },
    { planId: 'midnight-2', name: 'The Midnight-2', color: 'black', monthlyQuantity: 2, monthlyPrice: 12000 }
  ];

  for (const plan of planSeed) {
    const includedSkus = skuDocs
      .filter((sku) => sku.color === plan.color && sku.packCount === plan.monthlyQuantity)
      .map((sku) => sku._id);

    await Plan.findOneAndUpdate(
      { planId: plan.planId },
      {
        ...plan,
        unitsPerMonth: plan.monthlyQuantity,
        description: plan.description || '',
        includedSkus,
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
