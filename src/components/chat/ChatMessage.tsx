import React from 'react';
import { ChatMessage as ChatMessageType, GroundedReference, Order } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { OrderActionCard } from './OrderActionCard';
import { Utensils, Clock, HelpCircle, Sparkles, Check, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  onOrderCompleted?: (messageId: string, order: Order) => void;
}

// Simple Markdown parser for clean bubble rendering
function renderMarkdown(content: string) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-4 space-y-1 my-1.5 text-xs sm:text-sm">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-artisan-950">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-artisan-800">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-artisan-100 text-terracotta-700 px-1 py-0.5 rounded text-[11px] font-mono">$1</code>');
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2));
    } else if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h-${lineIdx}`} className="font-serif font-bold text-sm text-artisan-950 mt-2 mb-1">
          {trimmed.slice(4)}
        </h4>
      );
    } else if (trimmed.length === 0) {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={`p-${lineIdx}`} className="my-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    }
  });

  flushList();
  return elements;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOrderCompleted }) => {
  const { businessData } = useBusiness();
  const { botConfig, profile } = businessData;
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4 group animate-slide-up`}>
      
      <div className={`flex items-start gap-2.5 max-w-[90%] sm:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        {!isUser && (
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-terracotta-300 shadow-warm-sm bg-white mt-1">
            <img 
              src={botConfig.avatarUrl || '/assets/mira-avatar.jpg'} 
              alt={botConfig.botName}
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        {/* Message Bubble */}
        <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}>
          {isUser ? (
            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div>
              {renderMarkdown(message.content)}
              {message.isStreaming && (
                <span className="inline-block w-1.5 h-3.5 bg-terracotta-500 ml-1 animate-pulse align-middle"></span>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${isUser ? 'text-white/75' : 'text-artisan-400'}`}>
            <span>{message.timestamp}</span>
            {isUser && <Check className="w-2.5 h-2.5 opacity-75" />}
          </div>
        </div>

      </div>

      {/* Interactive In-Bubble Order & Booking Card (Phase 4) */}
      {!isUser && (message.interactiveAction || message.completedOrder) && (
        <div className="ml-9 w-full max-w-[90%] sm:max-w-[85%]">
          <OrderActionCard
            payload={message.interactiveAction || { type: message.completedOrder?.type || 'order' }}
            completedOrder={message.completedOrder}
            onOrderCompleted={(order) => {
              if (onOrderCompleted) onOrderCompleted(message.id, order);
            }}
          />
        </div>
      )}

      {/* Grounded Reference Preview Cards (if detected by bot) */}
      {!isUser && !message.interactiveAction && !message.completedOrder && message.groundedReferences && message.groundedReferences.length > 0 && (
        <div className="ml-9 mt-2 flex flex-col gap-2 max-w-[85%]">
          {message.groundedReferences.map((ref, idx) => (
            <div
              key={idx}
              className="bg-white/95 border border-terracotta-200/80 rounded-xl p-2.5 shadow-warm-sm flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  {ref.type === 'menu_item' ? (
                    <Utensils className="w-3.5 h-3.5 text-terracotta-500" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-sage-600" />
                  )}
                  <span className="font-serif font-bold text-artisan-950">{ref.title}</span>
                  {ref.subtitle && (
                    <span className="text-[10px] text-artisan-500 font-medium">({ref.subtitle})</span>
                  )}
                </div>
                {ref.details && (
                  <p className="text-[11px] text-artisan-600 line-clamp-1">{ref.details}</p>
                )}
              </div>

              {ref.price !== undefined && (
                <span className="font-serif font-bold text-terracotta-700 shrink-0">
                  {profile.currency}{ref.price.toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error notification banner */}
      {message.error && (
        <div className="ml-9 mt-1.5 flex items-center gap-1.5 text-[11px] text-rose-600">
          <AlertCircle className="w-3 h-3" />
          <span>Network connection hiccup. Fallback grounding is active.</span>
        </div>
      )}

    </div>
  );
};
