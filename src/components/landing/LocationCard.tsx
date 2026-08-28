import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { useChat } from '../../context/ChatContext';
import { MapPin, Phone, Mail, Car, Dog, Wifi, Coffee, MessageSquare } from 'lucide-react';

export const LocationCard: React.FC = () => {
  const { businessData } = useBusiness();
  const { profile, botConfig } = businessData;
  const { prefillAndOpen } = useChat();

  return (
    <section id="location" className="py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-artisan-900 text-white rounded-3xl p-8 sm:p-12 shadow-warm-xl border border-artisan-800 relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-terracotta-600/15 blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Col: Info */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-artisan-800 text-honey-300 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Bakery & Patio Location</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
                Visit {profile.name} {profile.city ? `in ${profile.city}` : ''}
              </h2>

              <p className="text-sm sm:text-base text-artisan-300 leading-relaxed max-w-xl">
                Located at {profile.address}{profile.neighborhood ? ` in ${profile.neighborhood}` : ''}{profile.country ? `, ${profile.country}` : ''}. Enjoy warm sourdough drops, botanical viennoiserie, and handcrafted specialty espresso drinks.
              </p>

              {/* Direct Details List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm">
                
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-artisan-800/60 border border-artisan-700/60">
                  <MapPin className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Address</strong>
                    <span className="text-artisan-300">{profile.address}</span>
                    <span className="block text-[11px] text-artisan-400 mt-0.5">{profile.neighborhood}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-artisan-800/60 border border-artisan-700/60">
                  <Phone className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Front Counter Phone</strong>
                    <a href={`tel:${profile.phone}`} className="text-artisan-300 hover:text-white transition-colors">
                      {profile.phone}
                    </a>
                    <span className="block text-[11px] text-artisan-400 mt-0.5">Calls answered during store hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-artisan-800/60 border border-artisan-700/60">
                  <Mail className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Catering & Inquiries</strong>
                    <a href={`mailto:${profile.email}`} className="text-artisan-300 hover:text-white transition-colors">
                      {profile.email}
                    </a>
                    <span className="block text-[11px] text-artisan-400 mt-0.5">24h advance notice for large orders</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-artisan-800/60 border border-artisan-700/60">
                  <Car className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Parking & Transit</strong>
                    <span className="text-artisan-300">Metered street parking + West Village Garage on 4th St</span>
                  </div>
                </div>

              </div>

              {/* Amenity Badges */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <span className="text-xs px-3 py-1 rounded-full bg-artisan-800 text-artisan-300 flex items-center gap-1.5 border border-artisan-700">
                  <Dog className="w-3.5 h-3.5 text-sage-400" />
                  Dog-Friendly Patio
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-artisan-800 text-artisan-300 flex items-center gap-1.5 border border-artisan-700">
                  <Wifi className="w-3.5 h-3.5 text-honey-400" />
                  Complimentary High-Speed Wi-Fi
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-artisan-800 text-artisan-300 flex items-center gap-1.5 border border-artisan-700">
                  <Coffee className="w-3.5 h-3.5 text-terracotta-400" />
                  Minor Figures Oat & Almond Milk
                </span>
              </div>

            </div>

            {/* Right Col: Interactive Map / Visit Card */}
            <div className="lg:col-span-5 bg-artisan-800/80 rounded-2xl p-6 border border-artisan-700 text-center space-y-4">
              
              <div className="w-16 h-16 rounded-full bg-terracotta-500/20 border border-terracotta-500/40 mx-auto flex items-center justify-center text-terracotta-400 text-2xl font-serif font-bold">
                M
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-white">
                  Planning Your Morning Visit?
                </h3>
                <p className="text-xs text-artisan-300 leading-relaxed">
                  Ask our AI Concierge for current oven batch timings, patio table availability tips, or pre-order questions.
                </p>
              </div>

              <button
                onClick={() => prefillAndOpen(`What is the best time to visit ${profile.name} today for the warmest pastries and patio seats?`, true)}
                className="btn-primary w-full !py-3 text-xs sm:text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask {botConfig.botName} For Visit Advice</span>
              </button>

              <div className="text-[11px] text-artisan-400">
                Grounded strictly in official bakery knowledge
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
