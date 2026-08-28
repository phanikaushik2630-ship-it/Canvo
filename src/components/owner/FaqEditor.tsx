import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { FAQItem } from '../../types';
import { HelpCircle, Plus, Trash2, Edit2, Check, X, Sparkles, Folder } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface FaqEditorProps {
  onNotify: (text: string) => void;
  prefillQuestion?: string;
  onClearPrefill?: () => void;
}

export const FaqEditor: React.FC<FaqEditorProps> = ({ onNotify, prefillQuestion, onClearPrefill }) => {
  const { businessData, addFaq, updateFaq, deleteFaq } = useBusiness();
  const { faqs } = businessData;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Handle prefill from Analytics 1-click action
  useEffect(() => {
    if (prefillQuestion) {
      setQuestion(prefillQuestion);
      setAnswer('');
      setCategory('General');
      setEditingFaq(null);
      setIsModalOpen(true);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefillQuestion]);

  const categories = ['General', 'Dietary & Allergens', 'Visiting & Timing', 'Amenities & Policies', 'Ordering & Reservations'];
  const allCategories = ['All', ...Array.from(new Set(faqs.map(f => f.category || 'General')))];

  const handleOpenNew = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: FAQItem) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || 'General');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    try {
      if (editingFaq) {
        await updateFaq(editingFaq.id, { question, answer, category });
        onNotify('Updated FAQ knowledge entry!');
      } else {
        await addFaq({ question, answer, category });
        onNotify('Added new FAQ to bot knowledge base!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save FAQ');
    }
  };

  const handleDelete = async (id: string, q: string) => {
    if (confirm(`Delete FAQ "${q}"?`)) {
      await deleteFaq(id);
      onNotify('Deleted FAQ item.');
    }
  };

  const filteredFaqs = faqs.filter(f => 
    selectedCategoryFilter === 'All' ? true : (f.category || 'General') === selectedCategoryFilter
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-artisan-200">
        <div>
          <h3 className="font-serif font-bold text-xl text-artisan-950 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-terracotta-500" />
            <span>FAQ Knowledge Base ({faqs.length})</span>
          </h3>
          <p className="text-xs text-artisan-500 mt-0.5">
            Train your AI bot on common questions, parking, dietary rules, and policies.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="btn-primary !text-xs !py-2 !px-4"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      {allCategories.length > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategoryFilter === cat
                  ? 'bg-artisan-950 text-white shadow-warm-sm'
                  : 'bg-artisan-100 text-artisan-700 hover:bg-artisan-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* FAQs List */}
      {faqs.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No FAQs Added Yet"
          description="Add answers to common customer questions about reservations, parking, dietary options, or pickup policies."
          actionLabel="Add First FAQ"
          onAction={handleOpenNew}
        />
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map(faq => (
            <div
              key={faq.id}
              className="p-5 rounded-2xl bg-white border border-artisan-200 hover:border-artisan-300 shadow-warm-sm flex items-start justify-between gap-4 transition-all"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-artisan-100 text-artisan-700">
                    {faq.category || 'General'}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-artisan-950">
                  {faq.question}
                </h4>
                <p className="text-xs text-artisan-600 leading-relaxed whitespace-pre-wrap">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 pt-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(faq)}
                  className="p-1.5 rounded-lg text-artisan-500 hover:text-artisan-900 hover:bg-artisan-100 transition-colors"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(faq.id, faq.question)}
                  className="p-1.5 rounded-lg text-artisan-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-artisan-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-warm-xl border border-artisan-200 space-y-5 animate-scale-up">
            
            <div className="flex items-center justify-between pb-3 border-b border-artisan-200">
              <h3 className="font-serif font-bold text-lg text-artisan-950">
                {editingFaq ? 'Edit FAQ Entry' : 'Add FAQ to Bot Knowledge'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-artisan-400 hover:text-artisan-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-artisan text-xs w-full"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider">
                  Question Asked by Customers
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Do you offer custom wedding cakes?"
                  className="input-artisan text-xs w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider">
                  Verified Bot Answer
                </label>
                <textarea
                  required
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="e.g. Yes! We create custom tiered cakes with 2 weeks advance notice. Please call or email our cake specialist."
                  className="input-artisan text-xs w-full resize-none leading-relaxed"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-artisan-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary !text-xs !py-2 !px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary !text-xs !py-2 !px-5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingFaq ? 'Save Changes' : 'Add FAQ'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
