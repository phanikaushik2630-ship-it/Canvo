import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { useChat } from '../../context/ChatContext';
import { MessageSquare, Sliders, Menu as MenuIcon, X, Sparkles, Store, Clock, Utensils, HelpCircle, MapPin } from 'lucide-react';

interface HeaderProps {
  currentView: 'landing' | 'owner';
  onViewChange: (view: 'landing' | 'owner') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { businessData } = useBusiness();
  const { profile, botConfig } = businessData;
  const { setIsOpen } = useChat();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-artisan-50/90 backdrop-blur-md border-b border-artisan-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Monogram */}
          <div 
            onClick={() => onViewChange('landing')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-terracotta-500/10 border border-terracotta-500/30 flex items-center justify-center text-terracotta-600 font-serif font-bold text-xl group-hover:scale-105 transition-transform shadow-warm-sm">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl sm:text-2xl text-artisan-900 tracking-tight">
                  {profile.name}
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-artisan-200/80 text-artisan-800">
                  Est. {profile.establishedYear}
                </span>
              </div>
              <p className="text-xs text-artisan-600 font-medium tracking-wide truncate max-w-[200px] sm:max-w-xs">
                {profile.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {currentView === 'landing' && (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-artisan-700">
              <a href="#menu" className="hover:text-terracotta-600 transition-colors flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" />
                Menu & Catalog
              </a>
              <a href="#hours" className="hover:text-terracotta-600 transition-colors flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Hours
              </a>
              <a href="#story" className="hover:text-terracotta-600 transition-colors">
                Our Craft
              </a>
              <a href="#faqs" className="hover:text-terracotta-600 transition-colors flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                FAQs
              </a>
              <a href="#location" className="hover:text-terracotta-600 transition-colors flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Visit
              </a>
            </nav>
          )}

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* View Switcher: Customer vs Owner Studio */}
            <div className="flex items-center bg-artisan-200/70 p-1 rounded-full border border-artisan-300/50">
              <button
                onClick={() => onViewChange('landing')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  currentView === 'landing'
                    ? 'bg-white text-artisan-900 shadow-warm-sm'
                    : 'text-artisan-600 hover:text-artisan-900'
                }`}
                title="View customer landing page"
              >
                <Store className="w-3.5 h-3.5 text-terracotta-500" />
                <span className="hidden sm:inline">Storefront</span>
              </button>
              
              <button
                onClick={() => onViewChange('owner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  currentView === 'owner'
                    ? 'bg-artisan-900 text-white shadow-warm-sm'
                    : 'text-artisan-600 hover:text-artisan-900'
                }`}
                title="Open owner studio to customize chatbot and business data"
              >
                <Sliders className="w-3.5 h-3.5 text-honey-400" />
                <span>Owner Studio</span>
              </button>
            </div>

            {/* Quick Chat Launcher Button (Customer view only) */}
            {currentView === 'landing' && (
              <button
                onClick={() => setIsOpen(true)}
                className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask {botConfig.botName}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-artisan-700 hover:bg-artisan-200/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-artisan-100/95 border-b border-artisan-200 px-4 pt-3 pb-5 space-y-3 animate-slide-down">
          {currentView === 'landing' ? (
            <div className="flex flex-col space-y-2.5 text-sm font-medium text-artisan-800">
              <a 
                href="#menu" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-artisan-200/70 flex items-center gap-2"
              >
                <Utensils className="w-4 h-4 text-terracotta-500" />
                Menu & Catalog
              </a>
              <a 
                href="#hours" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-artisan-200/70 flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-terracotta-500" />
                Hours & Schedule
              </a>
              <a 
                href="#story" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-artisan-200/70 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-terracotta-500" />
                Our Artisan Craft
              </a>
              <a 
                href="#faqs" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-artisan-200/70 flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-terracotta-500" />
                FAQs
              </a>
              <a 
                href="#location" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-artisan-200/70 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-terracotta-500" />
                Visit & Contact
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsOpen(true);
                }}
                className="btn-primary w-full mt-2"
              >
                <MessageSquare className="w-4 h-4" />
                Chat with {botConfig.botName}
              </button>
            </div>
          ) : (
            <div className="text-xs text-artisan-600 p-2">
              You are in <strong>Owner Studio Mode</strong>. Modify menu items, schedules, FAQs, and AI guardrails in real time.
            </div>
          )}
        </div>
      )}
    </header>
  );
};
