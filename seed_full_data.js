import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'server', 'data', 'convo_db.json');

const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
const b1Id = 'biz_maison_mirabelle';

// 1. Update Business Profile with Location & Currency
const b1 = db.businesses.find(b => b.id === b1Id);
if (b1) {
  b1.country = 'India';
  b1.countryCode = 'IN';
  b1.city = 'Mumbai';
  b1.currency = '₹';
  b1.currencyCode = 'INR';
  b1.address = 'Shop 14, Heritage Square, Bandra West';
  b1.neighborhood = 'Bandra West, Mumbai';
  b1.phone = '+91 (022) 2640-7491';
  b1.updatedAt = new Date().toISOString();
}

// 2. Replace Menu with 10 INR priced items
db.menu = db.menu.filter(m => m.businessId !== b1Id);
db.menu.push(
  {
    id: `menu_${b1Id}_1`,
    businessId: b1Id,
    name: 'Classic Sourdough Loaf',
    category: 'Artisan Sourdough',
    price: 350,
    description: 'Our flagship 36-hour slow-fermented batard with a blistering mahogany crust, open custardy crumb, and distinct tangy wild-starter depth.',
    dietaryTags: ['Vegan', 'Organic', 'Nut-Free', 'House Favorite'],
    isAvailable: true,
    ingredients: ['Heirloom stoneground wheat', 'Rye flour', 'Water', 'Guerande sea salt', 'Wild starter culture'],
    preparationNote: 'Available warm from the oven starting at 7:30 AM.'
  },
  {
    id: `menu_${b1Id}_2`,
    businessId: b1Id,
    name: 'Botanical Rosewater Croissant',
    category: 'Viennoiserie & Pastries',
    price: 260,
    description: 'Laminated French butter croissant infused with organic Damask rosewater glaze, dried rose petals, and a hint of wild honey.',
    dietaryTags: ['Vegetarian', 'House Favorite'],
    isAvailable: true,
    ingredients: ['French AOP butter', 'Organic wheat flour', 'Damask rosewater', 'Wild honey', 'Rose petals'],
    preparationNote: 'First batch ready at 6:45 AM.'
  },
  {
    id: `menu_${b1Id}_3`,
    businessId: b1Id,
    name: 'Lavender Honey Danish',
    category: 'Viennoiserie & Pastries',
    price: 240,
    description: 'Flaky pastry wheel filled with wild lavender custard, raw wildflower honey drizzle, and fresh plump blueberries.',
    dietaryTags: ['Vegetarian'],
    isAvailable: true,
    ingredients: ['Lavender custard', 'Wildflower honey', 'Fresh blueberries', 'Flaky pastry dough']
  },
  {
    id: `menu_${b1Id}_4`,
    businessId: b1Id,
    name: 'Cardamom Chai Bun',
    category: 'French-Indian Fusion',
    price: 180,
    description: 'Swedish-style twisted cardamom knot infused with slow-simmered spiced CTC Assam chai essence and crunchy Swedish pearl sugar.',
    dietaryTags: ['Vegetarian', 'Nut-Free', 'Fusion Special', 'House Favorite'],
    isAvailable: true,
    ingredients: ['Green cardamom', 'Assam tea concentrate', 'Cinnamon', 'Cultured butter', 'Pearl sugar'],
    preparationNote: 'Fresh drop at 6:45 AM & 10:30 AM daily.'
  },
  {
    id: `menu_${b1Id}_5`,
    businessId: b1Id,
    name: 'Saffron Pista Rolls',
    category: 'French-Indian Fusion',
    price: 280,
    description: 'Soft layered brioche swirl filled with Kashmiri saffron frangipane cream, crushed Iranian pistachios, and warm ground cardamom.',
    dietaryTags: ['Vegetarian', 'Fusion Special', 'House Favorite'],
    isAvailable: true,
    ingredients: ['Kashmiri saffron', 'Sicilian pistachios', 'Cardamom', 'Brioche dough', 'Brown sugar']
  },
  {
    id: `menu_${b1Id}_6`,
    businessId: b1Id,
    name: 'Masala Chai',
    category: 'Botanical Elixirs & Beverages',
    price: 120,
    description: 'Traditional slow-simmered Assam black tea brewed with fresh ginger, whole green cardamom, cinnamon quills, cloves, and whole milk (oat milk available).',
    dietaryTags: ['Vegetarian', 'Nut-Free', 'Fusion Special'],
    isAvailable: true,
    ingredients: ['Assam CTC tea', 'Fresh ginger root', 'Green cardamom', 'Cinnamon', 'Whole milk / Oat milk']
  },
  {
    id: `menu_${b1Id}_7`,
    businessId: b1Id,
    name: 'Paneer Tikka Puff',
    category: 'Savory & Lunch',
    price: 220,
    description: 'Golden crisp French puff pastry pocket filled with spiced tandoori paneer cubes, caramelized shallots, roasted bell peppers, and fresh mint chutney.',
    dietaryTags: ['Vegetarian', 'Nut-Free', 'Savory', 'Fusion Special'],
    isAvailable: true,
    ingredients: ['Marinated artisanal paneer', 'Tandoori spice blend', 'Shallots', 'Mint & coriander chutney', 'Puff pastry'],
    preparationNote: 'Served warm with a side of house mint dipping sauce.'
  },
  {
    id: `menu_${b1Id}_8`,
    businessId: b1Id,
    name: 'Gulab Jamun Croissant',
    category: 'French-Indian Fusion',
    price: 290,
    description: 'Double-baked croissant stuffed with soft cardamom milk mawa, soaked in saffron rose syrup, crowned with roasted pistachios and edible silver vark.',
    dietaryTags: ['Vegetarian', 'Fusion Special', 'House Favorite'],
    isAvailable: true,
    ingredients: ['Milk mawa', 'Saffron syrup', 'Rose water', 'Pistachios', 'Butter croissant']
  },
  {
    id: `menu_${b1Id}_9`,
    businessId: b1Id,
    name: 'Pistachio Cardamom Cruffin',
    category: 'Viennoiserie & Pastries',
    price: 280,
    description: 'Flaky laminated croissant dough baked in a muffin tin, filled with house-made Sicilian pistachio cream, dusted with crushed green cardamom sugar.',
    dietaryTags: ['Vegetarian', 'House Favorite'],
    isAvailable: true,
    ingredients: ['French AOP butter', 'Organic wheat flour', 'Sicilian pistachios', 'Cardamom', 'Rose petals'],
    preparationNote: 'Baked fresh at 6:30 AM & 10:30 AM daily.'
  },
  {
    id: `menu_${b1Id}_10`,
    businessId: b1Id,
    name: 'Gluten-Free Cardamom Hazelnut Financier',
    category: 'Viennoiserie & Pastries',
    price: 210,
    description: 'Tender almond and hazelnut brown butter tea cake infused with freshly cracked green cardamom (baked in a dedicated GF tray).',
    dietaryTags: ['Gluten-Free', 'Vegetarian'],
    isAvailable: true,
    ingredients: ['Almond flour', 'Hazelnut flour', 'Brown butter', 'Egg whites', 'Cardamom']
  }
);

