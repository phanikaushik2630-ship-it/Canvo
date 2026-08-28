import React, { useRef, useEffect, useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { useChat } from '../../context/ChatContext';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { QuickPrompts } from './QuickPrompts';
import { submitReviewApi } from '../../services/api';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  Send, 
  Mic, 
  MicOff, 
  ShieldCheck, 
  Sparkles,
  Star,
  Heart,
  CheckCircle2,
  ThumbsUp
} from 'lucide-react';

export const ChatWindow: React.FC = () => {
  const { businessData } = useBusiness();
  const { profile, botConfig, apiSettings } = businessData;
  const { 
    isOpen, 
    setIsOpen, 
    isExpanded, 
    setIsExpanded, 
    messages, 
    isStreaming, 
    sendMessage, 
    clearMessages,
    isListening,
    toggleListening,
    inputDraft,
    setInputDraft,
    completeOrderInMessage
  } = useChat();

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Rating & Review State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Precise container scroll to bottom without page jumping
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, isStreaming]);

  // Focus textarea when opened without jumping
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus({ preventScroll: true });
        scrollToBottom('auto');
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputDraft.trim() && !isStreaming) {
        const text = inputDraft;
        sendMessage(text);
        // Ensure immediate scroll to bottom
        setTimeout(() => scrollToBottom('auto'), 50);
      }
    }
  };

  const handleSend = () => {
    if (inputDraft.trim() && !isStreaming) {
      sendMessage(inputDraft);
      setTimeout(() => scrollToBottom('auto'), 50);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || isSubmittingReview) return;

    try {
      setIsSubmittingReview(true);
      await submitReviewApi(profile.id, {
        customerName: reviewerName.trim() || 'Verified Chat Guest',
        rating: userRating,
        comment: reviewComment.trim(),
        source: 'chat'
      });
      setReviewSubmitted(true);
      setTimeout(() => {
        setShowRatingModal(false);
        setReviewSubmitted(false);
        setReviewComment('');
        setReviewerName('');
        setUserRating(5);
      }, 1800);
    } catch (err: any) {
      alert(err.message || 'Failed to submit rating');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ease-out flex flex-col bg-white shadow-warm-2xl border-0 sm:border border-terracotta-200 overflow-hidden ${
        isExpanded
          ? 'inset-0 sm:inset-4 md:inset-8 rounded-none sm:rounded-3xl'
          : 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-[420px] md:w-[440px] h-full sm:h-[580px] sm:max-h-[calc(100vh-2rem)] rounded-none sm:rounded-3xl'
      }`}
    >
      {/* Header Bar */}
      <div className="bg-artisan-950 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-artisan-800 shadow-sm shrink-0">
        
        {/* Left: Avatar & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={botConfig.avatarUrl || '/assets/mira-avatar.jpg'} 
              alt={botConfig.botName}
              className="w-10 h-10 rounded-full object-cover border-2 border-honey-400/80 bg-artisan-900" 
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-artisan-900"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-sm sm:text-base text-white tracking-tight">
                {botConfig.botName}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Grounded
              </span>
            </div>
            <p className="text-[11px] text-artisan-400 font-medium">
              {botConfig.botRoleTitle || 'AI Concierge'} • {profile.name}
            </p>
          </div>
        </div>

        {/* Right: Actions (Rate Experience, Expand, Clear, Close) */}
        <div className="flex items-center gap-1 text-artisan-400">
          
          <button
            onClick={() => setShowRatingModal(true)}
            title="Rate your chat experience"
            className="p-1.5 px-2 rounded-lg bg-white/10 hover:bg-honey-500 hover:text-artisan-950 text-honey-300 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Star className="w-3.5 h-3.5 fill-honey-400" />
            <span className="hidden sm:inline">Rate</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse view" : "Expand window"}
            className="hidden sm:inline-flex p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={clearMessages}
            title="Clear conversation"
            className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors touch-target flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            title="Close chat"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors ml-1 touch-target flex items-center justify-center"
            aria-label="Close chat window"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

      </div>

      {/* Grounding Knowledge Context Bar */}
      <div className="bg-artisan-100/70 border-b border-artisan-200/80 px-3 py-1.5 flex items-center justify-between text-xs text-artisan-600 shrink-0">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
          <span className="text-[11px] font-medium">Strict Negative Grounding Active</span>
        </div>
        <button
          onClick={() => setShowRatingModal(true)}
          className="text-[10px] text-terracotta-600 hover:text-terracotta-700 font-semibold underline"
        >
          Leave Feedback / Review
        </button>
      </div>

      {/* Message History Body (Directly Scrolled) */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-artisan-50/50 space-y-3"
      >
        {messages.map((msg) => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            onOrderCompleted={(messageId, order) => completeOrderInMessage(messageId, order)}
          />
        ))}
        {isStreaming && messages[messages.length - 1]?.role === 'user' && (
          <TypingIndicator />
        )}
      </div>

      {/* Quick Prompts Carousel */}
      <QuickPrompts />

      {/* Input Area with iOS/Android safe area padding */}
      <div className="p-3 sm:p-3.5 bg-white border-t border-artisan-200 shrink-0 pb-safe">
        <div className="relative flex items-end gap-2 bg-artisan-50 border border-artisan-300/80 rounded-2xl p-1.5 focus-within:border-terracotta-500 focus-within:ring-2 focus-within:ring-terracotta-500/20 transition-all">
          
          {/* Voice Input Microphone Button */}
          <button
            onClick={toggleListening}
            title={isListening ? "Listening... click to stop" : "Speak your question or order"}
            className={`p-2.5 rounded-xl transition-colors shrink-0 touch-target flex items-center justify-center ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-artisan-500 hover:text-terracotta-600 hover:bg-artisan-200/60'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Textarea Input */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputDraft}
            onChange={(e) => setInputDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening to your voice..." : `Ask ${botConfig.botName} or type "Order 2 cruffins"...`}
            className="flex-1 bg-transparent border-0 resize-none max-h-28 py-2 px-1 text-xs sm:text-sm text-artisan-900 placeholder:text-artisan-400 focus:outline-none scrollbar-none font-sans"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputDraft.trim() || isStreaming}
            title="Send message"
            className="p-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-40 disabled:hover:bg-terracotta-500 text-white transition-all shrink-0 shadow-warm-sm touch-target flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>

        </div>

        <div className="flex items-center justify-between text-[10px] text-artisan-400 px-1 pt-1.5">
          <span>Grounded only in verified business facts</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-honey-500" />
            <span>AI Concierge v2.0</span>
          </span>
        </div>
      </div>

      {/* Customer Rating & Review Modal inside Chat */}
      {showRatingModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="card-artisan p-5 max-w-sm w-full shadow-warm-2xl space-y-3.5 bg-white border border-artisan-300">
            
            <div className="flex items-center justify-between pb-2 border-b border-artisan-200">
              <h4 className="font-serif font-bold text-sm text-artisan-950 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-honey-400 text-honey-500" />
                <span>Rate Your Concierge Experience</span>
              </h4>
              <button 
                onClick={() => setShowRatingModal(false)}
                className="text-artisan-400 hover:text-artisan-700 text-xs p-1"
              >
                ✕
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-6 space-y-2 animate-scale-up">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h5 className="font-serif font-bold text-sm text-emerald-950">Thank you for rating!</h5>
                <p className="text-[11px] text-artisan-600">Your feedback helps {botConfig.botName} serve you better.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                
                {/* 5 Stars Selector */}
                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setUserRating(s)}
                        className="p-1 hover:scale-115 transition-transform"
                      >
                        <Star 
                          className={`w-6 h-6 ${s <= userRating ? 'fill-honey-400 text-honey-500' : 'text-artisan-200 hover:text-honey-300'}`} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-honey-700 block">
                    {userRating === 5 ? '⭐⭐⭐⭐⭐ Exceptional (5/5)' : userRating === 4 ? '⭐⭐⭐⭐ Great (4/5)' : '⭐⭐⭐ Good Experience'}
                  </span>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-artisan-600">Your Name</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="input-artisan !py-1 !text-xs"
                  />
                </div>

                {/* Comment */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-artisan-600">Quick Review / Feedback *</label>
                  <textarea
                    required
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="How was your interaction with our AI concierge?..."
                    className="input-artisan !py-1 !text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowRatingModal(false)}
                    className="btn-secondary !text-xs !py-1.5 flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview || !reviewComment.trim()}
                    className="btn-primary !text-xs !py-1.5 flex-1"
                  >
                    <span>{isSubmittingReview ? 'Sending...' : 'Submit Rating'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
