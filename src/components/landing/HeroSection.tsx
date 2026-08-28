import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { useChat } from '../../context/ChatContext';
import { MessageSquare, Sparkles, Clock, ArrowRight, Wheat, Star, MapPin } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { businessData } = useBusiness();
  const { profile, hours, botConfig } = businessData;
  const { prefillAndOpen, setIsOpen } = useChat();

  // Calculate live open status for today
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  const todayName = dayNames[todayIndex];
  const todaySchedule = hours?.find(h => h.day === todayName) || hours?.[0] || { isOpen: true, openTime: '07:00', closeTime: '17:00' };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Decorative ambient background gradients */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-terracotta-200/35 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 -ml-24 w-80 h-80 rounded-full bg-honey-200/30 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-sage-200/25 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Live Open Status & Heritage Pill */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-artisan-200 text-xs font-semibold text-artisan-800 shadow-warm-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${todaySchedule.isOpen ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${todaySchedule.isOpen ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </span>
                <span>
                  {todaySchedule.isOpen ? `Open Today: ${todaySchedule.openTime} – ${todaySchedule.closeTime}` : 'Closed Today'}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-50 border border-terracotta-200/80 text-xs font-semibold text-terracotta-700">
                <Wheat className="w-3.5 h-3.5 text-terracotta-500" />
                <span>36-Hour Wild Fermentation</span>
              </div>
            </div>

            {/* Main Headline with Editorial Serif typography */}
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-artisan-950 tracking-tight leading-[1.15]">
                Artisanal Sourdough & <span className="text-terracotta-600 italic font-normal">Botanical Pastries</span> Baked at Dawn.
              </h1>
              <p className="text-sm sm:text-lg text-artisan-700 leading-relaxed max-w-2xl font-normal">
                {profile.description} Every recipe is grounded in organic heritage grains, French cultured butter, and wild-harvested botanicals.
              </p>
            </div>

            {/* Call to Actions - Full width on mobile for easy tapping */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => setIsOpen(true)}
                className="btn-primary !px-6 !py-3 text-sm shadow-warm-lg flex items-center justify-center gap-2 group touch-target"
              >
                <MessageSquare className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Chat with {botConfig.botName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 uppercase tracking-wider font-bold">AI</span>
              </button>

              <a
                href="#menu"
                className="btn-secondary !px-5 !py-3 text-sm flex items-center justify-center gap-2 touch-target"
              >
                <span>Explore Today's Bake</span>
                <ArrowRight className="w-4 h-4 text-artisan-500" />
              </a>
            </div>

            {/* Quick Interactive Prompt Starter Chips */}
            <div className="pt-2 sm:pt-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-artisan-500">
                <Sparkles className="w-3.5 h-3.5 text-honey-500" />
                <span>Try asking our AI Concierge:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(botConfig?.suggestedQuestions || ['What are your hours today?', 'I want to order 2 cruffins', 'Do you have gluten-free options?']).slice(0, 4).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => prefillAndOpen(q, true)}
                    className="text-xs bg-white/80 hover:bg-terracotta-50 hover:text-terracotta-700 hover:border-terracotta-300 text-artisan-800 border border-artisan-300/80 rounded-full px-3.5 py-1.5 transition-all shadow-warm-sm hover:shadow-warm-md text-left flex items-center gap-1.5 group"
                  >
                    <span>"{q}"</span>
                    <ArrowRight className="w-3 h-3 text-artisan-400 group-hover:text-terracotta-500 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Hero Column: Curated Visual Card without messy overlaps */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative frame */}
              <div className="p-3 bg-white/90 backdrop-blur-md rounded-3xl border border-artisan-200/90 shadow-warm-xl relative">
                
                {/* Main Hero Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-artisan-200">
                  <img
                    src={profile.heroImage || '/assets/hero.jpg'}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-artisan-950/70 via-transparent to-black/20"></div>
                  
                  {/* Top-Left Location Badge */}
                  <div className="absolute top-3 left-3 bg-artisan-950/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/20 text-xs shadow-warm-md flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-honey-400 shrink-0" />
                    <span className="font-serif font-semibold">{profile.neighborhood || 'West Village'}</span>
                  </div>

                  {/* Top-Right Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-artisan-950 px-2.5 py-1 rounded-xl shadow-warm-md flex items-center gap-1 border border-artisan-200 text-xs font-bold font-serif">
                    <span className="text-honey-500">★</span>
                    <span>4.9</span>
                  </div>

                  {/* Clean Bottom Overlay Info (No badge collision) */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-honey-300 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-honey-300 text-honey-300" />
                      <span>Dawn Bake Drops Daily</span>
                    </div>
                    <div className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                      {profile.name} — Bakery & Espresso Bar
                    </div>
                  </div>
                </div>

                {/* Sub-Card: Floating Concierge Quick-Launcher */}
                <div 
                  onClick={() => setIsOpen(true)}
                  className="mt-3 bg-terracotta-50/90 border border-terracotta-200/80 rounded-2xl p-3 shadow-warm-sm flex items-center justify-between gap-3 cursor-pointer hover:bg-terracotta-100/80 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={botConfig.avatarUrl || '/assets/mira-avatar.jpg'} 
                        alt={botConfig.botName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-warm-sm bg-white" 
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-artisan-950">
                        <span>{botConfig.botName} (AI Concierge)</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">Online</span>
                      </div>
                      <p className="text-[11px] text-artisan-600 group-hover:text-terracotta-700 font-medium transition-colors">
                        Ask about fresh drops, sourdough or order in chat →
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-warm-sm">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
