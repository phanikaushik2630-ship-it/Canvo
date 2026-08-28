import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-artisan-200/80 rounded-2xl rounded-tl-sm w-fit shadow-warm-sm animate-message-appear">
      <span className="w-2 h-2 rounded-full bg-terracotta-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
      <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
      <span className="w-2 h-2 rounded-full bg-terracotta-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
      <span className="text-[11px] text-artisan-500 font-medium ml-1.5 font-sans">Checking bakery knowledge...</span>
    </div>
  );
};
