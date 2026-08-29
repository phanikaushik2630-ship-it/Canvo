import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'convo_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const initialDb = {
  users: [],
  businesses: [],
  hours: [],
  menu: [],
  faqs: [],
  bot_configs: [],
  chat_logs: [],
  orders: [],
  reviews: [],
  analytics_events: []
};

class Database {
  constructor() {
    this.data = this.load();
    this.seedDefaultData();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || [],
          businesses: parsed.businesses || [],
          hours: parsed.hours || [],
          menu: parsed.menu || [],
          faqs: parsed.faqs || [],
          bot_configs: parsed.bot_configs || [],
          chat_logs: parsed.chat_logs || [],
          orders: parsed.orders || [],
          reviews: parsed.reviews || [],
          analytics_events: parsed.analytics_events || []
        };
      }
    } catch (e) {
      console.error('Error loading database file:', e);
    }
    return JSON.parse(JSON.stringify(initialDb));
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database file:', e);
    }
  }

  seedDefaultData() {
    const b1Id = 'biz_maison_mirabelle';

    // 1. Create Default Demo Owner if not present
    let demoUser = this.data.users.find(u => u.email === 'demo@canvo.app' || u.email === 'demo@convo.app');
    if (!demoUser) {
      const salt = bcrypt.genSaltSync(10);
      const demoPasswordHash = bcrypt.hashSync('demo123', salt);
      demoUser = {
        id: 'user_demo_01',
        email: 'demo@canvo.app',
        passwordHash: demoPasswordHash,
        name: 'Claire Dupont (Owner)',
        createdAt: new Date().toISOString()
      };
      this.data.users.push(demoUser);
    } else {
      demoUser.email = 'demo@canvo.app';
    }

    // 2. Tenant 1: Maison Mirabelle Profile
    let b1 = this.data.businesses.find(b => b.id === b1Id);
    if (!b1) {
      b1 = {
        id: b1Id,
        ownerId: demoUser.id,
        slug: 'maison-mirabelle',
        name: 'Maison Mirabelle',
        tagline: 'Artisanal Boulangerie, Pâtisserie & Botanica',
        category: 'Artisanal Bakery & Botanical Café',
        description: 'Slow-fermented 36-hour heritage sourdough, botanical viennoiserie, French-Indian fusion pastries, and floral espresso elixirs crafted by master bakers at dawn.',
        story: 'Founded in 2019, Maison Mirabelle marries traditional French slow-fermentation methods with fragrant botanicals, heirloom grains, and vibrant Indian spice infusions.',
        country: 'India',
        countryCode: 'IN',
        city: 'Mumbai',
        address: 'Shop 14, Heritage Square, Bandra West',
        neighborhood: 'Bandra West, Mumbai',
        phone: '+91 (022) 2640-7491',
        email: 'bonjour@maisonmirabelle.com',
        currency: '₹',
        currencyCode: 'INR',
        establishedYear: 2019,
        heroImage: '/assets/hero.jpg',
        detailImage: '/assets/pastries.jpg',
        badges: ['36-Hour Wild Fermentation', 'French AOP Butter', 'Indian Fusion Specials', 'Organic Heirloom Grains'],
        instagramHandle: '@maisonmirabelle',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.data.businesses.push(b1);
    } else {
      b1.country = 'India';
      b1.countryCode = 'IN';
      b1.city = 'Mumbai';
      b1.currency = '₹';
      b1.currencyCode = 'INR';
      b1.address = 'Shop 14, Heritage Square, Bandra West';
      b1.neighborhood = 'Bandra West, Mumbai';
      b1.phone = '+91 (022) 2640-7491';
      b1.description = 'Slow-fermented 36-hour heritage sourdough, botanical viennoiserie, French-Indian fusion pastries, and floral espresso elixirs crafted by master bakers at dawn.';
    }

    // 3. Operating Hours
    this.data.hours = this.data.hours.filter(h => h.businessId !== b1Id);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
      const isWeekend = day === 'Saturday' || day === 'Sunday';
      this.data.hours.push({
        id: `hours_${b1Id}_${day.toLowerCase()}`,
        businessId: b1Id,
        day,
        isOpen: true,
        openTime: isWeekend ? '07:30' : '07:00',
        closeTime: isWeekend ? '17:00' : '16:00',
        note: isWeekend ? 'Weekend signature cruffins & fusion rolls sell out early' : 'Fresh sourdough drop at 7:30 AM'
      });
    });

    // 4. Menu Items (French Artisanal + Indian Fusion Specials in INR ₹)
    this.data.menu = this.data.menu.filter(m => m.businessId !== b1Id);
    this.data.menu.push(
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

    // 5. Frequently Asked Questions (Comprehensive Coverage in INR ₹)
    this.data.faqs = this.data.faqs.filter(f => f.businessId !== b1Id);
    this.data.faqs.push(
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

    // 6. Bot Config
    let botConfig = this.data.bot_configs.find(bc => bc.businessId === b1Id);
    if (!botConfig) {
      botConfig = {
        id: `bot_${b1Id}`,
        businessId: b1Id
      };
      this.data.bot_configs.push(botConfig);
    }
    Object.assign(botConfig, {
      botName: 'Mira',
      botRoleTitle: 'Head Concierge & Pâtisserie Guide',
      avatarUrl: '/assets/mira-avatar.jpg',
      themeColor: '#C9633A',
      accentColor: '#4D6652',
      welcomeMessage: 'Namaste & Bonjour! I am Mira, your concierge at Maison Mirabelle in Bandra, Mumbai. How may I assist you today? Feel free to ask about our 36h sourdough loaves, Indian fusion pastries, daily bake drops, or place an order in ₹ / book a table!',
      tone: 'warm_artisan',
      strictnessLevel: 5,
      commerceMode: 'both',
      customInstructions: 'Speak with a warm, refined, hospitable bakery charm. Always quote prices accurately in INR (₹). If asked about Indian items, enthusiastically mention the Cardamom Chai Bun (₹180), Saffron Pista Roll (₹280), Gulab Jamun Croissant (₹290), Masala Chai (₹120), and Paneer Tikka Puff (₹220). Never invent unlisted products.',
      prohibitedTopics: ['Coding and technical programming', 'Competitor bakeries', 'Medical advice'],
      fallbackPhoneMessage: 'I don\'t have that specific detail in my current bakery notes, but our counter team would love to assist you at +91 (022) 2640-7491!',
      suggestedQuestions: [
        'Do you have any Indian items?',
        'What are your hours on Sunday?',
        'I would like to order 2 cruffins',
        'Can I book a table on the patio?'
      ]
    });

    // 7. Customer Reviews & Ratings
    if (!this.data.reviews) this.data.reviews = [];
    this.data.reviews = this.data.reviews.filter(r => r.businessId !== b1Id);
    this.data.reviews.push(
      {
        id: `rev_${b1Id}_1`,
        businessId: b1Id,
        customerName: 'Ananya Deshmukh',
        rating: 5,
        comment: 'The Cardamom Chai Buns are literally the best pastry in Mumbai! Crispy, fragrant, and perfectly spiced. Mira in the chat helped me pre-order a box for our morning team meeting effortlessly.',
        source: 'chat',
        tags: ['Cardamom Chai Bun', 'Fast Order', 'Friendly AI'],
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: `rev_${b1Id}_2`,
        businessId: b1Id,
        customerName: 'Rohan Mehta',
        rating: 5,
        comment: 'The 36-hour sourdough batard had the most incredible blistered crust and tangy open crumb. Ordered for curbside pickup with UPI payment — seamless and delicious.',
        source: 'storefront',
        tags: ['Classic Sourdough', 'UPI Payment', 'Quick Pickup'],
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
      },
      {
        id: `rev_${b1Id}_3`,
        businessId: b1Id,
        customerName: 'Kavita Rao',
        rating: 5,
        comment: 'Gulab Jamun Croissant is pure culinary genius! The chat assistant answered all my dietary questions regarding gluten and dairy instantly.',
        source: 'chat',
        tags: ['Fusion Special', 'Dietary Clarity'],
        createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
      },
      {
        id: `rev_${b1Id}_4`,
        businessId: b1Id,
        customerName: 'Dev Patel',
        rating: 5,
        comment: 'Laminated pistachio cruffins baked to perfection. The Bandra garden patio is dog-friendly and a peaceful morning oasis.',
        source: 'storefront',
        tags: ['Pistachio Cruffin', 'Patio Seating'],
        createdAt: new Date(Date.now() - 9 * 86400000).toISOString()
      },
      {
        id: `rev_${b1Id}_5`,
        businessId: b1Id,
        customerName: 'Sophie Moreau',
        rating: 4,
        comment: 'Authentic French lamination with subtle saffron and cardamom notes. Love the transparent pricing and instant chat reservation.',
        source: 'chat',
        tags: ['Authentic Butter', 'Table Booking'],
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
      }
    );

    this.save();
    console.log(`✅ Multi-tenant database populated with ${this.data.menu.filter(m => m.businessId === b1Id).length} menu items, ${this.data.faqs.filter(f => f.businessId === b1Id).length} FAQs, and ${this.data.reviews.filter(r => r.businessId === b1Id).length} reviews for Maison Mirabelle (India / ₹ INR)!`);
  }

  // --- USER METHODS ---
  findUserByEmail(email) {
    const normalized = email.toLowerCase().trim();
    return this.data.users.find(u => {
      const uEmail = u.email.toLowerCase();
      if (uEmail === normalized) return true;
      if ((normalized === 'demo@convo.app' && uEmail === 'demo@canvo.app') ||
          (normalized === 'demo@canvo.app' && uEmail === 'demo@convo.app')) {
        return true;
      }
      return false;
    });
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  createUser({ email, password, name }) {
    const existing = this.findUserByEmail(email);
    if (existing) throw new Error('A user with this email already exists');

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name.trim(),
      createdAt: new Date().toISOString()
    };
    this.data.users.push(user);
    this.save();
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
  }

  verifyPassword(user, password) {
    return bcrypt.compareSync(password, user.passwordHash);
  }

  resetUserPassword(email, newPassword) {
    const user = this.findUserByEmail(email);
    if (!user) throw new Error('No account found with this email address');

    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(newPassword, salt);
    this.save();
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
  }

  // --- OTP PASSWORD RESET METHODS ---
  generatePasswordResetOtp(email) {
    const user = this.findUserByEmail(email);
    if (!user) throw new Error('No owner account found with this email address');

    if (!this.resetOtps) this.resetOtps = new Map();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.resetOtps.set(email.toLowerCase().trim(), {
      otp,
      expiresAt,
      attempts: 0
    });

    console.log(`\n======================================================`);
    console.log(`📬 [EMAIL DISPATCH SIMULATION] Password Reset OTP`);
    console.log(`To: ${user.name} <${user.email}>`);
    console.log(`Subject: Your Canvo Verification Code: ${otp}`);
    console.log(`Message: Your 6-digit verification code is [ ${otp} ]. It expires in 10 minutes.`);
    console.log(`======================================================\n`);

    return { email: user.email, name: user.name, otp, expiresAt };
  }

  verifyOtpAndResetPassword(email, otp, newPassword) {
    const user = this.findUserByEmail(email);
    if (!user) throw new Error('No account found with this email address');

    if (!this.resetOtps) this.resetOtps = new Map();
    const key = email.toLowerCase().trim();
    const record = this.resetOtps.get(key);

    if (!record) {
      throw new Error('No active OTP request found. Please request a new code.');
    }

    if (Date.now() > record.expiresAt) {
      this.resetOtps.delete(key);
      throw new Error('Your verification code has expired. Please request a new one.');
    }

    if (record.otp.trim() !== String(otp).trim()) {
      record.attempts = (record.attempts || 0) + 1;
      if (record.attempts >= 4) {
        this.resetOtps.delete(key);
        throw new Error('Too many invalid attempts. Please request a new verification code.');
      }
      throw new Error('Invalid verification code. Please check your email and try again.');
    }

    // OTP Validated — reset password and delete used OTP
    this.resetOtps.delete(key);
    return this.resetUserPassword(email, newPassword);
  }

  // --- BUSINESS METHODS ---
  getBusinessesByOwner(ownerId) {
    return this.data.businesses.filter(b => b.ownerId === ownerId);
  }

  getBusinessById(id) {
    return this.data.businesses.find(b => b.id === id);
  }

  getBusinessBySlug(slug) {
    return this.data.businesses.find(b => b.slug.toLowerCase() === String(slug).toLowerCase().trim());
  }

  generateUniqueSlug(name) {
    let base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'business';
    let slug = base;
    let counter = 1;
    while (this.data.businesses.some(b => b.slug === slug)) {
      slug = `${base}-${counter++}`;
    }
    return slug;
  }

  createBusiness(ownerId, data) {
    const bizId = `biz_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const slug = data.slug ? this.generateUniqueSlug(data.slug) : this.generateUniqueSlug(data.name || 'new-business');

    const business = {
      id: bizId,
      ownerId,
      slug,
      name: data.name || 'My Local Business',
      tagline: data.tagline || 'Quality Products & Services',
      category: data.category || 'Local Business',
      description: data.description || 'Welcome to our business! Ask our AI concierge anything about our offerings or place an order.',
      story: data.story || '',
      address: data.address || '123 Main Street',
      neighborhood: data.neighborhood || 'Downtown',
      country: data.country || 'India',
      countryCode: data.countryCode || 'IN',
      city: data.city || 'Mumbai',
      phone: data.phone || '+91 (022) 2640-7491',
      email: data.email || 'contact@example.com',
      currency: data.currency || '₹',
      currencyCode: data.currencyCode || 'INR',
      establishedYear: data.establishedYear || new Date().getFullYear(),
      heroImage: data.heroImage || '/assets/hero.jpg',
      detailImage: data.detailImage || '/assets/pastries.jpg',
      badges: data.badges || ['Locally Owned', 'Verified Quality'],
      instagramHandle: data.instagramHandle || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.businesses.push(business);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
      this.data.hours.push({
        id: `hours_${bizId}_${day.toLowerCase()}`,
        businessId: bizId,
        day,
        isOpen: true,
        openTime: '09:00',
        closeTime: '18:00',
        note: ''
      });
    });

    this.data.bot_configs.push({
      id: `bot_${bizId}`,
      businessId: bizId,
      botName: data.botName || 'Concierge',
      botRoleTitle: 'Customer Guide',
      avatarUrl: '/assets/mira-avatar.jpg',
      themeColor: '#C9633A',
      accentColor: '#4D6652',
      welcomeMessage: `Hello! I am the AI Concierge for ${business.name}. How can I assist you today?`,
      tone: 'warm_artisan',
      strictnessLevel: 5,
      commerceMode: 'both',
      customInstructions: `Assist customers accurately with information about ${business.name}. Never speculate on unlisted items.`,
      prohibitedTopics: ['Coding questions', 'Competitor reviews'],
      fallbackPhoneMessage: `Please contact us directly at ${business.phone} for further assistance!`,
      suggestedQuestions: [
        'What are your opening hours?',
        'I would like to place an order',
        'Can I book a table / appointment?'
      ]
    });

    this.save();
    return this.getFullBusinessData(bizId);
  }

  updateBusiness(id, ownerId, updateData) {
    const business = this.data.businesses.find(b => b.id === id && b.ownerId === ownerId);
    if (!business) throw new Error('Business not found or unauthorized');

    if (updateData.slug && updateData.slug !== business.slug) {
      const existing = this.getBusinessBySlug(updateData.slug);
      if (existing && existing.id !== id) {
        throw new Error('This URL slug is already taken. Please choose another.');
      }
    }

    Object.assign(business, updateData, { updatedAt: new Date().toISOString() });
    this.save();
    return business;
  }

  deleteBusiness(id, ownerId) {
    const index = this.data.businesses.findIndex(b => b.id === id && b.ownerId === ownerId);
    if (index === -1) throw new Error('Business not found or unauthorized');

    this.data.businesses.splice(index, 1);
    this.data.hours = this.data.hours.filter(h => h.businessId !== id);
    this.data.menu = this.data.menu.filter(m => m.businessId !== id);
    this.data.faqs = this.data.faqs.filter(f => f.businessId !== id);
    this.data.bot_configs = this.data.bot_configs.filter(bc => bc.businessId !== id);
    this.data.chat_logs = (this.data.chat_logs || []).filter(l => l.businessId !== id);
    this.data.orders = (this.data.orders || []).filter(o => o.businessId !== id);
    this.save();
    return true;
  }

  // --- HOURS ---
  updateBusinessHours(businessId, ownerId, hoursArray) {
    const business = this.getBusinessById(businessId);
    if (!business || business.ownerId !== ownerId) throw new Error('Unauthorized');

    this.data.hours = this.data.hours.filter(h => h.businessId === businessId);
    hoursArray.forEach(h => {
      this.data.hours.push({
        id: h.id || `hours_${businessId}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        businessId,
        day: h.day,
        isOpen: Boolean(h.isOpen),
        openTime: h.openTime || '09:00',
        closeTime: h.closeTime || '18:00',
        note: h.note || ''
      });
    });
    this.save();
    return this.data.hours.filter(h => h.businessId === businessId);
  }

  // --- MENU ---
  createMenuItem(businessId, ownerId, itemData) {
    const business = this.getBusinessById(businessId);
    if (!business || business.ownerId !== ownerId) throw new Error('Unauthorized');

    const item = {
      id: `menu_${businessId}_${Date.now()}`,
      businessId,
      name: itemData.name,
      category: itemData.category || 'General',
      price: Number(itemData.price) || 0,
      description: itemData.description || '',
      dietaryTags: Array.isArray(itemData.dietaryTags) ? itemData.dietaryTags : (itemData.dietaryTags ? [itemData.dietaryTags] : []),
      isAvailable: itemData.isAvailable !== false,
      ingredients: Array.isArray(itemData.ingredients) ? itemData.ingredients : (itemData.ingredients ? [itemData.ingredients] : []),
      preparationNote: itemData.preparationNote || ''
    };
    this.data.menu.push(item);
    this.save();
    return item;
  }

  updateMenuItem(itemId, businessId, ownerId, itemData) {
    const business = this.getBusinessById(businessId);
    if (!business || business.ownerId !== ownerId) throw new Error('Unauthorized');

    const item = this.data.menu.find(m => m.id === itemId && m.businessId === businessId);
    if (!item) throw new Error('Item not found');

    Object.assign(item, itemData, { 
      price: Number(itemData.price !== undefined ? itemData.price : item.price),
      dietaryTags: Array.isArray(itemData.dietaryTags) ? itemData.dietaryTags : (itemData.dietaryTags ? [itemData.dietaryTags] : item.dietaryTags || [])
    });
    this.save();
    return item;
  }

  deleteMenuItem(itemId, businessId, ownerId) {
    const business = this.getBusinessById(businessId);
    if (!business || business.ownerId !== ownerId) throw new Error('Unauthorized');

    this.data.menu = this.data.menu.filter(m => !(m.id === itemId && m.businessId === businessId));
    this.save();
    return true;
  }

  // --- FAQS ---
  createFaq(businessId, ownerId, faqData) {
    const business = this.getBusinessById(businessId);
    if (!business || business.ownerId !== ownerId) throw new Error('Unauthorized');

    const faq = {
      id: `faq_${businessId}_${Date.now()}`,
      businessId,
      question: faqData.question,
      answer: faqData.answer,
      category: faqData.category || 'General'
    };
    this.data.faqs.push(faq);
    this.save();
    return faq;
  }

  updateFaq(faqId, businessId, ownerId, faqData) {
    const business = this.getBusinessById(businessId);
    if (!business || business.ownerId !== ownerId) throw new Error('Unauthorized');

    const faq = this.data.faqs.find(f => f.id === faqId && f.businessId === businessId);
    if (!faq) throw new Error('FAQ not found');

    Object.assign(faq, faqData);
    this.save();
    return faq;
  }

  deleteFaq(faqId, businessId, ownerId) {
    const business = this.getBusinessById(businessId);
    if (!business || business.ownerId !== ownerId) throw new Error('Unauthorized');

    this.data.faqs = this.data.faqs.filter(f => !(f.id === faqId && f.businessId === businessId));
    this.save();
    return true;
  }

  // --- BOT CONFIG ---
  updateBotConfig(businessId, ownerId, configData) {
    const business = this.getBusinessById(businessId);
    if (!business || business.ownerId !== ownerId) throw new Error('Unauthorized');

    let botConfig = this.data.bot_configs.find(bc => bc.businessId === businessId);
    if (!botConfig) {
      botConfig = { id: `bot_${businessId}`, businessId };
      this.data.bot_configs.push(botConfig);
    }

    Object.assign(botConfig, configData);
    this.save();
    return botConfig;
  }

  getFullBusinessData(slugOrId) {
    const business = this.data.businesses.find(b => b.id === slugOrId || b.slug.toLowerCase() === String(slugOrId).toLowerCase().trim());
    if (!business) return null;

    const hours = this.data.hours.filter(h => h.businessId === business.id);
    const menu = this.data.menu.filter(m => m.businessId === business.id);
    const faqs = this.data.faqs.filter(f => f.businessId === business.id);
    const botConfig = this.data.bot_configs.find(bc => bc.businessId === business.id) || {
      botName: 'Mira',
      botRoleTitle: 'Customer Guide',
      avatarUrl: '/assets/mira-avatar.jpg',
      themeColor: '#C9633A',
      welcomeMessage: `Hello! I am here to help you with ${business.name}.`,
      tone: 'warm_artisan',
      strictnessLevel: 5,
      commerceMode: 'both',
      suggestedQuestions: ['What are your hours?', 'What is on the menu?']
    };

    return {
      profile: business,
      hours,
      menu,
      faqs,
      botConfig,
      apiSettings: {
        anthropicApiKey: '',
        selectedModel: 'claude-3-5-haiku-20241022',
        useMockSimulation: true
      }
    };
  }

  // --- ORDERS & BOOKINGS ---
  createOrder(businessId, orderData) {
    if (!this.data.orders) this.data.orders = [];

    const business = this.getBusinessById(businessId) || this.getBusinessBySlug(businessId);
    if (!business) throw new Error('Business not found');

    const prefix = business.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3) || 'ORD';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `${prefix}-${randNum}`;

    const items = (orderData.items || []).map(it => ({
      name: it.name,
      quantity: Number(it.quantity) || 1,
      price: Number(it.price) || 0
    }));

    const calculatedTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      orderNumber,
      businessId: business.id,
      type: orderData.type === 'booking' ? 'booking' : 'order',
      customerName: orderData.customerName?.trim() || 'Guest Customer',
      customerPhone: orderData.customerPhone?.trim() || 'N/A',
      paymentPreference: orderData.paymentPreference || (orderData.type === 'booking' ? 'N/A' : 'UPI'),
      items,
      bookingDetails: orderData.bookingDetails || null,
      totalAmount: orderData.totalAmount !== undefined ? Number(orderData.totalAmount) : calculatedTotal,
      status: 'new',
      specialInstructions: orderData.specialInstructions || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.orders.unshift(order);
    this.save();
    return order;
  }

  getOrdersByBusiness(businessId, statusFilter = 'all') {
    const orders = (this.data.orders || []).filter(o => o.businessId === businessId);
    if (statusFilter !== 'all') {
      return orders.filter(o => o.status === statusFilter);
    }
    return orders;
  }

  updateOrderStatus(orderId, businessId, ownerId, status) {
    const business = this.getBusinessById(businessId);
    if (!business || business.ownerId !== ownerId) throw new Error('Unauthorized');

    const order = (this.data.orders || []).find(o => o.id === orderId && o.businessId === businessId);
    if (!order) throw new Error('Order not found');

    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  deleteOrder(orderId, businessId, ownerId) {
    const business = this.getBusinessById(businessId);
    if (!business || business.ownerId !== ownerId) throw new Error('Unauthorized');

    const idx = (this.data.orders || []).findIndex(o => o.id === orderId && o.businessId === businessId);
    if (idx === -1) throw new Error('Order not found');

    this.data.orders.splice(idx, 1);
    this.save();
    return true;
  }

  // --- CHAT LOGGING & ANALYTICS ---
  logChatMessage(businessId, userQuestion, botAnswer, wasUnanswered = null) {
    if (!this.data.chat_logs) this.data.chat_logs = [];

    let isUnanswered = wasUnanswered;
    if (isUnanswered === null) {
      const answerLower = (botAnswer || '').toLowerCase();
      const unansweredTriggers = [
        "don't have that specific detail",
        "do not have that specific detail",
        "don't have that information",
        "outside our guidelines",
        "i don't have that exact detail",
        "i specialize strictly in answering questions about",
        "please contact our team",
        "give our team a call",
        "i am sorry, but i am unable to discuss"
      ];
      isUnanswered = unansweredTriggers.some(t => answerLower.includes(t));
    }

    const logEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      businessId,
      userQuestion: userQuestion.trim(),
      botAnswer: botAnswer.trim(),
      wasUnanswered: Boolean(isUnanswered),
      timestamp: new Date().toISOString()
    };

    this.data.chat_logs.unshift(logEntry);
    if (this.data.chat_logs.length > 5000) {
      this.data.chat_logs.splice(5000);
    }
    this.save();
    return logEntry;
  }

  getAnalyticsOverview(businessId, daysRange = 30) {
    const logs = (this.data.chat_logs || []).filter(l => l.businessId === businessId);
    const now = Date.now();
    const cutoff = now - daysRange * 86400000;
    const recentLogs = logs.filter(l => new Date(l.timestamp).getTime() >= cutoff);

    const totalChats = recentLogs.length;
    const unansweredCount = recentLogs.filter(l => l.wasUnanswered).length;
    const answeredCount = totalChats - unansweredCount;
    const answerRate = totalChats > 0 ? Math.round((answeredCount / totalChats) * 100) : 100;

    const dayMap = new Map();
    for (let i = daysRange - 1; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dayMap.set(key, { date: key, label, total: 0, answered: 0, unanswered: 0 });
    }

    recentLogs.forEach(l => {
      const key = l.timestamp.split('T')[0];
      if (dayMap.has(key)) {
        const entry = dayMap.get(key);
        entry.total++;
        if (l.wasUnanswered) entry.unanswered++;
        else entry.answered++;
      }
    });
    const dailyTimeline = Array.from(dayMap.values());

    const hourCounts = new Array(24).fill(0);
    recentLogs.forEach(l => {
      const h = new Date(l.timestamp).getHours();
      hourCounts[h]++;
    });

    let peakHour = 9;
    let maxHourCount = 0;
    hourCounts.forEach((count, h) => {
      if (count > maxHourCount) {
        maxHourCount = count;
        peakHour = h;
      }
    });

    const dayOfWeekCounts = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    recentLogs.forEach(l => {
      const dayName = dayNames[new Date(l.timestamp).getDay()];
      dayOfWeekCounts[dayName]++;
    });

    let peakDay = 'Saturday';
    let maxDayCount = 0;
    Object.entries(dayOfWeekCounts).forEach(([d, count]) => {
      if (count > maxDayCount) {
        maxDayCount = count;
        peakDay = d;
      }
    });

    return {
      totalChats,
      answeredCount,
      unansweredCount,
      answerRate,
      dailyTimeline,
      hourCounts,
      peakHour: `${peakHour % 12 || 12}:00 ${peakHour >= 12 ? 'PM' : 'AM'}`,
      peakDay,
      dayOfWeekCounts
    };
  }

  getTopQuestions(businessId, limit = 10) {
    const logs = (this.data.chat_logs || []).filter(l => l.businessId === businessId);
    const groups = new Map();

    logs.forEach(l => {
      const norm = l.userQuestion.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      if (!groups.has(norm)) {
        groups.set(norm, { question: l.userQuestion, count: 0, wasUnanswered: l.wasUnanswered, latestTimestamp: l.timestamp });
      }
      const item = groups.get(norm);
      item.count++;
      if (new Date(l.timestamp) > new Date(item.latestTimestamp)) {
        item.latestTimestamp = l.timestamp;
      }
    });

    return Array.from(groups.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getUnansweredQuestions(businessId) {
    const logs = (this.data.chat_logs || []).filter(l => l.businessId === businessId && l.wasUnanswered);
    const groups = new Map();

    logs.forEach(l => {
      const norm = l.userQuestion.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      if (!groups.has(norm)) {
        groups.set(norm, { question: l.userQuestion, sampleAnswer: l.botAnswer, count: 0, latestTimestamp: l.timestamp });
      }
      const item = groups.get(norm);
      item.count++;
      if (new Date(l.timestamp) > new Date(item.latestTimestamp)) {
        item.latestTimestamp = l.timestamp;
      }
    });

    return Array.from(groups.values())
      .sort((a, b) => b.count - a.count);
  }

  getChatLogs(businessId, search = '', limit = 100) {
    let logs = (this.data.chat_logs || []).filter(l => l.businessId === businessId);
    if (search.trim()) {
      const q = search.toLowerCase();
      logs = logs.filter(l => l.userQuestion.toLowerCase().includes(q) || l.botAnswer.toLowerCase().includes(q));
    }
    return logs.slice(0, limit);
  }

  getChatLogsCsv(businessId) {
    const logs = (this.data.chat_logs || []).filter(l => l.businessId === businessId);
    const headers = ['Timestamp', 'Customer Question', 'Bot Answer', 'Status'];
    const rows = logs.map(l => [
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.userQuestion.replace(/"/g, '""')}"`,
      `"${l.botAnswer.replace(/"/g, '""')}"`,
      `"${l.wasUnanswered ? 'Unanswered / Gap' : 'Answered (Grounded)'}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // --- REVIEWS & RATINGS ---
  createReview(businessId, reviewData) {
    const business = this.getBusinessById(businessId);
    if (!business) throw new Error('Business not found');

    const rating = Math.min(5, Math.max(1, Number(reviewData.rating) || 5));
    const review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      businessId: business.id,
      customerName: reviewData.customerName?.trim() || 'Verified Guest',
      rating,
      comment: reviewData.comment?.trim() || 'Wonderful experience with the concierge and artisanal bakery!',
      source: reviewData.source || 'chat',
      tags: Array.isArray(reviewData.tags) ? reviewData.tags : [],
      createdAt: new Date().toISOString()
    };

    if (!this.data.reviews) this.data.reviews = [];
    this.data.reviews.unshift(review);
    this.save();
    return review;
  }

  getReviewsByBusiness(businessId) {
    if (!this.data.reviews) this.data.reviews = [];
    return this.data.reviews.filter(r => r.businessId === businessId);
  }

  getReviewStats(businessId) {
    const reviews = this.getReviewsByBusiness(businessId);
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        averageRating: 5.0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recentReviews: []
      };
    }

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    reviews.forEach(r => {
      sum += r.rating;
      if (ratingDistribution[r.rating] !== undefined) {
        ratingDistribution[r.rating]++;
      }
    });

    const averageRating = Number((sum / totalReviews).toFixed(1));

    return {
      averageRating,
      totalReviews,
      ratingDistribution,
      recentReviews: reviews.slice(0, 15)
    };
  }
}

export const db = new Database();