// 3. Replace FAQs with INR and Mumbai context
db.faqs = db.faqs.filter(f => f.businessId !== b1Id);
db.faqs.push(
  {
    id: `faq_${b1Id}_1`,
    businessId: b1Id,
    question: 'What are your store hours and holiday schedule in Mumbai?',
    answer: 'We are open Monday through Friday from 7:00 AM to 4:00 PM, and Saturday & Sunday from 7:30 AM to 5:00 PM at our Bandra West location. On major holidays, our bakery operates special morning hours from 8:00 AM to 1:00 PM for fresh bread pickups.',
    category: 'Visiting & Hours'
  },
  {
    id: `faq_${b1Id}_2`,
    businessId: b1Id,
    question: 'How do pre-orders, custom bakery boxes, and catering work?',
    answer: 'You can place pickup orders directly with Mira in our chat widget or call us at +91 (022) 2640-7491! For large catering orders (pastry platters, corporate breakfasts, whole sourdough batches of 6+ loaves), please place your request at least 24 to 48 hours in advance.',
    category: 'Pre-Orders & Catering'
  },
  {
    id: `faq_${b1Id}_3`,
    businessId: b1Id,
    question: 'Do you have Indian items or fusion pastries?',
    answer: 'Yes! We feature our signature French-Indian fusion collection: the Cardamom Chai Bun (₹180), Saffron Pista Roll (₹280), Gulab Jamun Croissant (₹290), Masala Chai (₹120), and our savory warm Paneer Tikka Puff (₹220).',
    category: 'Dietary & Menu'
  },
  {
    id: `faq_${b1Id}_4`,
    businessId: b1Id,
    question: 'What dietary options (vegan, gluten-free) and spice levels do you have?',
    answer: 'Our Classic Sourdough (₹350) and Seeded Rye are 100% Vegan. For Gluten-Free guests, we offer the Cardamom Hazelnut Financier (₹210). All our sweet fusion pastries have zero chili heat. The savory Paneer Tikka Puff has a mild-to-medium aromatic tandoori spice blend.',
    category: 'Dietary & Menu'
  },
  {
    id: `faq_${b1Id}_5`,
    businessId: b1Id,
    question: 'Are dogs allowed and what is your patio and parking policy in Bandra?',
    answer: 'Yes! Our leafy botanical patio in Bandra West has 8 tables and is completely dog-friendly with fresh water bowls and handmade sourdough dog biscuits. Dedicated valet parking is available right in front of Heritage Square.',
    category: 'Amenities & Policies'
  },
  {
    id: `faq_${b1Id}_6`,
    businessId: b1Id,
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI (GPay, PhonePe, Paytm), all major credit and debit cards (Visa, Mastercard, RuPay, Amex), Apple Pay, contactless chip payments, and cash at our counter.',
    category: 'Payments & Checkout'
  },
  {
    id: `faq_${b1Id}_7`,
    businessId: b1Id,
    question: 'When do fresh croissants and sourdough loaves come out of the oven?',
    answer: 'Our first batch of hot croissants, cruffins, and fusion rolls drops at 6:45 AM right as we open. Warm sourdough loaves come out at 7:30 AM, with a secondary pastry drop at 10:30 AM daily.',
    category: 'Baking Schedule'
  }
);

