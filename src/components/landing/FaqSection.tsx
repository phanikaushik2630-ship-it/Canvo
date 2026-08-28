import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { useChat } from '../../context/ChatContext';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Sparkles } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { businessData } = useBusiness();
  const { faqs, botConfig } = businessData;
  const { prefillAndOpen, setIsOpen } = useChat();

  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  return (
    <section id="faqs" className="py-16 sm:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-honey-100 text-honey-800 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Customer Knowledge Base</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-artisan-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-artisan-600 text-sm sm:text-base">
            Everything you need to know about our daily bakes, dietary options, pre-orders, and patio policies.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className="card-artisan overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full shrink-0">
                      {faq.category || 'General'}
                    </span>
                    <span className="font-serif font-bold text-base sm:text-lg text-artisan-900 group-hover:text-terracotta-600 transition-colors">
                      {faq.question}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-artisan-100 flex items-center justify-center text-artisan-600 group-hover:bg-terracotta-100 group-hover:text-terracotta-700 transition-colors shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-sm text-artisan-700 leading-relaxed border-t border-artisan-100 mt-1 animate-fadeIn">
                    <p className="pt-3">{faq.answer}</p>
                    
                    <div className="pt-3 mt-3 border-t border-artisan-100/60 flex justify-end">
                      <button
                        onClick={() => prefillAndOpen(`Regarding "${faq.question}": can you give me more details?`, true)}
                        className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Ask {botConfig.botName} a follow-up question</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 p-6 rounded-3xl bg-terracotta-50 border border-terracotta-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-warm-sm">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center shrink-0 shadow-warm-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-artisan-950">
                Have a unique question not listed here?
              </h4>
              <p className="text-xs text-artisan-600">
                Our AI Concierge <strong>{botConfig.botName}</strong> is grounded in all bakery details and responds instantly.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="btn-primary !py-2.5 !px-5 text-xs shrink-0 whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat with {botConfig.botName}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
