import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Sparkles, Flower2, Award, HeartHandshake } from 'lucide-react';

export const StorySection: React.FC = () => {
  const { businessData } = useBusiness();
  const { profile } = businessData;

  return (
    <section id="story" className="py-16 sm:py-24 bg-artisan-100/60 border-y border-artisan-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              
              <div className="p-3 bg-white rounded-3xl border border-artisan-200 shadow-warm-lg">
                <img
                  src={profile.detailImage || '/assets/pastries.jpg'}
                  alt="Pastry craftsmanship"
                  className="w-full aspect-[4/3] object-cover rounded-2xl"
                />
              </div>

              {/* Floating Craft Badge */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-artisan-900 text-white p-4 rounded-2xl shadow-warm-xl border border-artisan-800 max-w-[200px]">
                <div className="flex items-center gap-1.5 text-honey-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Award className="w-4 h-4" />
                  <span>36h Wild Yeast</span>
                </div>
                <p className="text-[11px] text-artisan-300 leading-tight">
                  Zero commercial additives. 100% natural wild starter cultivated since 2019.
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Narrative Story */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-semibold uppercase tracking-wider">
              <Flower2 className="w-3.5 h-3.5 text-sage-600" />
              <span>Philosophy & Craft</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-artisan-950 tracking-tight leading-tight">
              Where Ancient Fermentation Meets Botanical Elegance
            </h2>

            <p className="text-base text-artisan-700 leading-relaxed">
              {profile.story}
            </p>

            {/* Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              
              <div className="bg-white/80 p-4 rounded-2xl border border-artisan-200/80 shadow-warm-sm space-y-1.5">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-artisan-950">
                  <Sparkles className="w-4 h-4 text-terracotta-500" />
                  <span>Heirloom Flour Sourcing</span>
                </div>
                <p className="text-xs text-artisan-600 leading-relaxed">
                  Stone-milled regional heritage grains preserving natural nutrients, rich aroma, and wholesome digestability.
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-artisan-200/80 shadow-warm-sm space-y-1.5">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-artisan-950">
                  <Flower2 className="w-4 h-4 text-sage-600" />
                  <span>Foraged & Culinary Botanicals</span>
                </div>
                <p className="text-xs text-artisan-600 leading-relaxed">
                  Provence lavender, Persian saffron, damask rosewater, and cardamoms freshly crushed before each bake.
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-artisan-200/80 shadow-warm-sm space-y-1.5">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-artisan-950">
                  <Award className="w-4 h-4 text-honey-500" />
                  <span>AOP Charentes-Poitou Butter</span>
                </div>
                <p className="text-xs text-artisan-600 leading-relaxed">
                  Cultured high-fat French butter folded into precisely 27 micro-layers for crisp honeycomb lamination.
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-artisan-200/80 shadow-warm-sm space-y-1.5">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-artisan-950">
                  <HeartHandshake className="w-4 h-4 text-terracotta-500" />
                  <span>Neighborhood Gathering Place</span>
                </div>
                <p className="text-xs text-artisan-600 leading-relaxed">
                  A warm, welcoming sunlit patio, complimentary canine biscuits, and community table conversation.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
