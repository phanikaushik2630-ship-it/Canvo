import React, { useState, useRef, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { ChatMessage, GroundedReference } from '../../types';
import { sendChatMessageStream } from '../../services/api';
import { Send, Trash2, ShieldCheck, Sparkles, Bot, CornerDownLeft } from 'lucide-react';

export const LivePreviewCard: React.FC = () => {
  const { businessData } = useBusiness();
  const { botConfig, profile, menu, hours, faqs } = businessData;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const themeColor = botConfig.themeColor || '#C9633A';

  useEffect(() => {
    setMessages([
      {
        id: 'preview-welcome',
        role: 'assistant',
        content: botConfig.welcomeMessage || `Bonjour! I am ${botConfig.botName}, concierge for ${profile.name}. Ask me about our menu, hours, or policies!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [botConfig.welcomeMessage, botConfig.botName, profile.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Helper to detect grounded references
  const detectRefs = (text: string): GroundedReference[] => {
    const refs: GroundedReference[] = [];
    const textLower = text.toLowerCase();
    menu.forEach(item => {
      if (textLower.includes(item.name.toLowerCase()) && !refs.some(r => r.title === item.name)) {
        refs.push({
          type: 'menu_item',
          title: item.name,
          subtitle: item.category,
          price: item.price,
          details: item.description,
        });
      }
    });
    return refs.slice(0, 2);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || draft;
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const botMsgId = `bot-${Date.now()}`;
    const botMsg: ChatMessage = {
      id: botMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    const updated = [...messages, userMsg, botMsg];
    setMessages(updated);
    setDraft('');
    setIsStreaming(true);

    let streamAccumulator = '';

    await sendChatMessageStream({
      messages: [...messages, userMsg],
      businessData,
      businessSlug: profile.slug,
      onChunk: (chunk: string) => {
        streamAccumulator += chunk;
        setMessages(prev => 
          prev.map(m => m.id === botMsgId ? { ...m, content: streamAccumulator } : m)
        );
      },
      onDone: () => {
        setIsStreaming(false);
        const refs = detectRefs(streamAccumulator);
        setMessages(prev => 
          prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false, groundedReferences: refs } : m)
        );
      },
      onError: (err: Error) => {
        setIsStreaming(false);
        setMessages(prev => 
          prev.map(m => m.id === botMsgId ? { ...m, content: `Connection note: ${err.message}`, isStreaming: false, error: true } : m)
        );
      }
    });
  };

  return (
    <div className="bg-white border border-artisan-200/90 rounded-3xl shadow-warm-xl overflow-hidden flex flex-col h-[640px]">
      
      {/* Widget Preview Header styled with custom theme color */}
      <div 
        className="p-4 text-white flex items-center justify-between shrink-0 shadow-md transition-colors"
        style={{ backgroundColor: themeColor }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={botConfig.avatarUrl || '/assets/mira-avatar.jpg'} 
              alt={botConfig.botName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/80 bg-white" 
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-serif font-bold text-sm text-white">{botConfig.botName}</h4>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">Live</span>
            </div>
            <p className="text-[11px] text-white/80 font-medium truncate max-w-[180px]">
              {botConfig.botRoleTitle || 'AI Concierge'} • {profile.name}
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([{
            id: 'preview-reset',
            role: 'assistant',
            content: botConfig.welcomeMessage || `Hello! Ask me anything about ${profile.name}.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }])}
          title="Reset conversation"
          className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Grounding Status Bar */}
      <div className="bg-artisan-100/90 px-3.5 py-1.5 border-b border-artisan-200 flex items-center justify-between text-[11px] text-artisan-700 shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">Grounded in <strong>{profile.name}</strong> database</span>
        </div>
        <span className="text-[10px] font-mono text-artisan-500 uppercase shrink-0">
          {botConfig.tone}
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 p-3.5 overflow-y-auto bg-artisan-50/50 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-2`}>
              <div 
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  isUser 
                    ? 'text-white rounded-tr-sm shadow-warm-sm' 
                    : 'bg-white border border-artisan-200 text-artisan-900 rounded-tl-sm shadow-warm-sm'
                }`}
                style={isUser ? { backgroundColor: themeColor } : {}}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.isStreaming && <span className="inline-block w-1.5 h-3 bg-terracotta-500 ml-1 animate-pulse" />}
                <div className={`text-[9px] mt-1 text-right ${isUser ? 'text-white/70' : 'text-artisan-400'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {/* Grounded Reference Card Snippets */}
              {!isUser && msg.groundedReferences && msg.groundedReferences.length > 0 && (
                <div className="mt-1 flex flex-col gap-1 max-w-[85%]">
                  {msg.groundedReferences.map((ref, idx) => (
                    <div key={idx} className="bg-white border border-artisan-200 rounded-xl p-2 text-[11px] flex justify-between shadow-warm-sm">
                      <span className="font-bold text-artisan-950 truncate">{ref.title}</span>
                      {ref.price !== undefined && (
                        <span className="font-bold text-terracotta-700 ml-2">{profile.currency}{ref.price.toFixed(2)}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2 border-t border-artisan-100 bg-artisan-50/80 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        {(botConfig.suggestedQuestions || ['What are your hours?', 'What is on the menu?']).map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] bg-white hover:bg-artisan-100 text-artisan-700 border border-artisan-200 rounded-full px-2.5 py-1 whitespace-nowrap transition-colors shadow-warm-sm shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-artisan-200 shrink-0">
        <div className="flex items-center gap-2 bg-artisan-50 border border-artisan-300/80 rounded-2xl px-3 py-1.5 focus-within:border-terracotta-500 focus-within:ring-2 focus-within:ring-terracotta-500/20">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder={`Ask ${botConfig.botName}...`}
            className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-artisan-900 placeholder:text-artisan-400 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!draft.trim() || isStreaming}
            className="p-1.5 rounded-xl text-white disabled:opacity-40 transition-transform active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
