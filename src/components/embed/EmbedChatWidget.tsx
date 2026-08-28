import React, { useState, useEffect, useRef } from 'react';
import { BusinessData, ChatMessage, GroundedReference } from '../../types';
import { fetchPublicBusinessBySlug, sendChatMessageStream } from '../../services/api';
import { Send, ShieldCheck, Sparkles, Mic, MicOff, Trash2, Clock, Utensils } from 'lucide-react';

interface EmbedChatWidgetProps {
  slug: string;
}

export const EmbedChatWidget: React.FC<EmbedChatWidgetProps> = ({ slug }) => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load public business data for this tenant
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const data = await fetchPublicBusinessBySlug(slug);
        setBusinessData(data);
        setMessages([
          {
            id: 'embed-welcome',
            role: 'assistant',
            content: data.botConfig.welcomeMessage || `Hello! I am ${data.botConfig.botName}, AI concierge for ${data.profile.name}. How can I help you today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to load chatbot data');
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) load();
  }, [slug]);

  // Web Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) setDraft(prev => (prev ? `${prev} ${text}` : text));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Grounded items detection helper
  const detectRefs = (text: string): GroundedReference[] => {
    if (!businessData) return [];
    const refs: GroundedReference[] = [];
    const textLower = text.toLowerCase();
    businessData.menu.forEach(item => {
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
    if (!text.trim() || isStreaming || !businessData) return;

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
      businessSlug: slug,
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
          prev.map(m => m.id === botMsgId ? { ...m, content: `I apologize for the delay. Please feel free to call our desk directly at ${businessData.profile.phone}.`, isStreaming: false, error: true } : m)
        );
      }
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-artisan-50 font-sans text-xs text-artisan-600">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-terracotta-500 border-t-transparent animate-spin mx-auto"></div>
          <p>Connecting to AI Concierge...</p>
        </div>
      </div>
    );
  }

  if (error || !businessData) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-artisan-50 p-6 font-sans">
        <div className="text-center space-y-2 max-w-xs">
          <p className="font-serif font-bold text-artisan-900">Storefront Not Found</p>
          <p className="text-xs text-artisan-500">{error || 'Unable to locate business slug.'}</p>
        </div>
      </div>
    );
  }

  const { profile, botConfig } = businessData;
  const themeColor = botConfig.themeColor || '#C9633A';

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden font-sans select-none">
      
      {/* Embed Header */}
      <div 
        className="p-3.5 text-white flex items-center justify-between shadow-md shrink-0 transition-colors"
        style={{ backgroundColor: themeColor }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img 
              src={botConfig.avatarUrl || '/assets/mira-avatar.jpg'} 
              alt={botConfig.botName}
              className="w-9 h-9 rounded-full object-cover border-2 border-white/80 bg-white" 
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"></span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm leading-tight text-white">{botConfig.botName}</h3>
            <p className="text-[10px] text-white/80 font-medium truncate max-w-[190px]">
              {profile.name} • {botConfig.botRoleTitle || 'AI Concierge'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([{
            id: 'embed-reset',
            role: 'assistant',
            content: botConfig.welcomeMessage || `Hello! How can I help you with ${profile.name}?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }])}
          title="Reset chat"
          className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Verified Grounding Subhead */}
      <div className="bg-artisan-100/90 px-3 py-1 border-b border-artisan-200 flex items-center justify-between text-[10px] text-artisan-700 shrink-0">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>Grounded strictly in verified business data</span>
        </div>
        <span className="text-artisan-500 font-mono">Canvo</span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto bg-artisan-50/50 space-y-2.5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-1.5`}>
              <div 
                className={`max-w-[86%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  isUser 
                    ? 'text-white rounded-tr-sm shadow-warm-sm' 
                    : 'bg-white border border-artisan-200 text-artisan-900 rounded-tl-sm shadow-warm-sm'
                }`}
                style={isUser ? { backgroundColor: themeColor } : {}}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.isStreaming && <span className="inline-block w-1.5 h-3 bg-terracotta-500 ml-1 animate-pulse" />}
                <div className={`text-[8px] mt-1 text-right ${isUser ? 'text-white/70' : 'text-artisan-400'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {/* Grounded items preview */}
              {!isUser && msg.groundedReferences && msg.groundedReferences.length > 0 && (
                <div className="mt-1 flex flex-col gap-1 max-w-[85%]">
                  {msg.groundedReferences.map((ref, idx) => (
                    <div key={idx} className="bg-white border border-artisan-200 rounded-lg p-1.5 text-[10px] flex justify-between shadow-warm-sm">
                      <span className="font-bold text-artisan-950 truncate">{ref.title}</span>
                      {ref.price !== undefined && (
                        <span className="font-bold text-terracotta-700 ml-1">{profile.currency}{ref.price.toFixed(2)}</span>
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

      {/* Suggested Prompts */}
      <div className="p-1.5 border-t border-artisan-100 bg-artisan-50/80 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        {(botConfig.suggestedQuestions || ['Hours today?', 'What is on the menu?']).map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[10px] bg-white hover:bg-artisan-100 text-artisan-700 border border-artisan-200 rounded-full px-2.5 py-0.5 whitespace-nowrap shadow-warm-sm shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-2.5 bg-white border-t border-artisan-200 shrink-0">
        <div className="flex items-center gap-1.5 bg-artisan-50 border border-artisan-300 rounded-xl px-2.5 py-1 focus-within:border-terracotta-500">
          
          <button
            type="button"
            onClick={toggleListening}
            className={`p-1 rounded-lg text-artisan-500 hover:text-artisan-800 ${isListening ? 'text-rose-600 animate-pulse' : ''}`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>

          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder={`Ask ${botConfig.botName}...`}
            className="flex-1 bg-transparent border-0 text-xs text-artisan-900 placeholder:text-artisan-400 focus:outline-none"
          />

          <button
            onClick={() => handleSend()}
            disabled={!draft.trim() || isStreaming}
            className="p-1 rounded-lg text-white disabled:opacity-40 transition-transform active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
};
