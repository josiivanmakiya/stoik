import { USE_MOCK } from './config.js';
import { apiRequest } from './apiClient.js';

const fallbackConsumables = [
  {
    consumableId: 'toothbrush-heads',
    name: 'Toothbrushes / Brush Heads',
    category: 'personal-care-hygiene',
    tooltip: 'Brush 2x daily for 2 minutes; replace every 3 months as bristles fray.',
    unitPrice: 6000,
    defaultCadenceMonths: 3
  },
  {
    consumableId: 'toothpaste',
    name: 'Toothpaste',
    category: 'personal-care-hygiene',
    tooltip: 'Pea-size dab, brush 2 minutes; tube empties in around 30 days.',
    unitPrice: 2500,
    defaultCadenceMonths: 1
  },
  {
    consumableId: 'interdental-flossers',
    name: 'Flossers / Interdental Brushes',
    category: 'personal-care-hygiene',
    tooltip: 'Floss nightly between teeth; refills generally last around 2 months.',
    unitPrice: 2200,
    defaultCadenceMonths: 2
  },
  {
    consumableId: 'tp-paper-towels-napkins',
    name: 'TP / Paper Towels / Napkins',
    category: 'household-cleaning-paper',
    tooltip: 'Wipe and dry daily; rolls steadily dwindle with regular use.',
    unitPrice: 6500,
    defaultCadenceMonths: 1
  }
];

const TARGET_CONSUMABLE_COUNT = 120;
const CATEGORY_DEFS = [
  {
    key: 'personal-care-hygiene',
    names: [
      'Toothpaste',
      'Mouthwash',
      'Body Wash',
      'Face Cleanser',
      'Shampoo',
      'Conditioner',
      'Deodorant',
      'Hand Soap',
      'Floss Picks',
      'Cotton Pads'
    ]
  },
  {
    key: 'household-cleaning-paper',
    names: [
      'Toilet Tissue',
      'Paper Towels',
      'Napkins',
      'Dish Soap',
      'Laundry Detergent',
      'Fabric Softener',
      'Glass Cleaner',
      'Disinfectant Spray',
      'Trash Bags',
      'Sponges'
    ]
  },
  {
    key: 'food-kitchen-staples',
    names: [
      'Cooking Oil',
      'Rice',
      'Pasta',
      'Salt',
      'Sugar',
      'Breakfast Oats',
      'Tea Bags',
      'Coffee',
      'Canned Tomatoes',
      'Tomato Paste'
    ]
  },
  {
    key: 'clothing-accessories',
    names: [
      'Socks',
      'Undershirts',
      'Underwear',
      'Laundry Pods',
      'Stain Remover',
      'Lint Roller',
      'Shoe Wipes',
      'Shoe Insoles',
      'Collar Stays',
      'Clothing Tape'
    ]
  },
  {
    key: 'pet-care',
    names: [
      'Pet Food',
      'Pet Treats',
      'Pet Shampoo',
      'Poop Bags',
      'Litter Refills',
      'Pet Wipes',
      'Pet Dental Chews',
      'Pet Odor Neutralizer',
      'Flea Wipes',
      'Pet Pads'
    ]
  },
  {
    key: 'office-misc',
    names: [
      'Printer Paper',
      'Pens',
      'Sticky Notes',
      'Marker Set',
      'AA Batteries',
      'AAA Batteries',
      'Desk Wipes',
      'Tissues',
      'Hand Sanitizer',
      'Cable Ties'
    ]
  }
];

const VARIANTS = ['Standard', 'Refill', 'Compact', 'Family', 'Eco'];
const CADENCE_CYCLE = [1, 1, 2, 2, 3, 3, 4];

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const buildGeneratedCatalog = (target = TARGET_CONSUMABLE_COUNT) => {
  const generated = [];
  let cursor = 0;

  while (generated.length < target) {
    CATEGORY_DEFS.forEach((categoryDef) => {
      categoryDef.names.forEach((baseName) => {
        if (generated.length >= target) return;

        const variant = VARIANTS[cursor % VARIANTS.length];
        const cadence = CADENCE_CYCLE[cursor % CADENCE_CYCLE.length];
        const name = `${baseName} ${variant}`;
        const categoryOffset = CATEGORY_DEFS.findIndex((cat) => cat.key === categoryDef.key);
        const price = 1200 + (categoryOffset * 500) + ((cursor % 10) * 150);

        generated.push({
          consumableId: `${slugify(baseName)}-${slugify(variant)}-${cursor + 1}`,
          name,
          category: categoryDef.key,
          tooltip: '',
          unitPrice: price,
          defaultCadenceMonths: cadence,
          allowedCadenceMonths: [1, 2, 3, 4, 5, 6]
        });

        cursor += 1;
      });
    });
  }

  return generated.slice(0, target);
};

const normalizeConsumable = (item) => {
  if (!item || !item.consumableId || !item.name) return null;
  return {
    consumableId: String(item.consumableId),
    name: String(item.name),
    category: item.category || 'office-misc',
    tooltip: item.tooltip || '',
    unitPrice: Number(item.unitPrice) > 0 ? Number(item.unitPrice) : 1500,
    defaultCadenceMonths: Number(item.defaultCadenceMonths) > 0 ? Number(item.defaultCadenceMonths) : 1,
    allowedCadenceMonths: Array.isArray(item.allowedCadenceMonths) && item.allowedCadenceMonths.length
      ? item.allowedCadenceMonths
      : [1, 2, 3, 4, 5, 6]
  };
};

const ensureLargeCatalog = (input) => {
  const normalizedInput = (Array.isArray(input) ? input : [])
    .map(normalizeConsumable)
    .filter(Boolean);

  if (normalizedInput.length >= TARGET_CONSUMABLE_COUNT) {
    return normalizedInput;
  }

  const seen = new Set(normalizedInput.map((item) => item.consumableId));
  const generated = buildGeneratedCatalog(TARGET_CONSUMABLE_COUNT * 2)
    .filter((item) => !seen.has(item.consumableId))
    .slice(0, TARGET_CONSUMABLE_COUNT - normalizedInput.length);

  return [...normalizedInput, ...generated];
};

export const getConsumables = async () => {
  if (USE_MOCK) return ensureLargeCatalog(fallbackConsumables);
  try {
    const data = await apiRequest('/consumables');
    if (!Array.isArray(data) || data.length === 0) return ensureLargeCatalog(fallbackConsumables);
    return ensureLargeCatalog(data);
  } catch (error) {
    return ensureLargeCatalog(fallbackConsumables);
  }
};
