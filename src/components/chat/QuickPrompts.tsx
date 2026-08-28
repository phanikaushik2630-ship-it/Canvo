import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { useChat } from '../../context/ChatContext';
import { Sparkles } from 'lucide-react';

export const QuickPrompts: React.FC = () => {
  const { businessData } = useBusiness();
  const { botConfig } = businessData;
  const { sendMessage, isStreaming } = useChat();

  const prompts = botConfig.suggestedQuestions || [
    'What are today’s opening hours?',
    'What is in the Pistachio Cruffin?',
    'Do you have gluten-free options?'
  ];

  return (
    <div className="px-3.5 py-2 border-t border-artisan-100 bg-artisan-50/80">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-artisan-500 mb-1.5">
        <Sparkles className="w-3 h-3 text-honey-500" />
        <span>Suggested:</span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            disabled={isStreaming}
            onClick={() => sendMessage(prompt)}
            className="text-xs bg-white hover:bg-terracotta-50 hover:text-terracotta-800 text-artisan-800 border border-artisan-200 hover:border-terracotta-300 rounded-full px-3 py-1 whitespace-nowrap transition-all shadow-warm-sm shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
