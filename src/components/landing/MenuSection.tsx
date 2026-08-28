import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { useChat } from '../../context/ChatContext';
import { MenuItem } from '../../types';
import { 
  Sparkles, 
  Utensils, 
  Tag, 
  Search, 
  MessageSquare, 
  Flame, 
  ShoppingBag,
  Globe,
  ChevronDown
} from 'lucide-react';
import { formatPriceWithConversion, SUPPORTED_CURRENCIES } from '../../utils/currency';

const getTags = (item: MenuItem): string[] => {
  if (Array.isArray(item.dietaryTags)) return item.dietaryTags;
  if (typeof item.dietaryTags === 'string') {
    return (item.dietaryTags as string).split(/[\s,]+/).filter(Boolean);
  }
  return [];
};

export const MenuSection: React.FC = () => {
  const { businessData, exchangeRates, visitorCurrency, setVisitorCurrency } = useBusiness();
  const { menu, profile, botConfig } = businessData;
  const { prefillAndOpen } = useChat();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const businessCurrencyCode = profile.currencyCode || (profile.currency === '₹' ? 'INR' : 'USD');
  const businessCurrencySymbol = profile.currency || '₹';

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(menu.map(item => item.category)))];

  // Extract unique dietary tags
  const allDietaryTags = Array.from(
    new Set(menu.flatMap(item => getTags(item)))
  );
  const availableTags = ['All', ...allDietaryTags];

  // Filter items
  const filteredItems = menu.filter((item) => {
    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    // Dietary filter
    if (selectedDietary !== 'All') {
      const tags = getTags(item);
      if (!tags.includes(selectedDietary)) {
        return false;
      }
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchIngr = item.ingredients?.some(i => i.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchIngr) return false;
    }
    return true;
  });

  return (
    <section id="menu" className="py-16 sm:py-24 relative bg-artisan-100/40 border-y border-artisan-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-800 text-xs font-semibold uppercase tracking-wider">
            <Utensils className="w-3.5 h-3.5" />
            <span>Daily Menu & Fresh Drops</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-artisan-950 tracking-tight">
            Crafted with Wild Grains & Dawn Spice
          </h2>
          <p className="text-artisan-600 text-sm sm:text-base leading-relaxed">
            Every sourdough loaf, French viennoiserie, and Indian fusion special is grounded in verified recipes, heirloom grains, and dawn stone-oven drops. Order directly in chat or ask our concierge anything.
          </p>
        </div>

        {/* Filter & Currency Controls Bar */}
        <div className="space-y-4 max-w-5xl mx-auto">
          
          {/* Top Controls Row: Categories Tabs + Search & Currency */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Categories Carousel with shrink-0 buttons to prevent any text squeeze/overlap */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1 min-w-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-all ${
                    selectedCategory === cat
                      ? 'bg-artisan-900 text-white shadow-warm-sm font-semibold'
                      : 'bg-white hover:bg-artisan-50 text-artisan-700 border border-artisan-200 hover:border-artisan-300 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Currency Selector & Search Box */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Customer Currency Switcher */}
              <div className="relative inline-flex items-center bg-white border border-artisan-200 hover:border-artisan-300 rounded-full pl-3 pr-8 py-1.5 shadow-sm shrink-0 transition-all">
                <Globe className="w-3.5 h-3.5 text-terracotta-500 shrink-0 mr-1.5" />
                <span className="text-[11px] font-semibold text-artisan-500 mr-1 hidden sm:inline">Currency:</span>
                <select
                  value={visitorCurrency}
                  onChange={(e) => setVisitorCurrency(e.target.value)}
                  className="appearance-none bg-transparent text-xs font-bold text-artisan-900 focus:outline-none cursor-pointer pr-1"
                >
                  {SUPPORTED_CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-artisan-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Search Input */}
              <div className="relative flex-1 sm:w-52">
                <Search className="w-3.5 h-3.5 text-artisan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-1.5 bg-white border border-artisan-200 rounded-full text-xs text-artisan-900 placeholder:text-artisan-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-all shadow-sm"
                />
              </div>
            </div>

          </div>

          {/* Dietary Filter Pills */}
          {availableTags.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              <span className="text-artisan-500 font-medium flex items-center gap-1 shrink-0 mr-1">
                <Tag className="w-3 h-3 text-terracotta-500" />
                <span>Dietary:</span>
              </span>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedDietary(tag)}
                  className={`px-3 py-1 rounded-full transition-all shrink-0 font-medium text-xs whitespace-nowrap ${
                    selectedDietary === tag
                      ? 'bg-terracotta-500 text-white shadow-warm-sm font-semibold'
                      : 'bg-white/80 hover:bg-white text-artisan-700 border border-artisan-200 hover:border-artisan-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Menu Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white/60 border border-artisan-200 rounded-3xl p-8 space-y-3">
            <p className="font-serif text-lg text-artisan-800">No items found matching your filters.</p>
            <p className="text-xs text-artisan-500">Try clearing your dietary filter or search query.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDietary('All');
                setSearchQuery('');
              }}
              className="btn-secondary !text-xs !py-2 !px-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const tags = getTags(item);
              const isFavorite = tags.includes('House Favorite');
              const isFusion = tags.includes('Fusion Special') || item.category.includes('Fusion');

              const { primary, secondary } = formatPriceWithConversion(
                item.price,
                businessCurrencyCode,
                visitorCurrency,
                exchangeRates,
                businessCurrencySymbol
              );

              return (
                <div
                  key={item.id}
                  className="card-artisan p-5 sm:p-6 flex flex-col justify-between group hover:border-terracotta-300 hover:-translate-y-1 transition-all duration-300 relative"
                >
                  {isFavorite && (
                    <div className="absolute -top-2.5 right-4 bg-honey-500 text-artisan-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-warm-sm flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-artisan-950 text-artisan-950" />
                      House Favorite
                    </div>
                  )}

                  <div className="space-y-3">
                    
                    {/* Category & Availability */}
                    <div className="flex items-center justify-between text-xs text-artisan-500">
                      <span className={`font-medium ${isFusion ? 'text-amber-700 font-bold' : ''}`}>
                        {item.category}
                      </span>
                      {!item.isAvailable && (
                        <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                          Sold Out Today
                        </span>
                      )}
                    </div>

                    {/* Title & Price Display with Live Conversion */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-lg font-bold text-artisan-950 group-hover:text-terracotta-600 transition-colors leading-snug">
                        {item.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-base text-terracotta-700 block">
                          {primary}
                        </span>
                        {secondary && (
                          <span className="text-[11px] font-medium text-artisan-500 bg-artisan-100/90 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                            {secondary}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-artisan-600 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Ingredients / Prep Note */}
                    {item.ingredients && item.ingredients.length > 0 && (
                      <div className="text-[11px] text-artisan-500 bg-artisan-50/80 p-2.5 rounded-xl border border-artisan-200/50">
                        <strong className="text-artisan-700">Key ingredients:</strong>{' '}
                        {Array.isArray(item.ingredients) ? item.ingredients.join(', ') : item.ingredients}
                      </div>
                    )}

                    {/* Dietary Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              tag === 'Vegan'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : tag === 'Gluten-Free'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : tag === 'Fusion Special'
                                ? 'bg-honey-100 text-honey-900 border border-honey-300 font-bold'
                                : 'bg-artisan-100 text-artisan-700 border border-artisan-200'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Actions: Order via Chat & Ask Question */}
                  <div className="pt-5 mt-4 border-t border-artisan-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => prefillAndOpen(`I'd like to order 1 ${item.name}`, true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white bg-terracotta-500 hover:bg-terracotta-600 px-3 py-1.5 rounded-full shadow-warm-sm transition-all"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Order in Chat</span>
                    </button>

                    <button
                      onClick={() => prefillAndOpen(`Tell me more about the ${item.name} and what makes it special!`, true)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-artisan-600 hover:text-terracotta-700 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3 text-terracotta-500" />
                      <span>Ask {botConfig.botName}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
