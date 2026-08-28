import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { BasicInfoEditor } from './BasicInfoEditor';
import { HoursEditor } from './HoursEditor';
import { MenuEditor } from './MenuEditor';
import { FaqEditor } from './FaqEditor';
import { AiGuardrailsEditor } from './AiGuardrailsEditor';
import { PresetSelector } from './PresetSelector';
import { SandboxDrawer } from './SandboxDrawer';
import { OrdersInbox } from '../dashboard/OrdersInbox';
import { fetchOrdersApi } from '../../services/api';
import { 
  Store, 
  Clock, 
  Utensils, 
  HelpCircle, 
  Bot, 
  Layers, 
  Sparkles, 
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';

interface OwnerDashboardProps {
  onBackToLanding: () => void;
  onNotify: (text: string) => void;
}

type TabType = 'orders' | 'profile' | 'hours' | 'menu' | 'faqs' | 'guardrails' | 'presets';

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onBackToLanding, onNotify }) => {
  const { businessData } = useBusiness();
  const { profile, botConfig, menu, faqs, hours } = businessData;
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (profile.id) {
      fetchOrdersApi(profile.id, 'new')
        .then(orders => setPendingCount(orders.length))
        .catch(() => {});
    }
  }, [profile.id, activeTab]);

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; count?: number; highlight?: boolean }[] = [
    { id: 'orders', label: 'Orders & Bookings', icon: ShoppingBag, count: pendingCount > 0 ? pendingCount : undefined, highlight: true },
    { id: 'menu', label: 'Menu & Services', icon: Utensils, count: menu.length },
    { id: 'hours', label: 'Operating Hours', icon: Clock, count: hours.filter(h => h.isOpen).length },
    { id: 'faqs', label: 'FAQ Knowledge Base', icon: HelpCircle, count: faqs.length },
    { id: 'guardrails', label: 'AI Persona & Capabilities', icon: Bot },
    { id: 'profile', label: 'Storefront Profile & Global Settings', icon: Store },
    { id: 'presets', label: 'Presets & JSON Data', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-artisan-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-artisan-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToLanding}
                className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600 hover:text-terracotta-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Storefront</span>
              </button>
              <span className="text-artisan-300">•</span>
              <span className="text-xs uppercase tracking-widest font-bold text-artisan-500">
                Owner Management Studio
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-artisan-950">
              {profile.name} — AI Control Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white px-3.5 py-1.5 rounded-full border border-artisan-200 text-xs font-medium text-artisan-700 shadow-warm-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-indicator"></span>
              <span>AI Concierge: <strong>{botConfig.botName}</strong> ({botConfig.tone})</span>
            </div>
          </div>
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Configuration Panel (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Horizontal Tabs Navigation */}
            <div className="bg-white/90 p-1.5 rounded-2xl border border-artisan-200 shadow-warm-sm flex gap-1 overflow-x-auto scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all touch-target shrink-0 ${
                      isActive
                        ? 'bg-artisan-900 text-white shadow-warm-sm font-semibold'
                        : tab.highlight
                        ? 'bg-terracotta-50 text-terracotta-700 font-semibold'
                        : 'text-artisan-600 hover:bg-artisan-100 hover:text-artisan-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-honey-400' : 'text-artisan-400'}`} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Tab Card */}
            <div className="bg-white/95 rounded-3xl p-4 sm:p-8 border border-artisan-200/90 shadow-warm-md">
              {activeTab === 'orders' && <OrdersInbox onNotify={onNotify} />}
              {activeTab === 'profile' && <BasicInfoEditor onNotify={onNotify} />}
              {activeTab === 'hours' && <HoursEditor onNotify={onNotify} />}
              {activeTab === 'menu' && <MenuEditor onNotify={onNotify} />}
              {activeTab === 'faqs' && <FaqEditor onNotify={onNotify} />}
              {activeTab === 'guardrails' && <AiGuardrailsEditor onNotify={onNotify} />}
              {activeTab === 'presets' && <PresetSelector onNotify={onNotify} />}
            </div>

          </div>

          {/* Real-time Sandbox Testing Drawer (Right 5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs uppercase tracking-wider font-bold text-artisan-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Instant Verification Sandbox</span>
              </span>
              <span className="text-[11px] text-artisan-400">Updates sync in real-time</span>
            </div>

            <SandboxDrawer />
          </div>

        </div>

      </div>
    </div>
  );
};
