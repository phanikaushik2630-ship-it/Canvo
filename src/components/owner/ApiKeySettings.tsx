import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { checkBackendHealth } from '../../services/api';
import { Key, Cpu, ShieldCheck, Eye, EyeOff, Save, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface ApiKeySettingsProps {
  onNotify: (text: string) => void;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ onNotify }) => {
  const { businessData, updateApiSettings } = useBusiness();
  const { apiSettings } = businessData;

  const [form, setForm] = useState({ ...apiSettings });
  const [showKey, setShowKey] = useState(false);
  const [backendHealth, setBackendHealth] = useState<{ status: string; hasEnvKey: boolean } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    const health = await checkBackendHealth();
    setBackendHealth(health);
    setIsChecking(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateApiSettings(form);
    onNotify('API & model settings saved successfully!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-artisan-200">
        <div>
          <h3 className="font-serif font-bold text-xl text-artisan-950 flex items-center gap-2">
            <Key className="w-5 h-5 text-terracotta-500" />
            <span>Claude API & AI Model Engine</span>
          </h3>
          <p className="text-xs text-artisan-500 mt-0.5">
            Connect your Anthropic Claude API key or use our zero-setup Smart Grounding Fallback.
          </p>
        </div>

        <button type="submit" className="btn-primary">
          <Save className="w-4 h-4" />
          <span>Save API Settings</span>
        </button>
      </div>

      {/* Connection Status Box */}
      <div className="p-4 rounded-2xl bg-white border border-artisan-200/90 shadow-warm-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            backendHealth?.status === 'ok' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-artisan-950">
                Backend Status: {backendHealth?.status === 'ok' ? 'Online' : 'Checking / Standby'}
              </span>
              {backendHealth?.hasEnvKey && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  ENV KEY ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-artisan-500">
              {form.anthropicApiKey || backendHealth?.hasEnvKey
                ? 'Ready for live streaming Claude 3.5 API inference.'
                : 'Zero-config mode active: Grounded Semantic Matcher generates real-time verified answers.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={checkHealth}
          disabled={isChecking}
          className="btn-secondary !text-xs !py-1.5 !px-3"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          <span>Check Status</span>
        </button>
      </div>

      {/* API Key Input */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
          Anthropic Claude API Key (Optional)
        </label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={form.anthropicApiKey}
            onChange={(e) => setForm(prev => ({ ...prev, anthropicApiKey: e.target.value }))}
            className="input-artisan pr-10 font-mono text-xs"
            placeholder="sk-ant-api03-..."
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-artisan-400 hover:text-artisan-700"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[11px] text-artisan-500 mt-1">
          Keys entered here remain strictly inside your local browser session. You can also provide <code>ANTHROPIC_API_KEY</code> in <code>.env</code>.
        </p>
      </div>

      {/* Model Selection */}
      <div>
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1.5">
          Claude Model Selection
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <div
            onClick={() => setForm(prev => ({ ...prev, selectedModel: 'claude-3-5-haiku-20241022' }))}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              form.selectedModel === 'claude-3-5-haiku-20241022'
                ? 'bg-white border-2 border-terracotta-500 shadow-warm-md'
                : 'bg-white/60 border-artisan-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-serif font-bold text-sm text-artisan-950">Claude 3.5 Haiku</span>
              <span className="text-[10px] bg-terracotta-50 text-terracotta-700 px-2 py-0.5 rounded font-semibold">
                Ultra Fast & Economical
              </span>
            </div>
            <p className="text-xs text-artisan-500">
              Ideal for instantaneous customer chat and precise grounding.
            </p>
          </div>

          <div
            onClick={() => setForm(prev => ({ ...prev, selectedModel: 'claude-3-5-sonnet-latest' }))}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              form.selectedModel === 'claude-3-5-sonnet-latest'
                ? 'bg-white border-2 border-terracotta-500 shadow-warm-md'
                : 'bg-white/60 border-artisan-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-serif font-bold text-sm text-artisan-950">Claude 3.5 Sonnet</span>
              <span className="text-[10px] bg-artisan-200 text-artisan-800 px-2 py-0.5 rounded font-semibold">
                Highest Intelligence
              </span>
            </div>
            <p className="text-xs text-artisan-500">
              Top-tier nuance, rich culinary vocabulary, and strict reasoning.
            </p>
          </div>

        </div>
      </div>

      {/* Fallback Simulation Switch */}
      <div className="p-4 rounded-2xl bg-artisan-50 border border-artisan-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-terracotta-500" />
            <span className="font-semibold text-xs text-artisan-900">
              Zero-Config Grounding Simulation Mode
            </span>
          </div>
          <input
            type="checkbox"
            checked={form.useMockSimulation}
            onChange={(e) => setForm(prev => ({ ...prev, useMockSimulation: e.target.checked }))}
            className="rounded text-terracotta-500 focus:ring-terracotta-500"
          />
        </div>
        <p className="text-xs text-artisan-600 leading-relaxed">
          When enabled without an API key, Canvo uses a local semantic rule engine to simulate realistic AI streaming answers directly from the business data.
        </p>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" className="btn-primary">
          <Save className="w-4 h-4" />
          <span>Save API Configuration</span>
        </button>
      </div>

    </form>
  );
};
