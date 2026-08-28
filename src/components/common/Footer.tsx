import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Sparkles, MapPin, Phone, Mail, Share2, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { businessData } = useBusiness();
  const { profile } = businessData;

  return (
    <footer className="bg-artisan-950 text-artisan-200 border-t border-artisan-800/80 pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-artisan-800/60">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-terracotta-500/20 border border-terracotta-500/40 flex items-center justify-center text-terracotta-400 font-serif font-bold text-lg">
                {profile.name.charAt(0)}
              </div>
              <h3 className="font-serif font-bold text-2xl text-white tracking-tight">
                {profile.name}
              </h3>
            </div>
            <p className="text-artisan-400 text-sm leading-relaxed max-w-md">
              {profile.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {profile.badges?.map((badge, idx) => (
                <span 
                  key={idx} 
                  className="text-xs px-2.5 py-1 rounded-full bg-artisan-900 border border-artisan-800 text-artisan-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-honey-400" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-artisan-400">
              Visit & Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-artisan-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
                <span>{profile.address}<br /><span className="text-xs text-artisan-500">{profile.neighborhood}</span></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-terracotta-400 shrink-0" />
                <a href={`tel:${profile.phone}`} className="hover:text-white transition-colors">{profile.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-terracotta-400 shrink-0" />
                <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">{profile.email}</a>
              </li>
              {profile.instagramHandle && (
                <li className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-terracotta-400 shrink-0" />
                  <span className="text-xs text-artisan-400">{profile.instagramHandle}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: AI Concierge Platform Info */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-artisan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Grounded AI Concierge
            </h4>
            <p className="text-xs text-artisan-400 leading-relaxed">
              This interactive storefront is powered by <strong>Canvo</strong>. Every AI response is strictly grounded in verified business hours, menu pricing, and bakery FAQs.
            </p>
            <div className="p-3 rounded-xl bg-artisan-900/80 border border-artisan-800 text-[11px] text-artisan-400 space-y-1">
              <div className="font-semibold text-artisan-200">Zero Hallucinations Guarantee</div>
              <div>Real-time state sync with Owner Studio & Claude 3.5 API.</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-artisan-500">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-terracotta-500" />
            <span>for local artisans & businesses on <strong>Canvo</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
