import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { BotConfig, BotTone, CommerceMode } from '../../types';
import { Bot, Palette, Sparkles, Save, Shield, Plus, X, ShoppingBag, Calendar, Lock } from 'lucide-react';

interface BotCustomizerProps {
  onNotify: (text: string) => void;
}

const COLOR_PRESETS = [
  { label: 'Terracotta Warm', hex: '#C9633A' },
  { label: 'Wild Sage Green', hex: '#4D6652' },
  { label: 'Dark Roast Espresso', hex: '#2B1F17' },
  { label: 'Midnight Navy', hex: '#1E293B' },
  { label: 'Honeycomb Amber', hex: '#D49B37' },
  { label: 'Rose Coral', hex: '#E11D48' },
  { label: 'Forest Pine', hex: '#164E63' },
];

export const BotCustomizer: React.FC<BotCustomizerProps> = ({ onNotify }) => {
  const { businessData, updateBotConfig } = useBusiness();
  const { botConfig } = businessData;

  const [form, setForm] = useState<BotConfig>({ 
    ...botConfig,
    commerceMode: botConfig.commerceMode || 'both'
  });
  const [topicInput, setTopicInput] = useState('');
  const [promptInput, setPromptInput] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBotConfig(form);
    onNotify('AI Concierge branding, tone & commerce settings saved to database!');
  };

  const handleAddTopic = () => {
    if (topicInput.trim() && !form.prohibitedTopics?.includes(topicInput.trim())) {
      setForm(prev => ({
        ...prev,
        prohibitedTopics: [...(prev.prohibitedTopics || []), topicInput.trim()]
      }));
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (idx: number) => {
    setForm(prev => ({
      ...prev,
      prohibitedTopics: prev.prohibitedTopics?.filter((_, i) => i !== idx)
    }));
  };

  const handleAddPrompt = () => {
    if (promptInput.trim() && !form.suggestedQuestions?.includes(promptInput.trim())) {
      setForm(prev => ({
        ...prev,
        suggestedQuestions: [...(prev.suggestedQuestions || []), promptInput.trim()]
      }));
      setPromptInput('');
    }
  };

  const handleRemovePrompt = (idx: number) => {
    setForm(prev => ({
      ...prev,
      suggestedQuestions: prev.suggestedQuestions.filter((_, i) => i !== idx)
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-artisan-200">
        <div>
          <h3 className="font-serif font-bold text-xl text-artisan-950 flex items-center gap-2">
            <Bot className="w-5 h-5 text-terracotta-500" />
            <span>Bot Identity, Capabilities & Personality</span>
          </h3>
          <p className="text-xs text-artisan-500 mt-0.5">
            Customize your AI concierge's appearance, in-chat ordering / booking mode, and tone.
          </p>
        </div>

        <button type="submit" className="btn-primary">
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {/* PHASE 4: IN-CHAT COMMERCE CAPABILITY TOGGLE */}
      <div className="p-4 sm:p-5 rounded-2xl bg-terracotta-50/50 border border-terracotta-200/80 shadow-warm-sm space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-terracotta-600" />
          <span className="text-xs font-bold text-artisan-900 uppercase tracking-wider">
            In-Chat Ordering & Booking Mode (Phase 4)
          </span>
        </div>
        <p className="text-xs text-artisan-600">
          Select what types of direct customer actions your bot can capture and route to your Orders inbox.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          
          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, commerceMode: 'both' }))}
            className={`p-3 rounded-xl border text-left transition-all ${
              form.commerceMode === 'both'
                ? 'bg-white border-terracotta-500 ring-2 ring-terracotta-500/20 shadow-warm-sm'
                : 'bg-white/60 border-artisan-200 hover:border-artisan-300'
            }`}
          >
            <div className="flex items-center gap-2 font-serif font-bold text-xs text-artisan-950 mb-1">
              <ShoppingBag className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Orders & Bookings</span>
            </div>
            <p className="text-[10px] text-artisan-500 leading-tight">
              Support both takeout menu orders and table / appointment bookings.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, commerceMode: 'orders' }))}
            className={`p-3 rounded-xl border text-left transition-all ${
              form.commerceMode === 'orders'
                ? 'bg-white border-terracotta-500 ring-2 ring-terracotta-500/20 shadow-warm-sm'
                : 'bg-white/60 border-artisan-200 hover:border-artisan-300'
            }`}
          >
            <div className="flex items-center gap-2 font-serif font-bold text-xs text-artisan-950 mb-1">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
              <span>Takeout Orders Only</span>
            </div>
            <p className="text-[10px] text-artisan-500 leading-tight">
              Food items, pricing, quantities, pickup orders (Bakery, Café, Retail).
            </p>
          </button>

          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, commerceMode: 'bookings' }))}
            className={`p-3 rounded-xl border text-left transition-all ${
              form.commerceMode === 'bookings'
                ? 'bg-white border-terracotta-500 ring-2 ring-terracotta-500/20 shadow-warm-sm'
                : 'bg-white/60 border-artisan-200 hover:border-artisan-300'
            }`}
          >
            <div className="flex items-center gap-2 font-serif font-bold text-xs text-artisan-950 mb-1">
              <Calendar className="w-3.5 h-3.5 text-sage-600" />
              <span>Bookings Only</span>
            </div>
            <p className="text-[10px] text-artisan-500 leading-tight">
              Party size, date, time slots (Restaurants, Salons, Wellness, Gyms).
            </p>
          </button>

          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, commerceMode: 'none' }))}
            className={`p-3 rounded-xl border text-left transition-all ${
              form.commerceMode === 'none'
                ? 'bg-white border-terracotta-500 ring-2 ring-terracotta-500/20 shadow-warm-sm'
                : 'bg-white/60 border-artisan-200 hover:border-artisan-300'
            }`}
          >
            <div className="flex items-center gap-2 font-serif font-bold text-xs text-artisan-950 mb-1">
              <Lock className="w-3.5 h-3.5 text-artisan-400" />
              <span>Inquiry Only</span>
            </div>
            <p className="text-[10px] text-artisan-500 leading-tight">
              Pure question-and-answer concierge without order buttons.
            </p>
          </button>

        </div>
      </div>

      {/* Identity Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            AI Concierge Name *
          </label>
          <input
            type="text"
            required
            value={form.botName}
            onChange={(e) => setForm(prev => ({ ...prev, botName: e.target.value }))}
            className="input-artisan"
            placeholder="e.g. Mira, Jax, Chef Marco"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Role Subtitle
          </label>
          <input
            type="text"
            value={form.botRoleTitle}
            onChange={(e) => setForm(prev => ({ ...prev, botRoleTitle: e.target.value }))}
            className="input-artisan"
            placeholder="e.g. Head Concierge & Guide"
          />
        </div>

      </div>

      {/* Color Palette Customizer */}
      <div className="p-4 rounded-2xl bg-white border border-artisan-200/90 shadow-warm-sm space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-terracotta-500" />
          <span className="text-xs font-bold text-artisan-900 uppercase tracking-wider">
            Widget Theme Color
          </span>
        </div>

        {/* Color presets pills */}
        <div className="flex flex-wrap gap-2.5">
          {COLOR_PRESETS.map((color) => {
            const isSelected = (form.themeColor || '#C9633A').toLowerCase() === color.hex.toLowerCase();

            return (
              <button
                key={color.hex}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, themeColor: color.hex }))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-artisan-900 bg-artisan-100 shadow-warm-sm font-bold'
                    : 'border-artisan-200 bg-white hover:bg-artisan-50'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: color.hex }}></span>
                <span>{color.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Hex input */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs text-artisan-600 font-medium">Or custom hex:</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.themeColor || '#C9633A'}
              onChange={(e) => setForm(prev => ({ ...prev, themeColor: e.target.value }))}
              className="w-8 h-8 rounded-lg cursor-pointer border border-artisan-300 p-0.5"
            />
            <input
              type="text"
              value={form.themeColor || '#C9633A'}
              onChange={(e) => setForm(prev => ({ ...prev, themeColor: e.target.value }))}
              className="input-artisan !w-28 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Personality & Tone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Personality Tone
          </label>
          <select
            value={form.tone}
            onChange={(e) => setForm(prev => ({ ...prev, tone: e.target.value as BotTone }))}
            className="input-artisan"
          >
            <option value="warm_artisan">Warm & Friendly (Artisan charm, hospitable, polite)</option>
            <option value="crisp_professional">Crisp & Formal (Structured, professional, concise)</option>
            <option value="playful_casual">Playful & Casual (Approachable, modern, lively)</option>
            <option value="direct_concise">Direct & Concise (Bullet points and fast facts only)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Avatar Image URL
          </label>
          <input
            type="text"
            value={form.avatarUrl}
            onChange={(e) => setForm(prev => ({ ...prev, avatarUrl: e.target.value }))}
            className="input-artisan text-xs"
            placeholder="/assets/mira-avatar.jpg"
          />
        </div>

      </div>

      {/* Welcome Greeting */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
          First Welcome Message to Customers
        </label>
        <textarea
          rows={2}
          value={form.welcomeMessage}
          onChange={(e) => setForm(prev => ({ ...prev, welcomeMessage: e.target.value }))}
          className="input-artisan"
          placeholder="Hello! How may I assist you today?"
        />
      </div>

      {/* Custom Prompt Guidelines */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
          Custom System Directives & Instructions
        </label>
        <textarea
          rows={3}
          value={form.customInstructions}
          onChange={(e) => setForm(prev => ({ ...prev, customInstructions: e.target.value }))}
          className="input-artisan"
          placeholder="e.g. Always mention our daily happy hour between 3-5 PM..."
        />
      </div>

      {/* Prohibited Topics */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-rose-500" />
          <span>Prohibited Topics & Strict Boundary Words</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.prohibitedTopics?.map((topic, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 text-xs bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full"
            >
              <span>{topic}</span>
              <button
                type="button"
                onClick={() => handleRemoveTopic(idx)}
                className="hover:text-rose-950"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTopic(); } }}
            placeholder="Add prohibited topic..."
            className="input-artisan text-xs"
          />
          <button
            type="button"
            onClick={handleAddTopic}
            className="btn-secondary !text-xs !py-1.5 !px-3 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" className="btn-primary">
          <Save className="w-4 h-4" />
          <span>Save Bot Persona & Capabilities</span>
        </button>
      </div>

    </form>
  );
};
