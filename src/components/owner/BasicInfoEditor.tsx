import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Store, Save, MapPin, Globe, Compass, Plus, X, Sparkles, Image, Upload } from 'lucide-react';
import { COUNTRIES, SUPPORTED_CURRENCIES, detectBrowserLocation, getCountryByCode, getCountryByName } from '../../utils/currency';

interface BasicInfoEditorProps {
  onNotify: (text: string) => void;
}

export const BasicInfoEditor: React.FC<BasicInfoEditorProps> = ({ onNotify }) => {
  const { businessData, updateProfile } = useBusiness();
  const { profile } = businessData;

  const initialCountry = getCountryByCode(profile.countryCode) || getCountryByName(profile.country) || COUNTRIES[0];
  const initialCurrency = (profile.currency && profile.currency !== '$')
    ? profile.currency
    : (profile.currencyCode === 'INR' || profile.country === 'India' || profile.countryCode === 'IN')
      ? '₹'
      : (profile.currency || initialCountry.currencySymbol);

  const [form, setForm] = useState({
    ...profile,
    country: profile.country || initialCountry.name,
    countryCode: profile.countryCode || initialCountry.code,
    city: profile.city || initialCountry.cities[0] || 'Mumbai',
    currency: initialCurrency,
    currencyCode: profile.currencyCode || initialCountry.currencyCode,
  });
  const [badgeInput, setBadgeInput] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Keep form in sync when profile updates in context (e.g. after async fetch)
  React.useEffect(() => {
    const matched = getCountryByCode(profile.countryCode) || getCountryByName(profile.country) || COUNTRIES[0];
    const resolvedSymbol = (profile.currency && (profile.currency !== '$' || (profile.currencyCode === 'USD' && profile.country !== 'India')))
      ? profile.currency
      : (profile.currencyCode === 'INR' || profile.country === 'India' || profile.countryCode === 'IN')
        ? '₹'
        : (profile.currency || matched.currencySymbol);

    setForm(prev => ({
      ...prev,
      ...profile,
      country: profile.country || matched.name,
      countryCode: profile.countryCode || matched.code,
      city: profile.city || prev.city || matched.cities[0],
      currency: resolvedSymbol,
      currencyCode: profile.currencyCode || matched.currencyCode,
    }));
  }, [profile]);

  const selectedCountry = getCountryByCode(form.countryCode) || getCountryByName(form.country) || COUNTRIES[0];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const country = COUNTRIES.find(c => c.code === code);
    if (country) {
      setForm(prev => ({
        ...prev,
        country: country.name,
        countryCode: country.code,
        city: country.cities[0] || prev.city,
        currency: country.currencySymbol,
        currencyCode: country.currencyCode
      }));
    }
  };

  const handleCurrencyCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const opt = SUPPORTED_CURRENCIES.find(c => c.code === code);
    if (opt) {
      setForm(prev => ({
        ...prev,
        currencyCode: opt.code,
        currency: opt.symbol // Automatically updates Display Symbol to match selected currency
      }));
    }
  };

  const handleAutoDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const detected = await detectBrowserLocation();
      setForm(prev => ({
        ...prev,
        country: detected.country,
        countryCode: detected.countryCode,
        city: detected.city,
        currency: detected.currency,
        currencyCode: detected.currencyCode
      }));
      onNotify(`Auto-detected location: ${detected.city}, ${detected.country} (${detected.currency} ${detected.currencyCode})`);
    } catch {
      onNotify('Could not detect location. Please select manually.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBadge = () => {
    if (badgeInput.trim() && !form.badges?.includes(badgeInput.trim())) {
      setForm(prev => ({
        ...prev,
        badges: [...(prev.badges || []), badgeInput.trim()]
      }));
      setBadgeInput('');
    }
  };

  const handleRemoveBadge = (index: number) => {
    setForm(prev => ({
      ...prev,
      badges: prev.badges.filter((_, i) => i !== index)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    onNotify('Business profile and currency settings updated successfully!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-artisan-200">
        <div>
          <h3 className="font-serif font-bold text-xl text-artisan-950 flex items-center gap-2">
            <Store className="w-5 h-5 text-terracotta-500" />
            <span>Storefront Profile & Global Settings</span>
          </h3>
          <p className="text-xs text-artisan-500 mt-0.5">
            Configure business identity, location, currency format, contact info, and craft heritage.
          </p>
        </div>

        <button type="submit" className="btn-primary">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* LOCATION & MULTI-CURRENCY CARD */}
      <div className="p-4 rounded-xl bg-artisan-50 border border-artisan-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-terracotta-500" />
            <h4 className="font-semibold text-sm text-artisan-900">Location & Currency Format</h4>
          </div>
          <button
            type="button"
            onClick={handleAutoDetectLocation}
            disabled={isDetectingLocation}
            className="inline-flex items-center gap-1.5 text-xs text-terracotta-600 hover:text-terracotta-700 bg-white border border-terracotta-200 px-2.5 py-1 rounded-lg shadow-sm hover:bg-terracotta-50 transition-colors"
          >
            <Compass className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            <span>{isDetectingLocation ? 'Detecting...' : 'Auto-Detect Location'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Country Selection */}
          <div>
            <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
              Country *
            </label>
            <select
              value={form.countryCode || 'IN'}
              onChange={handleCountryChange}
              className="input-artisan text-sm bg-white"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.currencySymbol})
                </option>
              ))}
            </select>
          </div>

          {/* City Input */}
          <div>
            <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
              City / Region *
            </label>
            <input
              type="text"
              name="city"
              required
              value={form.city || ''}
              onChange={handleChange}
              className="input-artisan text-sm bg-white"
              placeholder="e.g. Mumbai, New York"
            />
            {/* Quick city suggestions */}
            {selectedCountry?.cities && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {selectedCountry.cities.slice(0, 4).map(cityName => (
                  <button
                    key={cityName}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, city: cityName }))}
                    className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                      form.city === cityName
                        ? 'bg-terracotta-100 text-terracotta-800 border-terracotta-300 font-semibold'
                        : 'bg-white text-artisan-600 border-artisan-200 hover:bg-artisan-100'
                    }`}
                  >
                    {cityName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Code */}
          <div>
            <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
              Currency Code (ISO)
            </label>
            <select
              value={form.currencyCode || 'INR'}
              onChange={handleCurrencyCodeChange}
              className="input-artisan text-sm bg-white"
            >
              {SUPPORTED_CURRENCIES.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Currency Symbol Override */}
          <div>
            <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
              Display Symbol *
            </label>
            <input
              type="text"
              name="currency"
              required
              value={form.currency}
              onChange={handleChange}
              className="input-artisan text-sm bg-white font-mono font-bold text-center"
              placeholder="e.g. ₹ or $"
            />
          </div>
        </div>

        <p className="text-[11px] text-artisan-500 leading-tight">
          💡 Changing country automatically selects standard currency symbol and ISO code. You can override either setting above. Storefront prices, order summaries, and concierge quotes will strictly use this currency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Business Name */}
        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Business Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="input-artisan"
            placeholder="e.g. Maison Mirabelle"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Tagline / Subtitle
          </label>
          <input
            type="text"
            name="tagline"
            value={form.tagline}
            onChange={handleChange}
            className="input-artisan"
            placeholder="e.g. Artisanal Boulangerie & Botanica"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Business Category
          </label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input-artisan"
            placeholder="e.g. Artisanal Bakery & Café"
          />
        </div>

        {/* Established Year */}
        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Established Year
          </label>
          <input
            type="number"
            name="establishedYear"
            value={form.establishedYear || 2019}
            onChange={handleChange}
            className="input-artisan"
            placeholder="e.g. 2019"
          />
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Physical Address
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="input-artisan"
            placeholder="e.g. Shop 14, Heritage Square, Bandra West"
          />
        </div>

        {/* Neighborhood */}
        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Neighborhood / Area
          </label>
          <input
            type="text"
            name="neighborhood"
            value={form.neighborhood}
            onChange={handleChange}
            className="input-artisan"
            placeholder="e.g. Bandra West, Mumbai"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Contact Phone
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="input-artisan"
            placeholder="e.g. +91 (022) 2640-7491"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Contact Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input-artisan"
            placeholder="e.g. bonjour@maisonmirabelle.com"
          />
        </div>

      </div>

      {/* Short Description */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
          Short Description (Customer Summary)
        </label>
        <textarea
          name="description"
          rows={2}
          value={form.description}
          onChange={handleChange}
          className="input-artisan"
          placeholder="Brief 1-2 sentence overview of your specialty..."
        />
      </div>

      {/* Full Craft Story */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
          Artisan Story & Heritage (AI Knowledge Base)
        </label>
        <textarea
          name="story"
          rows={3}
          value={form.story}
          onChange={handleChange}
          className="input-artisan"
          placeholder="Explain your ingredients, fermentation methods, sourdough culture origin, or heritage..."
        />
      </div>

      {/* BUSINESS MEDIA & CUSTOM IMAGES SECTION */}
      <div className="p-4 rounded-xl bg-artisan-50 border border-artisan-200/80 shadow-sm space-y-5">
        <div>
          <h4 className="font-semibold text-sm text-artisan-900 flex items-center gap-2">
            <Image className="w-4 h-4 text-terracotta-500" />
            <span>Storefront Brand Imagery & Media</span>
          </h4>
          <p className="text-xs text-artisan-500 mt-0.5">
            Upload custom photos for your business hero banner and menu showcase, or choose from our curated artisanal presets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Hero Banner Image Card */}
          <div className="space-y-2 bg-white p-3.5 rounded-xl border border-artisan-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-artisan-800 uppercase tracking-wider">
                Hero Banner Photo *
              </label>
              <span className="text-[10px] text-artisan-400">1200x600 recommended</span>
            </div>

            {/* Thumbnail Preview */}
            <div className="h-36 rounded-lg overflow-hidden border border-artisan-200 bg-artisan-100 relative group">
              <img 
                src={form.heroImage || '/assets/hero.jpg'} 
                alt="Storefront Hero" 
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/hero.jpg'; }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-semibold px-2 py-1 bg-black/60 rounded">Current Hero Banner</span>
              </div>
            </div>

            {/* Upload or URL input */}
            <div className="space-y-1.5 pt-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="heroImage"
                  value={form.heroImage || ''}
                  onChange={handleChange}
                  placeholder="Paste Image URL or choose preset..."
                  className="input-artisan !text-xs !py-1.5 flex-1 font-mono"
                />
                <label className="btn-secondary !text-xs !py-1.5 !px-3 cursor-pointer shrink-0 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setForm(prev => ({ ...prev, heroImage: reader.result as string }));
                          onNotify('Hero banner image updated from file!');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1 text-[10px] text-artisan-500 pt-1">
                <span>Presets:</span>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop' }))}
                  className="px-1.5 py-0.5 bg-artisan-100 hover:bg-artisan-200 rounded text-artisan-700 transition-colors"
                >
                  🥖 Bakery Oven
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, heroImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop' }))}
                  className="px-1.5 py-0.5 bg-artisan-100 hover:bg-artisan-200 rounded text-artisan-700 transition-colors"
                >
                  ☕ Botanical Café
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop' }))}
                  className="px-1.5 py-0.5 bg-artisan-100 hover:bg-artisan-200 rounded text-artisan-700 transition-colors"
                >
                  🍽️ Bistro Dining
                </button>
              </div>
            </div>
          </div>

          {/* Showcase / Detail Pastry Image Card */}
          <div className="space-y-2 bg-white p-3.5 rounded-xl border border-artisan-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-artisan-800 uppercase tracking-wider">
                Showcase & Craft Detail Photo *
              </label>
              <span className="text-[10px] text-artisan-400">800x800 recommended</span>
            </div>

            {/* Thumbnail Preview */}
            <div className="h-36 rounded-lg overflow-hidden border border-artisan-200 bg-artisan-100 relative group">
              <img 
                src={form.detailImage || '/assets/pastries.jpg'} 
                alt="Storefront Showcase" 
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/pastries.jpg'; }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-semibold px-2 py-1 bg-black/60 rounded">Craft Showcase Photo</span>
              </div>
            </div>

            {/* Upload or URL input */}
            <div className="space-y-1.5 pt-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="detailImage"
                  value={form.detailImage || ''}
                  onChange={handleChange}
                  placeholder="Paste Image URL or choose preset..."
                  className="input-artisan !text-xs !py-1.5 flex-1 font-mono"
                />
                <label className="btn-secondary !text-xs !py-1.5 !px-3 cursor-pointer shrink-0 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setForm(prev => ({ ...prev, detailImage: reader.result as string }));
                          onNotify('Showcase detail image updated from file!');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1 text-[10px] text-artisan-500 pt-1">
                <span>Presets:</span>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, detailImage: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=800&auto=format&fit=crop' }))}
                  className="px-1.5 py-0.5 bg-artisan-100 hover:bg-artisan-200 rounded text-artisan-700 transition-colors"
                >
                  🥐 Fresh Pastries
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, detailImage: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=800&auto=format&fit=crop' }))}
                  className="px-1.5 py-0.5 bg-artisan-100 hover:bg-artisan-200 rounded text-artisan-700 transition-colors"
                >
                  🍞 Sourdough Loaf
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, detailImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop' }))}
                  className="px-1.5 py-0.5 bg-artisan-100 hover:bg-artisan-200 rounded text-artisan-700 transition-colors"
                >
                  🍵 Chai & Coffee
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Brand Badges / Highlights */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
          Brand Badges & Highlights
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.badges?.map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 text-xs bg-artisan-200/80 text-artisan-900 px-3 py-1 rounded-full"
            >
              <span>{badge}</span>
              <button
                type="button"
                onClick={() => handleRemoveBadge(idx)}
                className="hover:text-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            value={badgeInput}
            onChange={(e) => setBadgeInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddBadge(); } }}
            placeholder="Add highlight (e.g. Indian Fusion Specials)..."
            className="input-artisan text-xs"
          />
          <button
            type="button"
            onClick={handleAddBadge}
            className="btn-secondary !text-xs !py-1.5 !px-3 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" className="btn-primary">
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </div>
    </form>
  );
};
