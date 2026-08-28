import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Bot, ShieldCheck, Code2, Store, ArrowRight, CheckCircle2, Zap, Palette, MessageSquare } from 'lucide-react';

interface PlatformHomeProps {
  navigate: (route: string) => void;
}

export const PlatformHome: React.FC<PlatformHomeProps> = ({ navigate }) => {
  const { user, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  const demoBusinesses = [
    {
      slug: 'maison-mirabelle',
      name: 'Maison Mirabelle',
      category: 'Artisanal Bakery & Café',
      tagline: '36-Hour Sourdough, Viennoiserie & Botanica',
      botName: 'Mira',
      color: '#C9633A',
      badge: 'Bakery & Café'
    },
    {
      slug: 'apex-peak',
      name: 'Apex Peak Athletic Club',
      category: 'Boutique Fitness & Athletic Recovery',
      tagline: 'Strength Coaching, Dry Saunas & 45°F Cold Plunge',
      botName: 'Coach Jax',
      color: '#1E293B',
      badge: 'Fitness & Spa'
    },
    {
      slug: 'verde-spa',
      name: 'Verde Botanical Studio',
      category: 'Eco-Luxury Hair & Wellness Sanctuary',
      tagline: 'Ammonia-Free Hair Color & Japanese Scalp Rituals',
      botName: 'Sienna',
      color: '#4D6652',
      badge: 'Salon & Spa'
    }
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 text-center max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-terracotta-200/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-artisan-200 shadow-warm-sm text-xs font-semibold text-artisan-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Multi-Tenant AI Chatbot Platform for Local Businesses</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-artisan-950 tracking-tight leading-[1.1]">
            Turn your business knowledge into a <span className="text-terracotta-600 italic font-normal">distinctive AI concierge</span> in 2 minutes.
          </h1>

          <p className="text-base sm:text-lg text-artisan-700 max-w-2xl mx-auto leading-relaxed">
            No generic templates. Canvo gives local businesses a beautifully branded, strictly grounded AI chatbot that answers menus, hours, and FAQs with <strong>zero hallucinations</strong>.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary !py-3 !px-6 text-sm shadow-warm-lg"
              >
                <Bot className="w-4 h-4" />
                <span>Open Your Owner Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => { setAuthModalMode('register'); setIsAuthModalOpen(true); }}
                className="btn-primary !py-3 !px-6 text-sm shadow-warm-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Your Business Bot Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => navigate('/b/maison-mirabelle')}
              className="btn-secondary !py-3 !px-5 text-sm"
            >
              <Store className="w-4 h-4 text-terracotta-500" />
              <span>Explore Bakery Demo Storefront</span>
            </button>
          </div>

          {/* Value Props Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-artisan-600 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Strict Grounding (No Fake Info)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Embed on Any Website (1-Line Code)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Isolated Per-Business DB
            </span>
          </div>

        </div>
      </section>

      {/* Live Tenant Demo Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-terracotta-600">
            <Store className="w-3.5 h-3.5" />
            <span>Interactive Multi-Tenant Showcase</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-artisan-950">
            Explore Pre-Seeded Business Storefronts
          </h2>
          <p className="text-xs sm:text-sm text-artisan-600">
            Click any demo to test its isolated AI chatbot, menu catalog, and weekly hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoBusinesses.map((b) => (
            <div
              key={b.slug}
              className="card-artisan p-6 flex flex-col justify-between group hover:border-terracotta-400 hover:-translate-y-1 transition-all duration-300 relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-artisan-100 text-artisan-800">
                    {b.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-artisan-500">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }}></span>
                    <span>{b.botName}</span>
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-artisan-950 group-hover:text-terracotta-600 transition-colors">
                  {b.name}
                </h3>
                <p className="text-xs text-artisan-600 leading-relaxed">
                  {b.tagline}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-artisan-100 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/b/${b.slug}`)}
                  className="btn-primary !text-xs !py-1.5 !px-3.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat with {b.botName}</span>
                </button>

                <button
                  onClick={() => navigate(`/embed/${b.slug}`)}
                  className="text-xs font-semibold text-artisan-500 hover:text-artisan-900"
                  title="View standalone embed widget"
                >
                  Embed View →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-artisan-950 text-white rounded-3xl p-8 sm:p-14 border border-artisan-800 shadow-warm-xl">
          <div className="max-w-2xl mb-10 space-y-2">
            <span className="text-xs uppercase tracking-widest text-honey-400 font-bold">
              Built for Modern Local Businesses
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need to automate customer conversations.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
            
            <div className="p-5 rounded-2xl bg-artisan-900/90 border border-artisan-800 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-serif font-bold text-base text-white">Strict Grounding Engine</h3>
              <p className="text-artisan-400 leading-relaxed">
                Powered by Claude 3.5 with strict negative-knowledge prompts. If an item isn't in your menu, the bot never invents it.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-artisan-900/90 border border-artisan-800 space-y-2">
              <Code2 className="w-6 h-6 text-honey-400" />
              <h3 className="font-serif font-bold text-base text-white">1-Click Embed Snippets</h3>
              <p className="text-artisan-400 leading-relaxed">
                Copy a lightweight <code>&lt;script&gt;</code> tag or iframe and paste directly into Shopify, Squarespace, or WordPress.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-artisan-900/90 border border-artisan-800 space-y-2">
              <Palette className="w-6 h-6 text-terracotta-400" />
              <h3 className="font-serif font-bold text-base text-white">Distinctive Visual Identity</h3>
              <p className="text-artisan-400 leading-relaxed">
                Choose custom theme colors, bot avatars, and hospitality tones (Warm Artisan, Crisp Professional, Playful).
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
