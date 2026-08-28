// Currency & Location Utilities with Live Conversion and Country Mapping

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  currencySymbol: string;
  currencyCode: string;
  cities: string[];
}

export const COUNTRIES: CountryInfo[] = [
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currencySymbol: '₹',
    currencyCode: 'INR',
    cities: ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Goa', 'Jaipur']
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currencySymbol: '$',
    currencyCode: 'USD',
    cities: ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Austin', 'Seattle', 'Miami', 'Boston']
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currencySymbol: '£',
    currencyCode: 'GBP',
    cities: ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Bristol', 'Glasgow']
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    currencySymbol: '€',
    currencyCode: 'EUR',
    cities: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nice', 'Toulouse']
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currencySymbol: '€',
    currencyCode: 'EUR',
    cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne']
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currencySymbol: 'CA$',
    currencyCode: 'CAD',
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa']
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currencySymbol: 'AED',
    currencyCode: 'AED',
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah']
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    currencySymbol: 'S$',
    currencyCode: 'SGD',
    cities: ['Singapore']
  },
  {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    currencySymbol: '¥',
    currencyCode: 'JPY',
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama']
  }
];

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)' },
];

export const FALLBACK_EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 86.50,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.38,
  AUD: 1.55,
  AED: 3.67,
  SGD: 1.35,
  JPY: 152.0
};

export function getCountryByCode(code?: string): CountryInfo | undefined {
  if (!code) return undefined;
  return COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase());
}

export function getCountryByName(name?: string): CountryInfo | undefined {
  if (!name) return undefined;
  return COUNTRIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}

export function getCurrencyByCode(code?: string): CurrencyOption | undefined {
  if (!code) return undefined;
  return SUPPORTED_CURRENCIES.find(c => c.code.toUpperCase() === code.toUpperCase());
}

/**
 * Converts an amount from one currency to another using exchange rates (relative to USD base).
 */
export function convertCurrency(
  amount: number,
  fromCode: string = 'INR',
  toCode: string = 'USD',
  rates: Record<string, number> = FALLBACK_EXCHANGE_RATES
): number | null {
  if (fromCode.toUpperCase() === toCode.toUpperCase()) return amount;

  const fromRate = rates[fromCode.toUpperCase()];
  const toRate = rates[toCode.toUpperCase()];

  if (!fromRate || !toRate) return null;

  // Convert from source to USD base, then from USD to target
  const inUSD = amount / fromRate;
  const inTarget = inUSD * toRate;
  return inTarget;
}

/**
 * Formats a price with primary business currency and optional live secondary conversion.
 * E.g., formatPriceWithConversion(350, 'INR', 'USD', rates, '₹') -> { original: "₹350.00", estimate: "~$4.05 USD" }
 */
export function formatPriceWithConversion(
  amount: number,
  businessCurrencyCode: string = 'INR',
  visitorCurrencyCode?: string,
  rates: Record<string, number> = FALLBACK_EXCHANGE_RATES,
  businessCurrencySymbol: string = '₹'
): { primary: string; secondary: string | null } {
  const isZeroDecimal = ['JPY', 'KRW'].includes(businessCurrencyCode.toUpperCase());
  const formattedPrimary = `${businessCurrencySymbol}${isZeroDecimal ? Math.round(amount) : amount.toFixed(2)}`;

  if (!visitorCurrencyCode || visitorCurrencyCode.toUpperCase() === businessCurrencyCode.toUpperCase()) {
    return { primary: formattedPrimary, secondary: null };
  }

  const converted = convertCurrency(amount, businessCurrencyCode, visitorCurrencyCode, rates);
  if (converted === null || isNaN(converted)) {
    return { primary: formattedPrimary, secondary: null };
  }

  const targetOpt = getCurrencyByCode(visitorCurrencyCode);
  const targetSymbol = targetOpt?.symbol || visitorCurrencyCode;
  const isTargetZeroDecimal = ['JPY', 'KRW'].includes(visitorCurrencyCode.toUpperCase());
  const formattedConverted = `~${targetSymbol}${isTargetZeroDecimal ? Math.round(converted) : converted.toFixed(2)}`;

  return { primary: formattedPrimary, secondary: formattedConverted };
}

/**
 * Auto-detect user country and city using browser timezone heuristics and optional geolocation.
 */
export async function detectBrowserLocation(): Promise<{ country: string; countryCode: string; city: string; currency: string; currencyCode: string }> {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    
    // Check timezone for India
    if (timeZone.includes('Kolkata') || timeZone.includes('Calcutta') || timeZone.includes('Asia/Colombo')) {
      return { country: 'India', countryCode: 'IN', city: 'Mumbai', currency: '₹', currencyCode: 'INR' };
    }
    // UK
    if (timeZone.includes('London') || timeZone.includes('Europe/London')) {
      return { country: 'United Kingdom', countryCode: 'GB', city: 'London', currency: '£', currencyCode: 'GBP' };
    }
    // France/EU
    if (timeZone.includes('Paris')) {
      return { country: 'France', countryCode: 'FR', city: 'Paris', currency: '€', currencyCode: 'EUR' };
    }
    // Germany
    if (timeZone.includes('Berlin')) {
      return { country: 'Germany', countryCode: 'DE', city: 'Berlin', currency: '€', currencyCode: 'EUR' };
    }
    // Australia
    if (timeZone.includes('Australia') || timeZone.includes('Sydney') || timeZone.includes('Melbourne')) {
      return { country: 'Australia', countryCode: 'AU', city: 'Sydney', currency: 'A$', currencyCode: 'AUD' };
    }
    // Canada
    if (timeZone.includes('Toronto') || timeZone.includes('Vancouver')) {
      return { country: 'Canada', countryCode: 'CA', city: 'Toronto', currency: 'CA$', currencyCode: 'CAD' };
    }
    // UAE
    if (timeZone.includes('Dubai')) {
      return { country: 'United Arab Emirates', countryCode: 'AE', city: 'Dubai', currency: 'AED', currencyCode: 'AED' };
    }
    // Japan
    if (timeZone.includes('Tokyo')) {
      return { country: 'Japan', countryCode: 'JP', city: 'Tokyo', currency: '¥', currencyCode: 'JPY' };
    }
    // Default US
    return { country: 'United States', countryCode: 'US', city: 'New York', currency: '$', currencyCode: 'USD' };
  } catch {
    return { country: 'India', countryCode: 'IN', city: 'Mumbai', currency: '₹', currencyCode: 'INR' };
  }
}
