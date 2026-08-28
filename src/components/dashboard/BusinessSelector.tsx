import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Store, Plus, Check, ChevronDown, Sparkles } from 'lucide-react';

interface BusinessSelectorProps {
  onNotify: (text: string) => void;
}

export const BusinessSelector: React.FC<BusinessSelectorProps> = ({ onNotify }) => {
  const { businessData, myBusinesses, activeBusinessId, selectMyBusiness, createNewBusiness } = useBusiness();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Local Restaurant & Bistro');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const created = await createNewBusiness(newName.trim(), newCategory);
      setModalOpen(false);
      setNewName('');
      onNotify(`Created new business "${created.profile.name}"!`);
    } catch (err: any) {
      alert(err.message || 'Creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      
      {/* Dropdown Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-artisan-200 hover:border-artisan-300 shadow-warm-sm transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-terracotta-500/10 border border-terracotta-500/30 flex items-center justify-center text-terracotta-600 font-serif font-bold text-sm">
            {businessData.profile.name.charAt(0)}
          </div>
          <div>
            <div className="text-xs font-bold text-artisan-950 font-serif flex items-center gap-1.5">
              <span>{businessData.profile.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-artisan-400 group-hover:text-artisan-700 transition-transform" />
            </div>
            <div className="text-[10px] text-artisan-500 font-mono">
              /b/{businessData.profile.slug}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-secondary !text-xs !p-2 rounded-xl"
          title="Add another business"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-artisan-200 shadow-warm-xl p-2 z-50 animate-slide-down">
          <div className="text-[10px] uppercase tracking-wider font-bold text-artisan-400 px-3 py-1.5">
            Your Businesses ({myBusinesses.length})
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto">
            {myBusinesses.map((biz) => {
              const isCurrent = biz.profile.id === activeBusinessId;

              return (
                <button
                  key={biz.profile.id}
                  onClick={() => {
                    selectMyBusiness(biz.profile.id);
                    setDropdownOpen(false);
                    onNotify(`Switched active business to ${biz.profile.name}`);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                    isCurrent ? 'bg-artisan-100 text-artisan-950 font-bold' : 'hover:bg-artisan-50 text-artisan-800'
                  }`}
                >
                  <div className="truncate">
                    <div className="text-xs font-serif truncate">{biz.profile.name}</div>
                    <div className="text-[10px] text-artisan-500 font-mono">/b/{biz.profile.slug}</div>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-terracotta-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-2 border-t border-artisan-100">
            <button
              onClick={() => {
                setDropdownOpen(false);
                setModalOpen(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-terracotta-600 hover:bg-terracotta-50 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Business</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-artisan-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-warm-xl border border-artisan-200 animate-scale-in">
            <h3 className="font-serif font-bold text-xl text-artisan-950 mb-2">
              Create a New Business Bot
            </h3>
            <p className="text-xs text-artisan-500 mb-5">
              Set up an isolated profile, menu catalog, hours, and chatbot concierge for another venue.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input-artisan"
                  placeholder="e.g. Copper Kettle Roasters"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="input-artisan"
                  placeholder="e.g. Coffee Roastery & Pastry Lab"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-artisan-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary !text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !newName.trim()}
                  className="btn-primary !text-xs"
                >
                  {loading ? 'Creating...' : 'Create Business'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
