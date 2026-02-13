const { connectDB } = require('../db/connection.js');
const Consumable = require('../db/models/consumable.model.js');

const seedData = [
  {
    consumableId: 'toothbrush-heads',
    name: 'Toothbrushes / Brush Heads',
    category: 'personal-care-hygiene',
    description: 'Manual toothbrushes or electric brush heads for daily oral care.',
    tooltip: 'Brush 2x daily for 2 minutes. Replace every 3 months as bristles fray and collect bacteria.',
    unitPrice: 6000,
    defaultCadenceMonths: 3,
    allowedCadenceMonths: [2, 3, 4, 5, 6]
  },
  {
    consumableId: 'toothpaste',
    name: 'Toothpaste',
    category: 'personal-care-hygiene',
    description: 'Daily oral care paste for morning and evening brushing.',
    tooltip: 'Use a pea-size dab and brush for 2 minutes. Refill monthly as tube volume runs down.',
    unitPrice: 2500,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'interdental-flossers',
    name: 'Flossers / Interdental Brushes',
    category: 'personal-care-hygiene',
    description: 'Interdental cleaners for nightly plaque removal between teeth.',
    tooltip: 'Floss nightly between teeth. Plastic and tips wear over repeated use.',
    unitPrice: 2200,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'qtips-cotton-buds',
    name: 'Q-Tips / Cotton Buds',
    category: 'personal-care-hygiene',
    description: 'Cotton buds for gentle external cleaning and makeup touch-ups.',
    tooltip: 'Use gently. Sticks can snap and tips fray quickly in regular use.',
    unitPrice: 1800,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'soap-bars-leaves',
    name: 'Soap Bars / Soap Leaves',
    category: 'personal-care-hygiene',
    description: 'Body soap bars or dissolvable soap leaves for bathing.',
    tooltip: 'Lather in shower. Bars erode fast with daily moisture exposure.',
    unitPrice: 3000,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'shampoo-conditioner',
    name: 'Shampoo / Conditioner',
    category: 'personal-care-hygiene',
    description: 'Daily or alternating wash products for scalp and hair care.',
    tooltip: 'Massage into scalp for 1 minute and rinse. Bottles deplete with frequent use.',
    unitPrice: 5200,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'body-wash-shower-gel',
    name: 'Body Wash / Shower Gel',
    category: 'personal-care-hygiene',
    description: 'Liquid body cleanser used with loofah or hands.',
    tooltip: 'Lather daily in shower. Pump bottles empty quickly in family use.',
    unitPrice: 3900,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'shaving-cream-razors',
    name: 'Shaving Cream / Razors',
    category: 'personal-care-hygiene',
    description: 'Shaving foam and cartridges for beard or body grooming.',
    tooltip: 'Apply foam and shave with the grain. Cartridges dull after repeated shaves.',
    unitPrice: 6500,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'hair-gel-serum',
    name: 'Hair Gel / Serum',
    category: 'personal-care-hygiene',
    description: 'Styling products for hold, texture, or smooth finish.',
    tooltip: 'Use dime-size on damp hair. Tube and pump deplete over regular styling.',
    unitPrice: 3600,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'deodorant',
    name: 'Deodorant',
    category: 'personal-care-hygiene',
    description: 'Daily underarm odor protection.',
    tooltip: 'Swipe underarms daily. Stick softens in heat and runs out in about a month.',
    unitPrice: 4800,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'nail-files',
    name: 'Nail Files',
    category: 'personal-care-hygiene',
    description: 'Grit files for edge smoothing and shape maintenance.',
    tooltip: 'File weekly. Grit becomes smooth and less effective over time.',
    unitPrice: 1500,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'chapstick-lip-balm',
    name: 'ChapStick / Lip Balm',
    category: 'personal-care-hygiene',
    description: 'Moisturizing lip balm for daily dryness protection.',
    tooltip: 'Apply several times daily. Tube usually bottoms out within a month.',
    unitPrice: 2000,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'moisturizer-sunscreen',
    name: 'Moisturizer / Sunscreen',
    category: 'personal-care-hygiene',
    description: 'Daily skin hydration and UV protection.',
    tooltip: 'Apply post-wash. Pumps deplete quickly and product oxidizes after opening.',
    unitPrice: 6200,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'vitamins-gummies',
    name: 'Vitamins / Gummies',
    category: 'personal-care-hygiene',
    description: 'Daily nutritional supplements.',
    tooltip: 'Take 1-2 daily with meals. Bottles empty predictably over a month.',
    unitPrice: 4800,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'allergy-meds',
    name: 'Allergy Medications',
    category: 'personal-care-hygiene',
    description: 'Daily antihistamine tablets for seasonal support.',
    tooltip: 'Take 1 tablet daily in-season. Blister packs and strips run out monthly.',
    unitPrice: 3500,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'inner-shirt-white',
    name: 'White / Grey / Black Inner Shirts',
    category: 'clothing-accessories',
    description: 'Inner layering shirts for uniforms and daily rotation.',
    tooltip: 'Layer under uniforms and wash weekly. Collars stain and stretch from sweat over time.',
    unitPrice: 6500,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'socks-cotton-stance',
    name: 'Socks (Cotton / Stance)',
    category: 'clothing-accessories',
    description: 'Everyday socks for daily wear and wash rotation.',
    tooltip: 'Wear daily and machine wash. Elastic snaps after many wear cycles.',
    unitPrice: 3500,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'underwear-basic',
    name: 'Underwear',
    category: 'clothing-accessories',
    description: 'Daily base-layer underwear for hygiene rotation.',
    tooltip: 'Change daily and wash regularly. Waistbands roll and fray with repeated cycles.',
    unitPrice: 4000,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'elastic-shoelaces',
    name: 'Elastic Shoelaces',
    category: 'clothing-accessories',
    description: 'No-tie laces for frequent sneaker use.',
    tooltip: 'Thread once and wear often. Stretch retention drops over long use.',
    unitPrice: 2800,
    defaultCadenceMonths: 6,
    allowedCadenceMonths: [3, 4, 5, 6]
  },
  {
    consumableId: 'shoe-bags-packing-cubes',
    name: 'Shoe Bags / Packing Cubes',
    category: 'clothing-accessories',
    description: 'Travel organizers for footwear and folded outfits.',
    tooltip: 'Use for packing and storage. Zippers jam and fabric pills over repeated trips.',
    unitPrice: 5000,
    defaultCadenceMonths: 4,
    allowedCadenceMonths: [2, 3, 4, 5, 6]
  },
  {
    consumableId: 'tp-paper-towels-napkins',
    name: 'TP / Paper Towels / Napkins',
    category: 'household-cleaning-paper',
    description: 'Household paper essentials for wiping and drying.',
    tooltip: 'Used daily across rooms. Rolls deplete quickly with routine pulls.',
    unitPrice: 6500,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'cleaning-wipes',
    name: 'Cleaning Wipes Pack',
    category: 'household-cleaning-paper',
    description: 'Multi-surface single-use cleaning wipes.',
    tooltip: 'One wipe per surface area. Pack depletes quickly with daily use.',
    unitPrice: 3000,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'dishwasher-laundry-tablets',
    name: 'Dishwasher / Laundry Tablets',
    category: 'household-cleaning-paper',
    description: 'Single-load cleaning tablets for dishes or clothing.',
    tooltip: 'Use one tablet per load. Tablets clump when exposed to moisture.',
    unitPrice: 4200,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'dish-soap-tablets-powder',
    name: 'Dish Soap Tablets / Powder',
    category: 'household-cleaning-paper',
    description: 'Concentrated sink-wash soaps for hand cleaning dishes.',
    tooltip: 'Dissolve in warm water for each sink cycle. Product dissolves away with use.',
    unitPrice: 2800,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'air-filters',
    name: 'Air Filters',
    category: 'household-cleaning-paper',
    description: 'HVAC filters for airflow and dust capture.',
    tooltip: 'Replace quarterly. Dust-clogged filters increase energy use and reduce air quality.',
    unitPrice: 8500,
    defaultCadenceMonths: 4,
    allowedCadenceMonths: [2, 3, 4, 5, 6]
  },
  {
    consumableId: 'trash-bags',
    name: 'Trash Bags',
    category: 'household-cleaning-paper',
    description: 'Bin liners for kitchen and home waste disposal.',
    tooltip: 'Line bins daily. Thin plastic tears with heavy loads and sharp waste.',
    unitPrice: 3300,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'pet-food-vitamins',
    name: 'Dog / Cat / Bird Food & Vitamins',
    category: 'pet-care',
    description: 'Daily feed and supplements for household pets.',
    tooltip: 'Measure portions daily. Bags stale after opening and reseal points wear out.',
    unitPrice: 12000,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'pet-treats-toys-nip',
    name: 'Dog Treats / Toys / Nip Pouches',
    category: 'pet-care',
    description: 'Reward consumables and enrichment for pets.',
    tooltip: 'Use for rewards and engagement. Treat packs and chew toys deplete quickly.',
    unitPrice: 5500,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'pet-brushes-wipes',
    name: 'Pet Brushes / Wipes',
    category: 'pet-care',
    description: 'Grooming tools and hygiene wipes for coat care.',
    tooltip: 'Brush and wipe weekly. Bristles and wipe fibers lose effectiveness over time.',
    unitPrice: 3900,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'coffee-beans',
    name: 'Coffee Beans 250g',
    category: 'food-kitchen-staples',
    description: 'Whole beans for daily brewing.',
    tooltip: 'Brew 1-2 cups daily. Aroma fades quickly once opened.',
    unitPrice: 6200,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'tea-bags',
    name: 'Tea Bags Box',
    category: 'food-kitchen-staples',
    description: 'Daily-use tea sachets for home and office.',
    tooltip: 'Steep for about 3 minutes. Bags tear and flavor dulls in humid storage.',
    unitPrice: 2800,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'snacks-mix',
    name: 'Snacks (Chips / Popcorn / Trail Mix)',
    category: 'food-kitchen-staples',
    description: 'Shelf snacks for between-meal use.',
    tooltip: 'Portion by handfuls. Crispness drops quickly after opening.',
    unitPrice: 3500,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'pasta-rice-flour-tomatoes',
    name: 'Pasta / Rice / Flour / Canned Tomatoes',
    category: 'food-kitchen-staples',
    description: 'Core pantry staples for everyday cooking.',
    tooltip: 'Use per recipe. Open dry goods are susceptible to pests and moisture.',
    unitPrice: 7200,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'canned-chicken-tuna',
    name: 'Canned Chicken / Tuna',
    category: 'food-kitchen-staples',
    description: 'Protein staples for quick meals.',
    tooltip: 'Use hot or cold. Cans can dent, rust, or lose quality in poor storage.',
    unitPrice: 5800,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'condiments',
    name: 'Condiments (Ketchup / Mustard / Jam / Honey / Olive Oil)',
    category: 'food-kitchen-staples',
    description: 'Flavor staples for daily meals and snacks.',
    tooltip: 'Use in small amounts per meal. Oxidation and separation increase with shelf time.',
    unitPrice: 5400,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'spices-finishing-salts',
    name: 'Spices / Finishing Salts',
    category: 'food-kitchen-staples',
    description: 'Dry seasonings for routine cooking.',
    tooltip: 'Pinch per dish. Potency drops with age and repeated air exposure.',
    unitPrice: 3000,
    defaultCadenceMonths: 3,
    allowedCadenceMonths: [2, 3, 4, 5, 6]
  },
  {
    consumableId: 'shelf-stable-brie',
    name: 'Shelf-Stable Brie Wheels',
    category: 'food-kitchen-staples',
    description: 'Soft cheese rounds for snacks and entertaining.',
    tooltip: 'Slice and serve with crackers. Texture and rind quality degrade quickly once opened.',
    unitPrice: 7000,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'pens-batteries',
    name: 'Good Pens / Batteries',
    category: 'office-misc',
    description: 'Desk and utility essentials for daily use.',
    tooltip: 'Ink dries and battery performance drops over normal storage cycles.',
    unitPrice: 3200,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'can-opener-wheel',
    name: 'Swing-A-Way Can Opener Blade',
    category: 'office-misc',
    description: 'Replacement cutting wheel for manual can opener.',
    tooltip: 'Cutting edge dulls after repeated openings and can cause rough edges.',
    unitPrice: 2600,
    defaultCadenceMonths: 6,
    allowedCadenceMonths: [3, 4, 5, 6]
  },
  {
    consumableId: 'portable-charger-thermos',
    name: 'Portable Chargers / Thermos',
    category: 'office-misc',
    description: 'Daily carry utilities for power and hydration.',
    tooltip: 'Frequent cycles reduce battery capacity and thermal retention.',
    unitPrice: 9500,
    defaultCadenceMonths: 3,
    allowedCadenceMonths: [2, 3, 4, 5, 6]
  },
  {
    consumableId: 'epsom-salts',
    name: 'Epsom Salts',
    category: 'luxe-novelty',
    description: 'Bath soak salts for muscle recovery and relaxation.',
    tooltip: 'Add two cups to warm bath and soak for 20 minutes. Refill every 2 months.',
    unitPrice: 5500,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'infused-honey-maple',
    name: 'Local / Infused Honey / Maple Syrup',
    category: 'luxe-novelty',
    description: 'Premium sweeteners for breakfast and finishing.',
    tooltip: 'Drizzle on yogurt or toast. Crystallization thickens texture over time.',
    unitPrice: 6200,
    defaultCadenceMonths: 3,
    allowedCadenceMonths: [1, 2, 3, 4, 5, 6]
  },
  {
    consumableId: 'candles-incense',
    name: 'Candles / Incense',
    category: 'luxe-novelty',
    description: 'Home atmosphere items for evening routines.',
    tooltip: 'Burn 1-2 hours at a time. Wicks tunnel and incense packs run down steadily.',
    unitPrice: 4700,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'perfume-samples-lube',
    name: 'Perfume Samples / Lube',
    category: 'luxe-novelty',
    description: 'Personal-use liquids sensitive to evaporation and heat.',
    tooltip: 'Use sparingly. Small bottles evaporate and oxidize faster in warm environments.',
    unitPrice: 3600,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'art-supplies',
    name: 'Art Supplies (Paints / Pastels / Stickers)',
    category: 'luxe-novelty',
    description: 'Creative essentials for weekly projects.',
    tooltip: 'Tubes dry and tips fray with repeated use. Replace on a predictable studio rhythm.',
    unitPrice: 6800,
    defaultCadenceMonths: 3,
    allowedCadenceMonths: [1, 2, 3, 4, 5, 6]
  },
  {
    consumableId: 'mouthwash',
    name: 'Mouthwash',
    category: 'personal-care-hygiene',
    description: 'Daily rinse for oral hygiene support.',
    tooltip: 'Rinse after brushing. Bottles run down quickly with twice-daily use.',
    unitPrice: 3200,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'tongue-scraper',
    name: 'Tongue Scraper',
    category: 'personal-care-hygiene',
    description: 'Reusable oral hygiene scraper.',
    tooltip: 'Use after brushing. Replace when edges wear or surface roughens.',
    unitPrice: 1800,
    defaultCadenceMonths: 3,
    allowedCadenceMonths: [2, 3, 4, 5, 6]
  },
  {
    consumableId: 'hand-soap-refill',
    name: 'Hand Soap Refill',
    category: 'personal-care-hygiene',
    description: 'Liquid refill for hand wash dispensers.',
    tooltip: 'Frequent sink use empties refill packs quickly.',
    unitPrice: 2500,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'face-cleanser',
    name: 'Face Cleanser',
    category: 'personal-care-hygiene',
    description: 'Daily facial cleansing gel.',
    tooltip: 'Use morning and night. Tubes and pumps deplete monthly.',
    unitPrice: 4300,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'cotton-pads',
    name: 'Cotton Pads',
    category: 'personal-care-hygiene',
    description: 'Soft pads for skincare and makeup removal.',
    tooltip: 'Single-use pads disappear quickly in daily skincare routines.',
    unitPrice: 1700,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'sanitary-care',
    name: 'Sanitary Pads / Tampons',
    category: 'personal-care-hygiene',
    description: 'Monthly cycle hygiene products.',
    tooltip: 'Refill before cycle starts to avoid run-outs.',
    unitPrice: 3800,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'aftershave-balm',
    name: 'Aftershave Balm',
    category: 'personal-care-hygiene',
    description: 'Post-shave skin soothing balm.',
    tooltip: 'Used after each shave. Bottle reduces steadily over weeks.',
    unitPrice: 3600,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'contact-lens-solution',
    name: 'Contact Lens Solution',
    category: 'personal-care-hygiene',
    description: 'Cleaning and storage solution for contacts.',
    tooltip: 'Daily disinfection drains bottle volume quickly.',
    unitPrice: 4800,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'lens-case-pack',
    name: 'Contact Lens Case Pack',
    category: 'personal-care-hygiene',
    description: 'Replacement cases for hygienic lens storage.',
    tooltip: 'Replace lens cases on a regular cycle to reduce contamination risk.',
    unitPrice: 1400,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'hand-cream',
    name: 'Hand Cream',
    category: 'personal-care-hygiene',
    description: 'Moisture cream for dry hands.',
    tooltip: 'Frequent use during dry weather depletes small tubes fast.',
    unitPrice: 2200,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'body-lotion',
    name: 'Body Lotion',
    category: 'personal-care-hygiene',
    description: 'Daily skin moisturizing lotion.',
    tooltip: 'Pump packs reduce quickly with full-body daily use.',
    unitPrice: 5200,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'bath-sponge',
    name: 'Bath Sponge',
    category: 'personal-care-hygiene',
    description: 'Foam sponge for shower lather.',
    tooltip: 'Sponge texture breaks down and should be refreshed regularly.',
    unitPrice: 1200,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'beard-oil',
    name: 'Beard Oil',
    category: 'personal-care-hygiene',
    description: 'Conditioning oil for beard grooming.',
    tooltip: 'Use a few drops daily; bottle lasts 1-2 months.',
    unitPrice: 3900,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'beard-comb',
    name: 'Beard Comb',
    category: 'personal-care-hygiene',
    description: 'Comb for beard styling and detangling.',
    tooltip: 'Teeth wear and fine comb edges lose smoothness over time.',
    unitPrice: 1500,
    defaultCadenceMonths: 4,
    allowedCadenceMonths: [2, 3, 4, 5, 6]
  },
  {
    consumableId: 'foot-cream',
    name: 'Foot Cream',
    category: 'personal-care-hygiene',
    description: 'Hydrating foot care cream.',
    tooltip: 'Nightly use during dry seasons drains tubes quickly.',
    unitPrice: 2500,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'boxer-briefs-pack',
    name: 'Boxer Briefs Pack',
    category: 'clothing-accessories',
    description: 'Daily underwear rotation pack.',
    tooltip: 'Elastic and stitching fatigue from wash cycles.',
    unitPrice: 9800,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'insoles',
    name: 'Shoe Insoles',
    category: 'clothing-accessories',
    description: 'Comfort insole inserts for daily shoes.',
    tooltip: 'Cushion compression builds up from daily walking.',
    unitPrice: 4600,
    defaultCadenceMonths: 3,
    allowedCadenceMonths: [2, 3, 4, 5, 6]
  },
  {
    consumableId: 'lint-roller-refill',
    name: 'Lint Roller Refills',
    category: 'clothing-accessories',
    description: 'Adhesive lint sheets for garment care.',
    tooltip: 'Sheets peel out quickly in daily wardrobe maintenance.',
    unitPrice: 2100,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'garment-bags',
    name: 'Garment Bags',
    category: 'clothing-accessories',
    description: 'Storage and travel bags for clothing.',
    tooltip: 'Zippers and seams wear from repeated travel handling.',
    unitPrice: 5900,
    defaultCadenceMonths: 4,
    allowedCadenceMonths: [2, 3, 4, 5, 6]
  },
  {
    consumableId: 'laundry-bags',
    name: 'Laundry Mesh Bags',
    category: 'clothing-accessories',
    description: 'Mesh protection bags for wash cycles.',
    tooltip: 'Mesh and zip closures fatigue under repeated machine use.',
    unitPrice: 3300,
    defaultCadenceMonths: 3,
    allowedCadenceMonths: [2, 3, 4, 5, 6]
  },
  {
    consumableId: 'stain-remover-pens',
    name: 'Stain Remover Pens',
    category: 'clothing-accessories',
    description: 'Portable stain treatment pens.',
    tooltip: 'Small volume applicators empty fast with frequent spot cleaning.',
    unitPrice: 2400,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'fabric-softener-sheets',
    name: 'Fabric Softener Sheets',
    category: 'clothing-accessories',
    description: 'Dryer sheets for softness and static reduction.',
    tooltip: 'Single-use sheets run out quickly in family laundry cycles.',
    unitPrice: 2900,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'surface-disinfectant',
    name: 'Surface Disinfectant Spray',
    category: 'household-cleaning-paper',
    description: 'Spray disinfectant for high-touch surfaces.',
    tooltip: 'Frequent wipe-down routines empty spray bottles quickly.',
    unitPrice: 3400,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'toilet-cleaner',
    name: 'Toilet Cleaner',
    category: 'household-cleaning-paper',
    description: 'Bathroom bowl and rim cleaning liquid.',
    tooltip: 'Weekly deep cleans steadily reduce bottle volume.',
    unitPrice: 2700,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'glass-cleaner',
    name: 'Glass Cleaner',
    category: 'household-cleaning-paper',
    description: 'Window and mirror cleaning spray.',
    tooltip: 'Overspray and wipe routines consume bottles rapidly.',
    unitPrice: 2600,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'floor-cleaner',
    name: 'Floor Cleaner',
    category: 'household-cleaning-paper',
    description: 'Mop-friendly floor cleaning concentrate.',
    tooltip: 'Diluted use per mop bucket depletes concentrate monthly.',
    unitPrice: 3700,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'scrub-sponges',
    name: 'Scrub Sponges',
    category: 'household-cleaning-paper',
    description: 'Dual-surface scrubbers for kitchen and bath.',
    tooltip: 'Abrasive side wears down and fibers trap residues over time.',
    unitPrice: 1800,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'steel-wool',
    name: 'Steel Wool Pads',
    category: 'household-cleaning-paper',
    description: 'Heavy-duty metal scrub pads.',
    tooltip: 'Pads rust and fragment after repeated wet use.',
    unitPrice: 1500,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'mop-pads',
    name: 'Mop Pads',
    category: 'household-cleaning-paper',
    description: 'Replacement mop heads and microfiber pads.',
    tooltip: 'Fibers flatten and lose pickup after many wash cycles.',
    unitPrice: 4200,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'vacuum-bags',
    name: 'Vacuum Bags',
    category: 'household-cleaning-paper',
    description: 'Dust collection bags for vacuum units.',
    tooltip: 'Capacity drops quickly in high-traffic homes with pets.',
    unitPrice: 5000,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'dish-sponges',
    name: 'Dish Sponges',
    category: 'household-cleaning-paper',
    description: 'Daily-use dishwashing sponge packs.',
    tooltip: 'Edges break and odor builds with repeated sink use.',
    unitPrice: 1700,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'aluminum-foil',
    name: 'Aluminum Foil',
    category: 'household-cleaning-paper',
    description: 'Kitchen foil for cooking and storage.',
    tooltip: 'Rolls thin out quickly in frequent meal prep.',
    unitPrice: 2600,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'parchment-paper',
    name: 'Parchment Paper',
    category: 'household-cleaning-paper',
    description: 'Non-stick baking paper sheets.',
    tooltip: 'Single-use baking sheets run out steadily.',
    unitPrice: 2100,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'zipper-storage-bags',
    name: 'Zipper Storage Bags',
    category: 'household-cleaning-paper',
    description: 'Food and item storage zipper bags.',
    tooltip: 'Bags tear and seals degrade with repeated reuse.',
    unitPrice: 2400,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'cling-wrap',
    name: 'Cling Wrap',
    category: 'household-cleaning-paper',
    description: 'Food wrap for freshness and storage.',
    tooltip: 'Thin film tears and roll volume depletes quickly.',
    unitPrice: 1900,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'cat-litter',
    name: 'Cat Litter',
    category: 'pet-care',
    description: 'Absorbent litter for cat trays.',
    tooltip: 'Frequent tray changes consume bags quickly.',
    unitPrice: 9500,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'litter-deodorizer',
    name: 'Litter Deodorizer',
    category: 'pet-care',
    description: 'Odor control powder for litter boxes.',
    tooltip: 'Daily use in multi-cat homes depletes shaker packs fast.',
    unitPrice: 2900,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'bird-cage-liners',
    name: 'Bird Cage Liners',
    category: 'pet-care',
    description: 'Disposable cage tray liners.',
    tooltip: 'Regular liner swaps consume packs every few weeks.',
    unitPrice: 2100,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'aquarium-filter-cartridges',
    name: 'Aquarium Filter Cartridges',
    category: 'pet-care',
    description: 'Replacement filter inserts for fish tanks.',
    tooltip: 'Cartridges clog with debris and require periodic replacement.',
    unitPrice: 6200,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'flea-tick-shampoo',
    name: 'Flea & Tick Shampoo',
    category: 'pet-care',
    description: 'Pet wash treatment shampoo.',
    tooltip: 'Used as needed during season; bottle lifespan varies by pet size.',
    unitPrice: 4500,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'oatmeal',
    name: 'Oatmeal',
    category: 'food-kitchen-staples',
    description: 'Breakfast staple oats.',
    tooltip: 'Daily servings draw down packs predictably each month.',
    unitPrice: 3100,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'cereal',
    name: 'Cereal',
    category: 'food-kitchen-staples',
    description: 'Breakfast cereal packs.',
    tooltip: 'Open boxes lose crunch over time and empty quickly in households.',
    unitPrice: 3800,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'granola-bars',
    name: 'Granola Bars',
    category: 'food-kitchen-staples',
    description: 'Grab-and-go snack bars.',
    tooltip: 'Single-serve bars deplete quickly in lunch and commute routines.',
    unitPrice: 3000,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2]
  },
  {
    consumableId: 'protein-powder',
    name: 'Protein Powder',
    category: 'food-kitchen-staples',
    description: 'Fitness supplement powder.',
    tooltip: 'Scoops per day reduce container contents quickly.',
    unitPrice: 12000,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'cooking-oil',
    name: 'Cooking Oil',
    category: 'food-kitchen-staples',
    description: 'Daily-use frying and cooking oil.',
    tooltip: 'Frequent stovetop use lowers bottle levels faster than expected.',
    unitPrice: 5300,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'vinegar',
    name: 'Vinegar',
    category: 'food-kitchen-staples',
    description: 'Cooking and cleaning vinegar.',
    tooltip: 'Used for food prep and cleaning mixes; bottle depletes steadily.',
    unitPrice: 1900,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'soy-sauce',
    name: 'Soy Sauce',
    category: 'food-kitchen-staples',
    description: 'Savory seasoning sauce.',
    tooltip: 'Meal prep usage and table servings run bottles down monthly.',
    unitPrice: 2400,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'hot-sauce',
    name: 'Hot Sauce',
    category: 'food-kitchen-staples',
    description: 'Spicy condiment bottle.',
    tooltip: 'Frequent topping use gradually empties bottles.',
    unitPrice: 2100,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'peanut-butter',
    name: 'Peanut Butter',
    category: 'food-kitchen-staples',
    description: 'Spread jar for snacks and breakfast.',
    tooltip: 'Jars reduce quickly in daily sandwich and snack routines.',
    unitPrice: 3300,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'dried-beans',
    name: 'Dried Beans',
    category: 'food-kitchen-staples',
    description: 'Dry legumes for staple cooking.',
    tooltip: 'Bulk bags deplete with regular meal prep.',
    unitPrice: 2600,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'lentils',
    name: 'Lentils',
    category: 'food-kitchen-staples',
    description: 'Pantry lentils for soups and mains.',
    tooltip: 'Portion scoops reduce pack volume over recurring meals.',
    unitPrice: 2500,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'sticky-notes',
    name: 'Sticky Notes',
    category: 'office-misc',
    description: 'Desk notes for reminders and planning.',
    tooltip: 'Pads run out quickly in active planning workflows.',
    unitPrice: 1600,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'printer-paper',
    name: 'Printer Paper',
    category: 'office-misc',
    description: 'A4 print copy paper.',
    tooltip: 'High-volume printing drains reams faster than expected.',
    unitPrice: 4200,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'printer-ink',
    name: 'Printer Ink',
    category: 'office-misc',
    description: 'Ink cartridges for office printers.',
    tooltip: 'Print-density usage determines replacement cycle.',
    unitPrice: 11000,
    defaultCadenceMonths: 3,
    allowedCadenceMonths: [1, 2, 3, 4, 5, 6]
  },
  {
    consumableId: 'marker-set',
    name: 'Marker Set',
    category: 'office-misc',
    description: 'Permanent and whiteboard marker assortment.',
    tooltip: 'Tips dry out when uncapped and ink fades over use.',
    unitPrice: 2800,
    defaultCadenceMonths: 3,
    allowedCadenceMonths: [2, 3, 4, 5, 6]
  },
  {
    consumableId: 'notebooks',
    name: 'Notebooks',
    category: 'office-misc',
    description: 'Paper notebooks for planning and notes.',
    tooltip: 'Page-heavy note taking fills notebooks quickly.',
    unitPrice: 3000,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'bath-bombs',
    name: 'Bath Bombs',
    category: 'luxe-novelty',
    description: 'Aromatherapy bath fizz packs.',
    tooltip: 'Single-use bath drops deplete packs steadily.',
    unitPrice: 4400,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'essential-oils',
    name: 'Essential Oils',
    category: 'luxe-novelty',
    description: 'Concentrated aromatic oil blends.',
    tooltip: 'Dropper bottles evaporate gradually and diminish with diffuser use.',
    unitPrice: 5600,
    defaultCadenceMonths: 3,
    allowedCadenceMonths: [1, 2, 3, 4, 5, 6]
  },
  {
    consumableId: 'sheet-face-masks',
    name: 'Sheet Face Masks',
    category: 'luxe-novelty',
    description: 'Single-use skincare masks.',
    tooltip: 'Weekly routines consume mask packs quickly.',
    unitPrice: 2900,
    defaultCadenceMonths: 1,
    allowedCadenceMonths: [1, 2, 3]
  },
  {
    consumableId: 'massage-oil',
    name: 'Massage Oil',
    category: 'luxe-novelty',
    description: 'Body oil for recovery and relaxation.',
    tooltip: 'Used in small amounts but bottle reduces steadily over sessions.',
    unitPrice: 4100,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  },
  {
    consumableId: 'reed-diffuser-refill',
    name: 'Reed Diffuser Refill',
    category: 'luxe-novelty',
    description: 'Scented liquid refill for diffuser sets.',
    tooltip: 'Scent strength drops with evaporation and airflow over weeks.',
    unitPrice: 5200,
    defaultCadenceMonths: 2,
    allowedCadenceMonths: [1, 2, 3, 4]
  }
];

const seed = async () => {
  await connectDB();

  for (const item of seedData) {
    await Consumable.findOneAndUpdate(
      { consumableId: item.consumableId },
      { ...item, isActive: true },
      { new: true, upsert: true }
    );
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded ${seedData.length} consumables`);
  process.exit(0);
};

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Consumables seed failed', err);
  process.exit(1);
});
