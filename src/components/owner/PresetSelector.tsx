import React, { useRef } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { presets } from '../../data/presets';
import { defaultBusinessData } from '../../data/defaultBusiness';
import { Layers, Download, Upload, RotateCcw, Check, Sparkles } from 'lucide-react';
import { exportBusinessDataAsJson, importBusinessDataFromJson } from '../../services/storage';

interface PresetSelectorProps {
  onNotify: (text: string) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onNotify }) => {
  const { 
    businessData, 
    setBusinessData,
    updateProfile,
    updateHours,
  } = useBusiness();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePresetClick = (key: string) => {
    if (confirm(`Switch current business view to preset "${presets[key].label}"?`)) {
      const presetData = JSON.parse(JSON.stringify(presets[key].business));
      setBusinessData(presetData);
      onNotify(`Switched view to ${presets[key].label}!`);
    }
  };

  const handleReset = () => {
    if (confirm('Reset to default Maison Mirabelle template?')) {
      setBusinessData(JSON.parse(JSON.stringify(defaultBusinessData)));
      onNotify('Reset business to default state.');
    }
  };

  const handleExport = () => {
    exportBusinessDataAsJson(businessData);
    onNotify('Exported business JSON configuration!');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importBusinessDataFromJson(file);
      setBusinessData(imported);
      onNotify('Successfully imported business configuration JSON!');
    } catch {
      alert('Failed to import JSON file. Please check structure.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-artisan-200">
        <h3 className="font-serif font-bold text-xl text-artisan-950 flex items-center gap-2">
          <Layers className="w-5 h-5 text-terracotta-500" />
          <span>Business Presets & Data Management</span>
        </h3>
        <p className="text-xs text-artisan-500 mt-0.5">
          Load preset business templates or backup & export complete configurations.
        </p>
      </div>

      {/* Preset Switcher Cards */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider">
          Demo Business Templates
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(presets).map(([key, preset]) => {
            const isActive = businessData.profile.id === preset.business.profile.id;

            return (
              <div
                key={key}
                onClick={() => handlePresetClick(key)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-white border-2 border-terracotta-500 shadow-warm-md -translate-y-0.5'
                    : 'bg-white/60 border-artisan-200 hover:bg-white hover:border-artisan-300'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-artisan-950">
                      {preset.business.profile.name}
                    </span>
                    {isActive && (
                      <span className="w-5 h-5 rounded-full bg-terracotta-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-artisan-500 line-clamp-2">
                    {preset.business.profile.tagline}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-artisan-100 flex items-center justify-between text-[10px] text-artisan-400">
                  <span>{preset.business.menu.length} items</span>
                  <span>{preset.business.faqs.length} FAQs</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup, Export & Import */}
      <div className="pt-4 border-t border-artisan-200 space-y-3">
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider">
          Data Backup & Migration
        </label>
        
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="btn-secondary !text-xs !py-2 !px-4"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Configuration JSON</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary !text-xs !py-2 !px-4"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Configuration JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary !text-xs !py-2 !px-4 hover:!text-rose-600 hover:!border-rose-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Demo Defaults</span>
          </button>
        </div>
      </div>

      {/* Live JSON Inspector */}
      <div className="pt-4 border-t border-artisan-200 space-y-2">
        <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider">
          Live State JSON Inspector
        </label>
        <pre className="bg-artisan-950 text-artisan-200 p-4 rounded-2xl text-[11px] font-mono max-h-60 overflow-y-auto border border-artisan-800">
          {JSON.stringify(businessData, null, 2)}
        </pre>
      </div>

    </div>
  );
};
