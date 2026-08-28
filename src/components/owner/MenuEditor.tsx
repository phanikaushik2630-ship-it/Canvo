import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { MenuItem, DietaryTag } from '../../types';
import { Utensils, Plus, Edit2, Trash2, Check, X, Flame } from 'lucide-react';

interface MenuEditorProps {
  onNotify: (text: string) => void;
}

const ALL_DIETARY_TAGS: DietaryTag[] = [
  'Vegan',
  'Vegetarian',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Organic',
  'House Favorite',
  'Seasonal',
  'Sourdough'
];

export const MenuEditor: React.FC<MenuEditorProps> = ({ onNotify }) => {
  const { businessData, addMenuItem, updateMenuItem, deleteMenuItem } = useBusiness();
  const { menu, profile } = businessData;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [form, setForm] = useState<{
    name: string;
    category: string;
    price: number;
    description: string;
    dietaryTags: DietaryTag[];
    isAvailable: boolean;
    preparationNote: string;
    ingredientsStr: string;
  }>({
    name: '',
    category: 'Viennoiserie & Pastries',
    price: 5.50,
    description: '',
    dietaryTags: [],
    isAvailable: true,
    preparationNote: '',
    ingredientsStr: '',
  });

  const categories = [...new Set(menu.map(m => m.category))];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      name: '',
      category: categories[0] || 'Viennoiserie & Pastries',
      price: 6.00,
      description: '',
      dietaryTags: [],
      isAvailable: true,
      preparationNote: '',
      ingredientsStr: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      dietaryTags: item.dietaryTags || [],
      isAvailable: item.isAvailable,
      preparationNote: item.preparationNote || '',
      ingredientsStr: item.ingredients ? item.ingredients.join(', ') : '',
    });
    setModalOpen(true);
  };

  const handleToggleTag = (tag: DietaryTag) => {
    setForm(prev => {
      const exists = prev.dietaryTags.includes(tag);
      return {
        ...prev,
        dietaryTags: exists
          ? prev.dietaryTags.filter(t => t !== tag)
          : [...prev.dietaryTags, tag]
      };
    });
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredients = form.ingredientsStr
      ? form.ingredientsStr.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        description: form.description,
        dietaryTags: form.dietaryTags,
        isAvailable: form.isAvailable,
        preparationNote: form.preparationNote,
        ingredients,
      });
      onNotify(`Updated "${form.name}" in menu & AI concierge knowledge!`);
    } else {
      addMenuItem({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        description: form.description,
        dietaryTags: form.dietaryTags,
        isAvailable: form.isAvailable,
        preparationNote: form.preparationNote,
        ingredients,
      });
      onNotify(`Added "${form.name}" to menu & AI concierge knowledge!`);
    }
    setModalOpen(false);
  };

  const handleDelete = (item: MenuItem) => {
    if (confirm(`Remove "${item.name}" from menu and AI knowledge?`)) {
      deleteMenuItem(item.id);
      onNotify(`Removed "${item.name}"`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-artisan-200">
        <div>
          <h3 className="font-serif font-bold text-xl text-artisan-950 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-terracotta-500" />
            <span>Menu & Offerings Catalog</span>
          </h3>
          <p className="text-xs text-artisan-500 mt-0.5">
            Add items, update prices, and tag allergens. Changes update customer view and AI concierge instantly.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-primary self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menu.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-white border border-artisan-200/90 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-artisan-400 block">
                    {item.category}
                  </span>
                  <h4 className="font-serif font-bold text-base text-artisan-950 flex items-center gap-1.5">
                    <span>{item.name}</span>
                    {item.dietaryTags?.includes('House Favorite') && (
                      <Flame className="w-3.5 h-3.5 fill-honey-500 text-honey-500" />
                    )}
                  </h4>
                </div>

                <span className="font-serif font-bold text-sm text-terracotta-700 bg-terracotta-50 px-2.5 py-1 rounded-full shrink-0">
                  {profile.currency}{item.price.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-artisan-600 line-clamp-2">
                {item.description}
              </p>

              {item.dietaryTags && item.dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.dietaryTags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-artisan-100 text-artisan-700">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-artisan-100">
              <div className="text-[11px] text-artisan-500">
                {item.isAvailable ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Available
                  </span>
                ) : (
                  <span className="text-rose-600 font-medium">Sold Out</span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg hover:bg-artisan-100 text-artisan-600 hover:text-artisan-950 transition-colors"
                  title="Edit item"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-artisan-400 hover:text-rose-600 transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-artisan-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-warm-xl border border-artisan-200 animate-scale-in">
            
            <div className="flex items-center justify-between pb-4 border-b border-artisan-200">
              <h3 className="font-serif font-bold text-lg text-artisan-950">
                {editingItem ? `Edit "${editingItem.name}"` : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-artisan-100 text-artisan-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 pt-4">
              
              <div>
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input-artisan"
                  placeholder="e.g. Cardamom Honey Cruffin"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="input-artisan"
                    placeholder="e.g. Viennoiserie & Pastries"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                    Price ({profile.currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    required
                    value={form.price}
                    onChange={(e) => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="input-artisan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-artisan"
                  placeholder="Flavor notes, pastry layers, glaze..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                  Key Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  value={form.ingredientsStr}
                  onChange={(e) => setForm(prev => ({ ...prev, ingredientsStr: e.target.value }))}
                  className="input-artisan"
                  placeholder="e.g. Normandy butter, Organic flour, Rose petals"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                  Preparation or Fresh Oven Note
                </label>
                <input
                  type="text"
                  value={form.preparationNote}
                  onChange={(e) => setForm(prev => ({ ...prev, preparationNote: e.target.value }))}
                  className="input-artisan"
                  placeholder="e.g. Baked fresh at 6:45 AM daily."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-2">
                  Dietary & Allergen Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_DIETARY_TAGS.map(tag => {
                    const isSelected = form.dietaryTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`text-xs px-3 py-1 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-terracotta-500 text-white border-terracotta-500 shadow-warm-sm'
                            : 'bg-artisan-50 text-artisan-700 border-artisan-200 hover:bg-artisan-100'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={form.isAvailable}
                  onChange={(e) => setForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  className="rounded text-terracotta-500 focus:ring-terracotta-500"
                />
                <label htmlFor="availCheck" className="text-xs font-medium text-artisan-800">
                  Currently available for customer order today
                </label>
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
                  className="btn-primary !text-xs"
                >
                  {editingItem ? 'Save Updates' : 'Add Item'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
