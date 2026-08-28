import { BusinessData } from '../types';
import { defaultBusinessData } from './defaultBusiness';

export const presets: Record<string, { label: string; business: BusinessData }> = {
  'maison-mirabelle': {
    label: '🥐 Maison Mirabelle (Artisan Bakery & Café)',
    business: defaultBusinessData
  },
  'apex-peak-fitness': {
    label: '⚡ Apex Peak (Boutique Fitness & Cold Plunge)',
    business: {
      profile: {
        id: 'apex-peak-fitness',
        slug: 'apex-peak',
        name: 'Apex Peak Athletic Club',
        tagline: 'High-Performance Strength, Contrast Therapy & Recovery',
        category: 'Boutique Fitness & Athletic Recovery Club',
        description: 'Elite small-group functional strength training, private Finnish dry saunas, and 45°F cold plunge contrast suites.',
        story: 'Apex Peak was created in 2021 for athletes, founders, and fitness enthusiasts who want world-class Olympic lifting instruction combined with cutting-edge recovery science under one modern roof.',
        address: '890 Ironworks Way, North Loop Arts District',
        neighborhood: 'North Loop',
        phone: '(555) 749-0192',
        email: 'concierge@apexpeakclub.com',
        currency: '$',
        establishedYear: 2021,
        heroImage: '/assets/hero.jpg',
        detailImage: '/assets/pastries.jpg',
        badges: ['Small-Group Cap (10 Max)', 'Private Cold Plunge Suites', 'Certified Strength Coaches', 'Contrast Therapy'],
        instagramHandle: '@apexpeakclub',
      },
      hours: [
        { day: 'Monday', isOpen: true, openTime: '05:30', closeTime: '21:00', note: 'First class at 6:00 AM' },
        { day: 'Tuesday', isOpen: true, openTime: '05:30', closeTime: '21:00', note: 'First class at 6:00 AM' },
        { day: 'Wednesday', isOpen: true, openTime: '05:30', closeTime: '21:00', note: 'First class at 6:00 AM' },
        { day: 'Thursday', isOpen: true, openTime: '05:30', closeTime: '21:00', note: 'First class at 6:00 AM' },
        { day: 'Friday', isOpen: true, openTime: '05:30', closeTime: '20:00', note: 'Recovery Friday Social at 6:00 PM' },
        { day: 'Saturday', isOpen: true, openTime: '07:00', closeTime: '18:00', note: 'Weekend Strength Clinics' },
        { day: 'Sunday', isOpen: true, openTime: '08:00', closeTime: '16:00', note: 'Recovery & Open Gym Only' },
      ],
      menu: [
        {
          id: 'apex-1',
          name: 'Single Class Drop-in (Strength & Conditioning)',
          category: 'Group Training',
          price: 34.00,
          description: '60-minute coach-led session focusing on compound barbell movements, functional conditioning, and heart-rate tracking.',
          dietaryTags: ['House Favorite'],
          isAvailable: true,
        },
        {
          id: 'apex-2',
          name: 'Contrast Therapy Session (Sauna + Cold Plunge)',
          category: 'Recovery Suites',
          price: 45.00,
          description: '45-minute private suite access featuring 195°F cedar sauna, 45°F filtered cold plunge tub, and red-light recovery panel.',
          dietaryTags: ['House Favorite'],
          isAvailable: true,
        },
        {
          id: 'apex-3',
          name: 'Monthly Unlimited Athlete Membership',
          category: 'Memberships',
          price: 249.00,
          description: 'Unlimited strength classes, daily open gym access, 4 contrast recovery sessions/month, and InBody body composition scans.',
          dietaryTags: ['House Favorite'],
          isAvailable: true,
        },
        {
          id: 'apex-4',
          name: '1-on-1 Personal Performance Coaching',
          category: 'Personal Coaching',
          price: 110.00,
          description: 'Tailored 60-minute private biomechanics and powerlifting session with a Senior CSCS coach.',
          dietaryTags: [],
          isAvailable: true,
        },
        {
          id: 'apex-5',
          name: 'Cold-Pressed Green Electrolyte Elixir',
          category: 'Fuel & Nutrition',
          price: 9.50,
          description: 'Raw cucumber, celery, lime, pink Himalayan salt, coconut water, and unflavored whey isolate (or vegan pea protein).',
          dietaryTags: ['Gluten-Free', 'Vegetarian'],
          isAvailable: true,
        }
      ],
      faqs: [
        {
          id: 'apex-faq-1',
          question: 'What should I bring for my first class or recovery session?',
          answer: 'Please bring clean athletic trainers, workout attire, and a water bottle. We provide complimentary plush bath towels, organic Malin+Goetz shower amenities, and filtered electrolyte refill stations.',
          category: 'First Visit',
        },
        {
          id: 'apex-faq-2',
          question: 'Are the cold plunge and sauna suites private or communal?',
          answer: 'We offer both! You can book dedicated 45-minute private contrast suites for solo or partner use, as well as communal recovery hours following Saturday team workouts.',
          category: 'Recovery Policies',
        },
        {
          id: 'apex-faq-3',
          question: 'What is your cancellation policy for classes?',
          answer: 'Classes can be cancelled up to 8 hours before start time without fee. Contrast suite bookings require 12 hours cancellation notice to allow waitlisted members access.',
          category: 'Booking & Cancellation',
        }
      ],
      botConfig: {
        botName: 'Coach Jax',
        botRoleTitle: 'Athletic Concierge & Head Trainer',
        avatarUrl: '/assets/mira-avatar.jpg',
        themeColor: '#1E293B',
        accentColor: '#D49B37',
        welcomeMessage: 'What is up! I am Coach Jax at Apex Peak Athletic Club. Ask me about open gym times, private coaching tiers, contrast recovery protocols, or day pass access.',
        tone: 'crisp_professional',
        strictnessLevel: 5,
        customInstructions: 'Speak with energetic, motivating athletic precision. Provide exact pricing and class policies strictly based on the configured services.',
        prohibitedTopics: ['Medical diagnoses or medical injury treatment plans', 'Non-Apex fitness equipment reviews', 'Speculative supplements'],
        fallbackPhoneMessage: 'For custom athlete onboarding or private event rentals, please give our front desk team a call at (555) 749-0192 or email concierge@apexpeakclub.com.',
        suggestedQuestions: [
          'How much is a drop-in class?',
          'What is included in a Contrast Therapy session?',
          'What are your opening hours on weekdays?',
          'Do you provide towels and showers?',
          'Tell me about the Monthly Unlimited Membership'
        ]
      },
      apiSettings: {
        anthropicApiKey: '',
        selectedModel: 'claude-3-5-haiku-20241022',
        useMockSimulation: true
      }
    }
  },
  'verde-salon-spa': {
    label: '🌿 Verde Botanical Salon & Spa',
    business: {
      profile: {
        id: 'verde-salon-spa',
        slug: 'verde-spa',
        name: 'Verde Botanical Hair & Skin Studio',
        tagline: 'Non-Toxic Hair Color, Scalp Rituals & Organic Facials',
        category: 'Eco-Luxury Botanical Salon & Spa',
        description: 'Ammonia-free organic Italian hair coloring, customized herbal scalp therapies, and biodynamic holistic facials.',
        story: 'Verde was founded on the philosophy that true luxury does not require toxic chemicals. Our team uses 100% certified biodynamic plant extracts, essential oils, and renewable energy to nourish your hair and skin in a calm, biophilic sanctuary.',
        address: '150 Green Leaf Blvd, Suite 2B, Midtown Oasis',
        neighborhood: 'Midtown Eco District',
        phone: '(555) 628-9931',
        email: 'appointments@verdesalonspa.com',
        currency: '$',
        establishedYear: 2020,
        heroImage: '/assets/hero.jpg',
        detailImage: '/assets/pastries.jpg',
        badges: ['100% Ammonia-Free', 'Biodynamic Botanical Ingredients', 'Cruelty-Free Certified', 'Carbon Neutral'],
        instagramHandle: '@verdesalonspa',
      },
      hours: [
        { day: 'Monday', isOpen: false, openTime: '09:00', closeTime: '18:00', note: 'Closed for stylist continuing education' },
        { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '19:00', note: 'Evening appointments available' },
        { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '19:00', note: 'Evening appointments available' },
        { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '20:00', note: 'Late night pampering till 8 PM' },
        { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '19:00', note: 'Herbal tea service included' },
        { day: 'Saturday', isOpen: true, openTime: '08:30', closeTime: '18:00', note: 'Full bridal and color services' },
        { day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '16:00', note: 'Scalp spa & facial treatments only' },
      ],
      menu: [
        {
          id: 'verde-1',
          name: 'Signature Botanical Scalp Reset & Head Spa Ritual',
          category: 'Scalp & Hair Rituals',
          price: 135.00,
          description: '60-minute Japanese waterfall head spa ritual featuring microscopic scalp diagnosis, organic rosemary oil exfoliation, acupressure neck massage, and deep herbal steam mask.',
          dietaryTags: ['Organic', 'House Favorite'],
          isAvailable: true,
        },
        {
          id: 'verde-2',
          name: 'Custom Haircut & Botanical Blowout',
          category: 'Hair Design',
          price: 95.00,
          description: 'Personalized dry or wet precision haircut tailored to your natural texture, followed by organic argan oil blowout and herbal styling.',
          dietaryTags: ['House Favorite'],
          isAvailable: true,
        },
        {
          id: 'verde-3',
          name: 'Full Custom Balayage & Botanical Gloss',
          category: 'Non-Toxic Color',
          price: 260.00,
          description: 'Hand-painted dimensional balayage using clay-based lightening and ammonia-free plant pigment gloss with quinoa protein bond repair.',
          dietaryTags: ['Organic'],
          isAvailable: true,
        },
        {
          id: 'verde-4',
          name: 'Wild Rose & Guasha Holistic Facial',
          category: 'Holistic Skin',
          price: 160.00,
          description: '75-minute lymphatic drainage facial utilizing jade gua sha stones, cold-pressed wild rosehip oil, and calming chamomile colloidal oatmeal mask.',
          dietaryTags: ['Organic', 'House Favorite'],
          isAvailable: true,
        }
      ],
      faqs: [
        {
          id: 'verde-faq-1',
          question: 'Is your hair color safe for sensitive scalps or pregnancy?',
          answer: 'Yes! Our Italian color lines are 100% ammonia-free, PPD-free, and fragrance-free, infused with calming organic calendula and jojoba oil. Many expectant mothers and guests with skin sensitivities choose us specifically for our gentle formulas.',
          category: 'Product & Safety',
        },
        {
          id: 'verde-faq-2',
          question: 'How do I know which scalp ritual is right for me?',
          answer: 'Every scalp ritual begins with an in-depth 10-minute micro-camera analysis where your specialist examines your scalp density, sebum balance, and hydration levels before customizing your essential oil blend.',
          category: 'Treatments',
        }
      ],
      botConfig: {
        botName: 'Sienna',
        botRoleTitle: 'Spa Concierge & Botanical Stylist',
        avatarUrl: '/assets/mira-avatar.jpg',
        themeColor: '#4D6652',
        accentColor: '#D49B37',
        welcomeMessage: 'Warm botanical greetings! I am Sienna at Verde Botanical Salon & Spa. How may I assist you with organic hair coloring, Japanese scalp rituals, or clean ingredient questions?',
        tone: 'warm_artisan',
        strictnessLevel: 5,
        customInstructions: 'Speak with serene, eco-luxury wellness warmth. Emphasize organic and non-toxic ingredients naturally.',
        prohibitedTopics: ['Medical dermatology prescriptions', 'Synthetic chemical perms or relaxers'],
        fallbackPhoneMessage: 'For custom bridal party bookings or specific stylist requests, please contact our concierge at (555) 628-9931 or appointments@verdesalonspa.com.',
        suggestedQuestions: [
          'What is included in the Botanical Scalp Reset ritual?',
          'Is your hair color ammonia-free and pregnancy safe?',
          'What are your weekend hours?',
          'How much is a haircut & blowout?',
          'Where are you located?'
        ]
      },
      apiSettings: {
        anthropicApiKey: '',
        selectedModel: 'claude-3-5-haiku-20241022',
        useMockSimulation: true
      }
    }
  }
};
