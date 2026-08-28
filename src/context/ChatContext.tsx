import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ChatMessage, GroundedReference, DaySchedule, InteractiveOrderPayload, Order } from '../types';
import { useBusiness } from './BusinessContext';
import { sendChatMessageStream } from '../services/api';

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  messages: ChatMessage[];
  isStreaming: boolean;
  isListening: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  prefillAndOpen: (question: string, autoSend?: boolean) => void;
  toggleListening: () => void;
  inputDraft: string;
  setInputDraft: (draft: string) => void;
  completeOrderInMessage: (messageId: string, order: Order) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { businessData } = useBusiness();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputDraft, setInputDraft] = useState('');
  
  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  // Initialize greeting message on first load or when botConfig changes
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: businessData.botConfig.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, [businessData.botConfig.welcomeMessage]);

  // Setup Web Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputDraft(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  // Helper to find grounded references from text
  const detectGroundedReferences = (text: string): GroundedReference[] => {
    const refs: GroundedReference[] = [];
    const textLower = text.toLowerCase();

    // Check menu items
    businessData.menu.forEach(item => {
      if (textLower.includes(item.name.toLowerCase()) && !refs.some(r => r.title === item.name)) {
        refs.push({
          type: 'menu_item',
          id: item.id,
          title: item.name,
          subtitle: item.category,
          price: item.price,
          details: item.description,
          tags: item.dietaryTags,
        });
      }
    });

    // Check hours query
    if (textLower.includes('operating hours') || textLower.includes('opening hours') || textLower.includes('we are open from')) {
      const todayIndex = new Date().getDay(); // 0 is Sunday
      const dayNames: DaySchedule['day'][] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todaySchedule = businessData.hours.find(h => h.day === dayNames[todayIndex]);
      if (todaySchedule) {
        refs.push({
          type: 'hours',
          title: `Today (${todaySchedule.day})`,
          subtitle: todaySchedule.isOpen ? `${todaySchedule.openTime} – ${todaySchedule.closeTime}` : 'Closed Today',
          details: todaySchedule.note,
        });
      }
    }

    return refs.slice(0, 2);
  };

  const completeOrderInMessage = (messageId: string, order: Order) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, completedOrder: order, interactiveAction: undefined }
          : msg
      )
    );
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const botMessageId = `bot-${Date.now()}`;
    const initialBotMessage: ChatMessage = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    const newMessages = [...messages, userMessage, initialBotMessage];
    setMessages(newMessages);
    setIsStreaming(true);
    setInputDraft('');

    let accumulatedContent = '';
    let pendingAction: InteractiveOrderPayload | undefined = undefined;

    await sendChatMessageStream({
      messages: [...messages, userMessage],
      businessData,
      onChunk: (chunk: string) => {
        accumulatedContent += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      },
      onInteractiveAction: (action: InteractiveOrderPayload) => {
        pendingAction = action;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId
              ? { ...msg, interactiveAction: action }
              : msg
          )
        );
      },
      onDone: () => {
        setIsStreaming(false);
        const groundedRefs = detectGroundedReferences(accumulatedContent);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId
              ? { 
                  ...msg, 
                  isStreaming: false, 
                  groundedReferences: groundedRefs,
                  interactiveAction: pendingAction || msg.interactiveAction 
                }
              : msg
          )
        );
      },
      onError: (err: Error) => {
        setIsStreaming(false);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId
              ? { 
                  ...msg, 
                  content: accumulatedContent || `I apologize, but I encountered a momentary connection issue. Please feel free to call our counter at ${businessData.profile.phone}.`,
                  isStreaming: false,
                  error: true
                }
              : msg
          )
        );
      }
    });
  };

  const clearMessages = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: businessData.botConfig.welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const prefillAndOpen = (question: string, autoSend: boolean = false) => {
    setIsOpen(true);
    if (autoSend) {
      sendMessage(question);
    } else {
      setInputDraft(question);
    }
  };

  return (
    <ChatContext.Provider value={{
      isOpen,
      setIsOpen,
      isExpanded,
      setIsExpanded,
      messages,
      isStreaming,
      isListening,
      sendMessage,
      clearMessages,
      prefillAndOpen,
      toggleListening,
      inputDraft,
      setInputDraft,
      completeOrderInMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
