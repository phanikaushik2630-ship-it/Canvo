import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../context/BusinessContext';
import { ConvoLogo } from './ConvoLogo';
import { 
  Sparkles, 
  Store, 
  Sliders, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  Globe, 
  Menu as MenuIcon, 
  X,
  ChevronDown,
  ShoppingBag,
  RotateCcw,
  UserCheck,
  Building
} from 'lucide-react';

interface PlatformNavProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const PlatformNav: React.FC<PlatformNavProps> = ({ currentRoute, navigate }) => {
  const { user, logout, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const { businessData } = useBusiness();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleSwitchAccount = () => {
    setUserDropdownOpen(false);
    logout();
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-artisan-50/95 backdrop-blur-md border-b border-artisan-200/80 transition-all shadow-warm-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Monogram & Name */}
          <div 
            onClick={() => handleNav('/')}
            className="cursor-pointer group"
          >
            <ConvoLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-artisan-700">
            <button
              onClick={() => handleNav('/')}
              className={`hover:text-terracotta-600 transition-colors px-2.5 py-1.5 rounded-xl ${
                currentRoute === '/' ? 'text-terracotta-600 bg-terracotta-50 font-bold' : ''
              }`}
            >
              Platform Overview
            </button>

            <button
              onClick={() => handleNav('/b/maison-mirabelle')}
              className={`hover:text-terracotta-600 transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${
                currentRoute === '/b/maison-mirabelle' ? 'text-terracotta-600 bg-terracotta-50 font-bold' : ''
              }`}
            >
              <Store className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Bakery Storefront</span>
            </button>

            <button
              onClick={() => {
                if (user) handleNav('/dashboard');
                else {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }
              }}
              className={`hover:text-terracotta-600 transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${
                currentRoute === '/dashboard' ? 'text-terracotta-600 bg-terracotta-50 font-bold' : ''
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Owner Studio & Orders</span>
            </button>
          </nav>

          {/* Right: Auth Controls & User Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="relative flex items-center gap-2">
                
                {/* Go to Dashboard CTA */}
                <button
                  onClick={() => handleNav('/dashboard')}
                  className={`btn-primary !text-xs !py-1.5 !px-3.5 ${
                    currentRoute === '/dashboard' ? 'bg-artisan-950 hover:bg-artisan-900' : ''
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Owner Studio</span>
                  <span className="sm:hidden">Studio</span>
                </button>

                {/* User Profile Pill with Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-artisan-100 hover:bg-artisan-200/80 border border-artisan-200/80 py-1.5 px-2.5 sm:px-3 rounded-full text-xs font-medium text-artisan-800 transition-all shadow-warm-sm"
                  title="Account settings & switch account"
                >
                  <div className="w-5 h-5 rounded-full bg-terracotta-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {getUserInitials(user.name)}
                  </div>
                  <span className="truncate max-w-[110px] font-semibold text-artisan-900 hidden sm:inline">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-artisan-500" />
                </button>

                {/* Account Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl border border-artisan-200 shadow-warm-xl p-3 z-50 animate-slide-down">
                    
                    {/* User Identity Header */}
                    <div className="p-2.5 rounded-xl bg-artisan-50 border border-artisan-200/60 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-terracotta-500 text-white flex items-center justify-center font-bold text-xs shadow-warm-sm shrink-0">
                          {getUserInitials(user.name)}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-artisan-950 truncate">
                            {user.name}
                          </div>
                          <div className="text-[11px] text-artisan-500 truncate font-mono">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      {businessData?.profile?.name && (
                        <div className="mt-2 pt-2 border-t border-artisan-200/50 flex items-center gap-1.5 text-[10px] text-artisan-600 font-medium">
                          <Building className="w-3 h-3 text-terracotta-500 shrink-0" />
                          <span className="truncate">Managing: <strong>{businessData.profile.name}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNav('/dashboard')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-artisan-800 hover:bg-artisan-100 flex items-center gap-2 transition-colors"
                      >
                        <Sliders className="w-3.5 h-3.5 text-terracotta-500" />
                        <span>Owner Dashboard & Orders</span>
                      </button>

                      <button
                        onClick={handleSwitchAccount}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-900 hover:bg-amber-50 flex items-center gap-2 transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Switch Account / Sign in as Other</span>
                      </button>

                      <div className="pt-1 border-t border-artisan-100">
                        <button
                          onClick={() => { setUserDropdownOpen(false); logout(); }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                  className="btn-secondary !text-xs !py-1.5 !px-3.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => { setAuthModalMode('register'); setIsAuthModalOpen(true); }}
                  className="btn-primary !text-xs !py-1.5 !px-3.5 hidden sm:inline-flex"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Free Bot</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-artisan-700 hover:bg-artisan-200/70 touch-target flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-artisan-200 space-y-2 animate-slide-up pb-4">
            <button
              onClick={() => handleNav('/')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors touch-target ${
                currentRoute === '/' ? 'bg-terracotta-500 text-white font-bold shadow-warm-sm' : 'text-artisan-800 bg-white/70 hover:bg-white border border-artisan-200/60'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span>Platform Overview</span>
            </button>

            <button
              onClick={() => handleNav('/b/maison-mirabelle')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors touch-target ${
                currentRoute.startsWith('/b/') ? 'bg-terracotta-500 text-white font-bold shadow-warm-sm' : 'text-artisan-800 bg-white/70 hover:bg-white border border-artisan-200/60'
              }`}
            >
              <Store className="w-4 h-4 shrink-0" />
              <span>Live Bakery Storefront (Maison Mirabelle)</span>
            </button>

            <button
              onClick={() => {
                if (user) handleNav('/dashboard');
                else {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors touch-target ${
                currentRoute === '/dashboard' ? 'bg-terracotta-500 text-white font-bold shadow-warm-sm' : 'text-artisan-800 bg-white/70 hover:bg-white border border-artisan-200/60'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Owner Studio & Orders Inbox</span>
            </button>

            {user ? (
              <div className="pt-2 border-t border-artisan-200 space-y-1.5">
                <button
                  onClick={handleSwitchAccount}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50/80 border border-amber-200/70 flex items-center gap-2.5 touch-target"
                >
                  <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">Switch Account ({user.email})</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-artisan-200 flex gap-2">
                <button
                  onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
                  className="btn-secondary !text-xs flex-1 !py-2.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => { setAuthModalMode('register'); setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
                  className="btn-primary !text-xs flex-1 !py-2.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Free Bot</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
