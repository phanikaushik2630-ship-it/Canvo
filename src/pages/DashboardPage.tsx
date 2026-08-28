import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { BusinessSelector } from '../components/dashboard/BusinessSelector';
import { AnalyticsDashboard } from '../components/dashboard/AnalyticsDashboard';
import { OrdersInbox } from '../components/dashboard/OrdersInbox';
import { BasicInfoEditor } from '../components/owner/BasicInfoEditor';
import { HoursEditor } from '../components/owner/HoursEditor';
import { MenuEditor } from '../components/owner/MenuEditor';
import { FaqEditor } from '../components/owner/FaqEditor';
import { BotCustomizer } from '../components/dashboard/BotCustomizer';
import { EmbedCodeGenerator } from '../components/dashboard/EmbedCodeGenerator';
import { PresetSelector } from '../components/owner/PresetSelector';
import { LivePreviewCard } from '../components/dashboard/LivePreviewCard';
import { fetchOrdersApi } from '../services/api';
import { 
  Store, 
  Clock, 
  Utensils, 
  HelpCircle, 
  Bot, 
  Code2, 
  Layers, 
  ExternalLink,
  Sparkles,
  LogIn,
  BarChart3,
  ShoppingBag
} from 'lucide-react';

interface DashboardPageProps {
  navigate: (route: string) => void;
  onNotify: (text: string) => void;
}

type TabType = 'orders' | 'analytics' | 'menu' | 'hours' | 'faqs' | 'bot' | 'embed' | 'profile' | 'presets';

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate, onNotify }) => {
  const { user, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const { businessData } = useBusiness();
  const { profile, hours, menu, faqs } = businessData;

  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [prefillFaqQuestion, setPrefillFaqQuestion] = useState<string | undefined>(undefined);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);

  // Fetch pending orders count for notification badge
  useEffect(() => {
    if (user && profile.id) {
      fetchOrdersApi(profile.id, 'new')
        .then(orders => setPendingOrdersCount(orders.length))
        .catch(() => {});
    }
  }, [user, profile.id, activeTab]);

  const handleAddFaqFromAnalytics = (question: string) => {
    setPrefillFaqQuestion(question);
    setActiveTab('faqs');
    onNotify(`Pre-filled "${question.slice(0, 30)}..." into FAQ editor`);
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="card-artisan p-8 max-w-md text-center space-y-4 shadow-warm-xl">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center mx-auto shadow-warm-sm">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-artisan-950">Owner Sign-In Required</h2>
          <p className="text-xs text-artisan-600 leading-relaxed">
            Please log in or register your business account to access your chatbot dashboard, orders inbox, and embed codes.
          </p>
          <button
            onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
            className="btn-primary w-full !py-2.5"
          >
            <span>Sign In to Your Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; count?: number; highlight?: boolean; badgeColor?: string }[] = [
    { 
      id: 'orders', 
      label: 'Orders & Bookings', 
      icon: ShoppingBag, 
      count: pendingOrdersCount > 0 ? pendingOrdersCount : undefined, 
      highlight: true,
      badgeColor: 'bg-amber-500 text-white'
    },
    { id: 'analytics', label: 'Insights & Analytics', icon: BarChart3 },
    { id: 'menu', label: 'Catalog & Menu', icon: Utensils, count: menu.length },
    { id: 'hours', label: 'Hours & Drops', icon: Clock, count: hours.filter(h => h.isOpen).length },
    { id: 'faqs', label: 'FAQ Knowledge', icon: HelpCircle, count: faqs.length },
    { id: 'bot', label: 'Bot Identity & Capabilities', icon: Bot },
    { id: 'embed', label: 'Embed & Share', icon: Code2 },
    { id: 'profile', label: 'Storefront Profile & Global Settings', icon: Store },
    { id: 'presets', label: 'Backup & Presets', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-artisan-50 py-8 sm:py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Bar with Business Selector & Public Storefront Link */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-artisan-200">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-artisan-500 uppercase tracking-wider">
              <span>Owner Studio</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Live Multi-Tenant Engine</span>
            </div>
            <div className="flex items-center gap-3">
              <BusinessSelector onNotify={onNotify} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/b/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !text-xs !py-2 !px-4"
            >
              <ExternalLink className="w-3.5 h-3.5 text-terracotta-500" />
              <span>View Public Storefront (/b/{profile.slug})</span>
            </a>
          </div>

        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Tabs and Content on Left (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Horizontal Tabs */}
            <div className="bg-white/90 p-1.5 rounded-2xl border border-artisan-200 shadow-warm-sm flex gap-1 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-artisan-900 text-white shadow-warm-sm font-semibold'
                        : tab.highlight
                          ? 'text-terracotta-700 bg-terracotta-50/80 hover:bg-terracotta-100 font-semibold'
                          : 'text-artisan-600 hover:bg-artisan-100 hover:text-artisan-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-honey-400' : tab.highlight ? 'text-terracotta-600' : 'text-artisan-400'}`} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        tab.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-artisan-200 text-artisan-700')
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Content Card */}
            <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-artisan-200/90 shadow-warm-md">
              {activeTab === 'orders' && <OrdersInbox onNotify={onNotify} />}
              {activeTab === 'analytics' && (
                <AnalyticsDashboard
                  onAddFaq={handleAddFaqFromAnalytics}
                  onNotify={onNotify}
                />
              )}
              {activeTab === 'menu' && <MenuEditor onNotify={onNotify} />}
              {activeTab === 'hours' && <HoursEditor onNotify={onNotify} />}
              {activeTab === 'faqs' && (
                <FaqEditor
                  onNotify={onNotify}
                  prefillQuestion={prefillFaqQuestion}
                  onClearPrefill={() => setPrefillFaqQuestion(undefined)}
                />
              )}
              {activeTab === 'bot' && <BotCustomizer onNotify={onNotify} />}
              {activeTab === 'embed' && <EmbedCodeGenerator />}
              {activeTab === 'profile' && <BasicInfoEditor onNotify={onNotify} />}
              {activeTab === 'presets' && <PresetSelector onNotify={onNotify} />}
            </div>

          </div>

          {/* Sticky Live Widget Preview on Right (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs uppercase tracking-wider font-bold text-artisan-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Live Chat Widget Preview</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">Real-time Grounded</span>
            </div>

            <LivePreviewCard />
          </div>

        </div>

      </div>
    </div>
  );
};