// 4. Update Bot Config
const bot = db.bot_configs.find(bc => bc.businessId === b1Id);
if (bot) {
  bot.welcomeMessage = 'Namaste & Bonjour! I am Mira, your concierge at Maison Mirabelle in Bandra, Mumbai. How may I assist you today? Feel free to ask about our 36h sourdough loaves, Indian fusion pastries, daily bake drops, or place an order in ₹ / book a table!';
  bot.customInstructions = 'Speak with a warm, refined, hospitable bakery charm. Always quote prices accurately in INR (₹). If asked about Indian items, enthusiastically mention the Cardamom Chai Bun (₹180), Saffron Pista Roll (₹280), Gulab Jamun Croissant (₹290), Masala Chai (₹120), and Paneer Tikka Puff (₹220). Never invent unlisted products.';
  bot.fallbackPhoneMessage = 'I don\'t have that specific detail in my current bakery notes, but our counter team would love to assist you at +91 (022) 2640-7491!';
  bot.suggestedQuestions = [
    'Do you have any Indian items?',
    'What are your hours on Sunday?',
    'I would like to order 2 cruffins',
    'Can I book a table on the patio?'
  ];
}

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log(`✅ Saved Maison Mirabelle (India / Mumbai / ₹ INR) demo data into ${DB_FILE}!`);
