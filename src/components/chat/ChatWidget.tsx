import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { useChat } from '../../context/ChatContext';
import { ChatWindow } from './ChatWindow';
import { MessageSquare, X, Sparkles } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const { businessData } = useBusiness();
  const { botConfig, profile } = businessData;
  const { isOpen, setIsOpen } = useChat();

  const [showTeaser, setShowTeaser] = useState(false);

  // Show teaser tooltip after 3 seconds on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTeaser(true);
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Hide teaser when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
    }
  }, [isOpen]);

  return (
    <>
      <ChatWindow />

      {/* Floating Launcher Area */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
          
          {/* Gentle Teaser Bubble */}
          {showTeaser && (
            <div className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md border border-terracotta-200/90 text-artisan-900 text-xs px-3.5 py-2 rounded-2xl shadow-warm-lg animate-slide-up relative">
              <Sparkles className="w-3.5 h-3.5 text-honey-500 shrink-0" />
              <span>Ask <strong>{botConfig.botName}</strong> about today's fresh bakes & hours!</span>
              <button
                onClick={() => setShowTeaser(false)}
                className="text-artisan-400 hover:text-artisan-600 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
              {/* Triangle pointer */}
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-terracotta-200/90 rotate-45"></div>
            </div>
          )}

          {/* Main Floating Trigger Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white pl-2 pr-4.5 py-2 rounded-full shadow-warm-xl hover:shadow-glow-terracotta transition-all duration-300 transform hover:scale-105 active:scale-95"
            title={`Chat with ${botConfig.botName}`}
          >
            {/* Avatar with live pulse ring */}
            <div className="relative">
              <img
                src={botConfig.avatarUrl || '/assets/mira-avatar.jpg'}
                alt={botConfig.botName}
                className="w-9 h-9 rounded-full object-cover border-2 border-white/80 bg-white"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white pulse-indicator"></span>
            </div>

            {/* Label */}
            <div className="text-left">
              <div className="text-xs font-bold font-serif leading-tight">
                Ask {botConfig.botName}
              </div>
              <div className="text-[10px] text-terracotta-100 font-medium tracking-wide">
                AI Concierge
              </div>
            </div>
          </button>

        </div>
      )}
    </>
  );
};
