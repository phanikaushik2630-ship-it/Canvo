import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { BotTone, CommerceMode } from '../../types';
import { Bot, Shield, Save, Plus, X, Sparkles, Sliders, ShoppingBag, Calendar, Lock } from 'lucide-react';

interface AiGuardrailsEditorProps {
  onNotify: (text: string) => void;
}

export const AiGuardrailsEditor: React.FC<AiGuardrailsEditorProps> = ({ onNotify }) => {
  const { businessData, updateBotConfig } = useBusiness();
  const { botConfig } = businessData;

  const [form, setForm] = useState({ 
    ...botConfig,
    commerceMode: botConfig.commerceMode || 'both'
  });
  const [topicInput, setTopicInput] = useState('');
  const [promptInput, setPromptInput] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBotConfig(form);
    onNotify('AI Concierge persona, commerce mode & strict guardrails updated!');
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
            <span>AI Persona & Commerce Mode</span>
          </h3>
          <p className="text-xs text-artisan-500 mt-0.5">
            Configure bot persona, in-chat ordering & booking capabilities, and strict grounding rules.
          </p>
        </div>

        <button type="submit" className="btn-primary">
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      {/* PHASE 4: IN-CHAT COMMERCE MODE TOGGLE */}
      <div className="card-artisan p-5 bg-terracotta-50/40 border-terracotta-200/80 space-y-3">
        <div>
          <label className="block text-xs font-bold text-artisan-900 uppercase tracking-wider mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-terracotta-500" />
            <span>In-Chat Commerce Capabilities (Phase 4)</span>
          </label>
          <p className="text-xs text-artisan-600">
            Control what structured actions customers can trigger directly in conversation with {form.botName}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          
          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, commerceMode: 'both' }))}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              form.commerceMode === 'both'
                ? 'bg-white border-terracotta-500 ring-2 ring-terracotta-500/20 shadow-warm-sm'
                : 'bg-white/60 border-artisan-200 hover:border-artisan-300'
            }`}
          >
            <div className="flex items-center gap-2 font-serif font-bold text-sm text-artisan-950 mb-1">
              <ShoppingBag className="w-4 h-4 text-terracotta-500" />
              <span>Orders & Bookings</span>
            </div>
            <p className="text-[11px] text-artisan-500 leading-tight">
              Support both takeout menu orders and table / appointment bookings.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, commerceMode: 'orders' }))}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              form.commerceMode === 'orders'
                ? 'bg-white border-terracotta-500 ring-2 ring-terracotta-500/20 shadow-warm-sm'
                : 'bg-white/60 border-artisan-200 hover:border-artisan-300'
            }`}
          >
            <div className="flex items-center gap-2 font-serif font-bold text-sm text-artisan-950 mb-1">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span>Takeout Orders Only</span>
            </div>
            <p className="text-[11px] text-artisan-500 leading-tight">
              Item quantities, menu pricing, curbside pickup (Bakery, Café, Retail).
            </p>
          </button>

          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, commerceMode: 'bookings' }))}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              form.commerceMode === 'bookings'
                ? 'bg-white border-terracotta-500 ring-2 ring-terracotta-500/20 shadow-warm-sm'
                : 'bg-white/60 border-artisan-200 hover:border-artisan-300'
            }`}
          >
            <div className="flex items-center gap-2 font-serif font-bold text-sm text-artisan-950 mb-1">
              <Calendar className="w-4 h-4 text-sage-600" />
              <span>Bookings Only</span>
            </div>
            <p className="text-[11px] text-artisan-500 leading-tight">
              Party size, date, time slots (Restaurants, Salons, Wellness, Gyms).
            </p>
          </button>

          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, commerceMode: 'none' }))}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              form.commerceMode === 'none'
                ? 'bg-white border-terracotta-500 ring-2 ring-terracotta-500/20 shadow-warm-sm'
                : 'bg-white/60 border-artisan-200 hover:border-artisan-300'
            }`}
          >
            <div className="flex items-center gap-2 font-serif font-bold text-sm text-artisan-950 mb-1">
              <Lock className="w-4 h-4 text-artisan-400" />
              <span>Inquiry Only</span>
            </div>
            <p className="text-[11px] text-artisan-500 leading-tight">
              Pure question-and-answer concierge. No direct order submission.
            </p>
          </button>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Bot Name */}
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
            placeholder="e.g. Mira"
          />
        </div>

        {/* Role Title */}
        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Role Title (displayed in header)
          </label>
          <input
            type="text"
            value={form.botRoleTitle}
            onChange={(e) => setForm(prev => ({ ...prev, botRoleTitle: e.target.value }))}
            className="input-artisan"
            placeholder="e.g. Head Concierge & Pâtisserie Guide"
          />
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
            Conversation Tone
          </label>
          <select
            value={form.tone}
            onChange={(e) => setForm(prev => ({ ...prev, tone: e.target.value as BotTone }))}
            className="input-artisan"
          >
            <option value="warm_artisan">Warm & Artisanal (Friendly, refined, hospitable charm)</option>
            <option value="crisp_professional">Crisp & Professional (Polite, structured, businesslike)</option>
            <option value="playful_casual">Playful & Casual (Approachable, modern, lively)</option>
            <option value="direct_concise">Direct & Concise (Brief, point-to-point facts)</option>
          </select>
        </div>

        {/* Strictness Level */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-artisan-700 uppercase tracking-wider">
              Strict Grounding Strictness (Level {form.strictnessLevel})
            </label>
            <span className="text-[11px] font-bold text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded">
              {form.strictnessLevel === 5 ? 'Max (Zero Speculation)' : 'Standard'}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={form.strictnessLevel}
            onChange={(e) => setForm(prev => ({ ...prev, strictnessLevel: parseInt(e.target.value) }))}
            className="w-full accent-terracotta-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-artisan-400 mt-1">
            <span>Relaxed</span>
            <span>Balanced</span>
            <span>Strict Grounding Only</span>
          </div>
        </div>

      </div>

      {/* Welcome Greeting */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
          First Welcome Greeting Message
        </label>
        <textarea
          rows={2}
          value={form.welcomeMessage}
          onChange={(e) => setForm(prev => ({ ...prev, welcomeMessage: e.target.value }))}
          className="input-artisan"
          placeholder="Bonjour! I am Mira, your concierge..."
        />
      </div>

      {/* Custom System Prompt Instructions */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
          Custom System Prompt Instructions (Internal Guidelines)
        </label>
        <textarea
          rows={3}
          value={form.customInstructions}
          onChange={(e) => setForm(prev => ({ ...prev, customInstructions: e.target.value }))}
          className="input-artisan"
          placeholder="Special rules, how to address callers, pronunciation notes, or pre-order reminders..."
        />
      </div>

      {/* Fallback Message for Out-of-Scope Queries */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
          Fallback Message for Unknown / Out-of-Bounds Queries
        </label>
        <input
          type="text"
          value={form.fallbackPhoneMessage}
          onChange={(e) => setForm(prev => ({ ...prev, fallbackPhoneMessage: e.target.value }))}
          className="input-artisan"
          placeholder="I don't have that specific detail in our notes, but please give our front desk a call at..."
        />
      </div>

      {/* Prohibited Topics */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-rose-500" />
          <span>Prohibited Topics (Strict Refusal)</span>
        </label>
        <div className="flex gap-2 mb-2.5">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="e.g. Medical advice, Competitor pricing, Political topics"
            className="input-artisan flex-1"
          />
          <button
            type="button"
            onClick={handleAddTopic}
            className="btn-secondary !px-4 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {form.prohibitedTopics?.map((topic, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs px-2.5 py-1 rounded-full font-medium"
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
      </div>

      {/* Suggested Quick Questions */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-honey-500" />
          <span>Suggested Questions (Quick Prompt Pills)</span>
        </label>
        <div className="flex gap-2 mb-2.5">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g. I would like to order 2 cruffins"
            className="input-artisan flex-1"
          />
          <button
            type="button"
            onClick={handleAddPrompt}
            className="btn-secondary !px-4 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {form.suggestedQuestions.map((q, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-honey-50 border border-honey-200 text-honey-900 text-xs px-2.5 py-1 rounded-full font-medium"
            >
              <span>{q}</span>
              <button
                type="button"
                onClick={() => handleRemovePrompt(idx)}
                className="hover:text-honey-950"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

    </form>
  );
};
