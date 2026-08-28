export type PersonalityTone = 'warm_artisan' | 'crisp_professional' | 'playful_casual' | 'direct_concise';
export type BotTone = PersonalityTone;

export type DietaryTag = string;

export type CommerceMode = 'both' | 'orders' | 'bookings' | 'none';

export type OrderStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

export interface BusinessProfile {
  id: string;
  ownerId?: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  story: string;
  country?: string;
  countryCode?: string;
  city?: string;
  address: string;
  neighborhood: string;
  phone: string;
  email: string;
  currency: string;
  currencyCode?: string;
  establishedYear: number;
  heroImage: string;
  detailImage: string;
  badges: string[];
  instagramHandle?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
}

export interface DaySchedule {
  id?: string;
  businessId?: string;
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  note?: string;
}

export interface MenuItem {
  id: string;
  businessId?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  dietaryTags: string[];
  isAvailable: boolean;
  ingredients?: string[];
  preparationNote?: string;
}

export interface FAQItem {
  id: string;
  businessId?: string;
  question: string;
  answer: string;
  category?: string;
}

export interface BotConfig {
  id?: string;
  businessId?: string;
  botName: string;
  botRoleTitle?: string;
  avatarUrl: string;
  themeColor: string;
  accentColor?: string;
  welcomeMessage: string;
  tone: PersonalityTone;
  strictnessLevel: number;
  commerceMode?: CommerceMode;
  customInstructions?: string;
  prohibitedTopics?: string[];
  fallbackPhoneMessage?: string;
  suggestedQuestions: string[];
}

export interface ApiSettings {
  anthropicApiKey: string;
  selectedModel: 'claude-3-5-sonnet-20241022' | 'claude-3-5-haiku-20241022' | 'claude-3-opus-20240229' | 'claude-3-5-sonnet-latest';
  useMockSimulation: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface BusinessData {
  profile: BusinessProfile;
  hours: DaySchedule[];
  menu: MenuItem[];
  faqs: FAQItem[];
  botConfig: BotConfig;
  apiSettings?: ApiSettings;
}

// --- PHASE 4 ORDER & BOOKING TYPES ---
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface BookingDetails {
  partySize: number;
  date: string;
  time: string;
  areaPreference?: string;
  serviceName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  businessId: string;
  type: 'order' | 'booking';
  customerName: string;
  customerPhone: string;
  paymentPreference?: 'UPI' | 'Cash' | string;
  items: OrderItem[];
  bookingDetails?: BookingDetails | null;
  totalAmount: number;
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InteractiveOrderPayload {
  type: 'order' | 'booking';
  items?: OrderItem[];
  bookingDetails?: BookingDetails;
  totalAmount?: number;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  groundedReferences?: GroundedReference[];
  interactiveAction?: InteractiveOrderPayload;
  completedOrder?: Order;
  error?: boolean;
}

export interface GroundedReference {
  id?: string;
  type: 'menu_item' | 'hours' | 'faq' | 'location';
  title: string;
  subtitle?: string;
  details?: string;
  price?: number;
  tags?: string[];
}

// Analytics types
export interface ChatLog {
  id: string;
  businessId: string;
  userQuestion: string;
  botAnswer: string;
  wasUnanswered: boolean;
  timestamp: string;
}

export interface TimelinePoint {
  date: string;
  label: string;
  total: number;
  answered: number;
  unanswered: number;
}

export interface AnalyticsOverview {
  totalChats: number;
  answeredCount: number;
  unansweredCount: number;
  answerRate: number;
  dailyTimeline: TimelinePoint[];
  hourCounts: number[];
  peakHour: string;
  peakDay: string;
  dayOfWeekCounts: Record<string, number>;
}

export interface TopQuestion {
  question: string;
  count: number;
  wasUnanswered: boolean;
  latestTimestamp: string;
}

export interface UnansweredQuery {
  question: string;
  sampleAnswer?: string;
  count: number;
  latestTimestamp: string;
}

// Customer Reviews & Ratings types
export interface CustomerReview {
  id: string;
  businessId: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  source: 'chat' | 'storefront';
  tags?: string[];
  createdAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recentReviews: CustomerReview[];
}

