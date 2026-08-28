import React, { useRef, useEffect, useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { ChatMessage, GroundedReference } from '../../types';
import { sendChatMessageStream } from '../../services/api';
import { Send, Trash2, ShieldCheck, Sparkles, Bot, ArrowRight, CornerDownLeft } from 'lucide-react';

export const SandboxDrawer: React.FC = () => {
  const { businessData } = useBusiness();
  const { botConfig, profile, menu, hours } = businessData;

  const [sandboxMessages, setSandboxMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize sandbox message when botConfig changes
  useEffect(() => {
    setSandboxMessages([
      {
        id: 'sandbox-welcome',
        role: 'assistant',
        content: `*Sandbox Mode Active*\n\n${botConfig.welcomeMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [botConfig.welcomeMessage, profile.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sandboxMessages, isStreaming]);

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

    const updated = [...sandboxMessages, userMsg, botMsg];
    setSandboxMessages(updated);
    setDraft('');
    setIsStreaming(true);

    let streamAccumulator = '';

    await sendChatMessageStream({
      messages: [...sandboxMessages, userMsg],
      businessData,
      onChunk: (chunk: string) => {
        streamAccumulator += chunk;
        setSandboxMessages(prev => 
          prev.map(m => m.id === botMsgId ? { ...m, content: streamAccumulator } : m)
        );
      },
      onDone: () => {
        setIsStreaming(false);
        const refs = detectRefs(streamAccumulator);
        setSandboxMessages(prev => 
          prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false, groundedReferences: refs } : m)
        );
      },
      onError: (err: Error) => {
        setIsStreaming(false);
        setSandboxMessages(prev => 
          prev.map(m => m.id === botMsgId ? { ...m, content: `Error: ${err.message}`, isStreaming: false, error: true } : m)
        );
      }
    });
  };

  const handleClear = () => {
    setSandboxMessages([
      {
        id: `sandbox-${Date.now()}`,
        role: 'assistant',
        content: `*Sandbox Reset*\n\n${botConfig.welcomeMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  return (
    <div className="bg-white border border-artisan-200/90 rounded-3xl shadow-warm-lg overflow-hidden flex flex-col h-[680px]">
      
      {/* Sandbox Header */}
      <div className="bg-artisan-950 text-white p-4 flex items-center justify-between border-b border-artisan-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-terracotta-500/20 border border-terracotta-400 flex items-center justify-center text-terracotta-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-white">
                Live Grounding Sandbox
              </span>
              <span className="text-[10px] bg-terracotta-500/20 text-terracotta-300 px-2 py-0.5 rounded-full font-bold border border-terracotta-500/30">
                LIVE STATE
              </span>
            </div>
            <p className="text-[11px] text-artisan-400">
              Testing {botConfig.botName} against latest configuration
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          title="Clear sandbox"
          className="p-1.5 rounded-lg hover:bg-white/10 text-artisan-400 hover:text-white transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Grounding Info Bar */}
      <div className="bg-artisan-100/90 px-4 py-2 border-b border-artisan-200 flex items-center justify-between text-xs text-artisan-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium">Strict Grounding: {menu.length} items, {hours.length} days, {businessData.faqs.length} FAQs</span>
        </div>
        <span className="text-[10px] text-artisan-500 font-mono">
          Tone: {botConfig.tone}
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto bg-artisan-50/50 space-y-3">
        {sandboxMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-3`}>
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm ${
                isUser ? 'bg-terracotta-500 text-white rounded-tr-sm' : 'bg-white border border-artisan-200 text-artisan-900 rounded-tl-sm shadow-warm-sm'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                {msg.isStreaming && <span className="inline-block w-1.5 h-3 bg-terracotta-500 ml-1 animate-pulse" />}
                <div className={`text-[9px] mt-1 text-right ${isUser ? 'text-white/70' : 'text-artisan-400'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {/* Grounded items preview */}
              {!isUser && msg.groundedReferences && msg.groundedReferences.length > 0 && (
                <div className="mt-1.5 flex flex-col gap-1 max-w-[85%]">
                  {msg.groundedReferences.map((ref, idx) => (
                    <div key={idx} className="bg-white border border-terracotta-200 rounded-lg p-2 text-[11px] flex justify-between shadow-warm-sm">
                      <span className="font-bold text-artisan-950">{ref.title}</span>
                      {ref.price !== undefined && (
                        <span className="font-bold text-terracotta-700">{profile.currency}{ref.price.toFixed(2)}</span>
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

      {/* Suggested Quick Test Prompts */}
      <div className="p-2 border-t border-artisan-100 bg-artisan-50/80 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] font-semibold text-artisan-500 uppercase flex items-center px-1">Test:</span>
        <button
          onClick={() => handleSend('What are your hours today?')}
          className="text-[11px] bg-white hover:bg-terracotta-50 text-artisan-700 border border-artisan-200 rounded-full px-2.5 py-0.5 whitespace-nowrap"
        >
          Hours check
        </button>
        <button
          onClick={() => handleSend('Do you have gluten free items?')}
          className="text-[11px] bg-white hover:bg-terracotta-50 text-artisan-700 border border-artisan-200 rounded-full px-2.5 py-0.5 whitespace-nowrap"
        >
          Gluten-free check
        </button>
        <button
          onClick={() => handleSend('Can I write a python script to bake sourdough?')}
          className="text-[11px] bg-white hover:bg-rose-50 text-artisan-700 border border-artisan-200 rounded-full px-2.5 py-0.5 whitespace-nowrap"
        >
          Out-of-bounds test (Python code)
        </button>
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-artisan-200 shrink-0">
        <div className="flex items-center gap-2 bg-artisan-50 border border-artisan-300/80 rounded-2xl px-3 py-1.5 focus-within:border-terracotta-500 focus-within:ring-2 focus-within:ring-terracotta-500/20">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder={`Test ask ${botConfig.botName}...`}
            className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-artisan-900 placeholder:text-artisan-400 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!draft.trim() || isStreaming}
            className="p-1.5 rounded-xl bg-terracotta-500 text-white disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
