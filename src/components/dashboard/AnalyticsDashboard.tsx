import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { 
  fetchAnalyticsOverview, 
  fetchTopQuestions, 
  fetchUnansweredQuestions, 
  fetchChatLogs,
  fetchReviewsApi
} from '../../services/api';
import { AnalyticsOverview, TopQuestion, UnansweredQuery, ChatLog, CustomerReview, ReviewStats } from '../../types';
import { AnalyticsChart } from './AnalyticsChart';
import { HourlyDistribution } from './HourlyDistribution';
import { UnansweredGaps } from './UnansweredGaps';
import { TopQuestionsTable } from './TopQuestionsTable';
import { ChatLogsTable } from './ChatLogsTable';
import { 
  MessageSquare, 
  Target, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Sparkles, 
  RotateCcw,
  BarChart3,
  Star,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

interface AnalyticsDashboardProps {
  onAddFaq: (question: string) => void;
  onNotify: (text: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onAddFaq, onNotify }) => {
  const { businessData } = useBusiness();
  const { profile } = businessData;

  const [daysRange, setDaysRange] = useState<7 | 30>(30);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [topQuestions, setTopQuestions] = useState<TopQuestion[]>([]);
  const [unanswered, setUnanswered] = useState<UnansweredQuery[]>([]);
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    if (!profile.id) return;
    try {
      setIsLoading(true);
      const [ov, top, unans, lg, rev] = await Promise.all([
        fetchAnalyticsOverview(profile.id, daysRange),
        fetchTopQuestions(profile.id, 8),
        fetchUnansweredQuestions(profile.id),
        fetchChatLogs(profile.id, '', 100),
        fetchReviewsApi(profile.id).catch(() => ({ reviews: [], stats: null }))
      ]);
      setOverview(ov);
      setTopQuestions(top);
      setUnanswered(unans);
      setLogs(lg);
      if (rev) {
        setReviews(rev.reviews || []);
        setReviewStats(rev.stats || null);
      }
    } catch (err: any) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile.id, daysRange]);

  if (isLoading && !overview) {
    return (
      <div className="py-20 text-center space-y-3 font-sans">
        <div className="w-8 h-8 rounded-full border-2 border-terracotta-500 border-t-transparent animate-spin mx-auto"></div>
        <p className="text-xs text-artisan-500">Compiling customer interaction insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Header & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-artisan-200">
        <div>
          <h3 className="font-serif font-bold text-xl text-artisan-950 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-terracotta-500" />
            <span>AI Bot Analytics & Customer Insights</span>
          </h3>
          <p className="text-xs text-artisan-500 mt-0.5">
            Monitor real-world conversations, identify knowledge gaps, and optimize your concierge.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-artisan-100 p-1 rounded-2xl text-xs font-semibold text-artisan-700">
          <button
            type="button"
            onClick={() => setDaysRange(7)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              daysRange === 7 
                ? 'bg-white text-artisan-950 shadow-warm-sm font-bold' 
                : 'hover:text-artisan-950'
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setDaysRange(30)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              daysRange === 30 
                ? 'bg-white text-artisan-950 shadow-warm-sm font-bold' 
                : 'hover:text-artisan-950'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Chats */}
        <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-artisan-200 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-artisan-500">
            <span>Conversations</span>
            <div className="w-7 h-7 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif font-bold text-2xl sm:text-3xl text-artisan-950">
            {overview?.totalChats || 0}
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">
            Active customer interactions
          </div>
        </div>

        {/* Answer Accuracy Rate */}
        <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-artisan-200 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-artisan-500">
            <span>Grounded Rate</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif font-bold text-2xl sm:text-3xl text-emerald-700">
            {overview?.answerRate || 100}%
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">
            Answered from verified data
          </div>
        </div>

        {/* Knowledge Gaps */}
        <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-artisan-200 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-artisan-500">
            <span>Knowledge Gaps</span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif font-bold text-2xl sm:text-3xl text-rose-700">
            {overview?.unansweredCount || 0}
          </div>
          <div className="text-[10px] text-rose-700 font-medium">
            {unanswered.length} unique items to add
          </div>
        </div>

        {/* Peak Hour */}
        <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-artisan-200 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-artisan-500">
            <span>Peak Traffic</span>
            <div className="w-7 h-7 rounded-xl bg-honey-50 text-honey-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif font-bold text-xl sm:text-2xl text-artisan-950 truncate">
            {overview?.peakHour || '9:00 AM'}
          </div>
          <div className="text-[10px] text-honey-800 font-medium">
            Busiest: {overview?.peakDay || 'Saturday'}s
          </div>
        </div>

      </div>

      {/* Main Timeline Activity Chart */}
      <div className="bg-white/95 rounded-3xl p-6 border border-artisan-200 shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif font-bold text-base text-artisan-950">
              Conversation Volume Timeline ({daysRange} Days)
            </h4>
            <p className="text-xs text-artisan-500">
              Daily customer questions and grounded responses.
            </p>
          </div>
        </div>

        <AnalyticsChart timeline={overview?.dailyTimeline || []} />
      </div>

      {/* Actionable Unanswered Knowledge Gaps (High Priority) */}
      <UnansweredGaps unanswered={unanswered} onAddFaq={onAddFaq} />

      {/* Hourly & Day-of-Week Distribution */}
      <HourlyDistribution
        hourCounts={overview?.hourCounts || []}
        peakHour={overview?.peakHour || '9:00 AM'}
        peakDay={overview?.peakDay || 'Saturday'}
        dayOfWeekCounts={overview?.dayOfWeekCounts || {}}
      />

      {/* Top Questions Frequency */}
      <TopQuestionsTable questions={topQuestions} />

      {/* Customer Ratings & Live Reviews Feed */}
      <div className="bg-white/95 rounded-3xl p-6 border border-artisan-200 shadow-warm-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-artisan-200">
          <div>
            <h4 className="font-serif font-bold text-base text-artisan-950 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-terracotta-500" />
              <span>Customer Satisfaction & Live Reviews</span>
            </h4>
            <p className="text-xs text-artisan-500">
              Direct ratings and reviews submitted by customers via Live Chat and Storefront.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-artisan-50 px-4 py-2 rounded-2xl border border-artisan-200 shrink-0">
            <div className="font-serif font-bold text-2xl text-artisan-950">
              {reviewStats?.averageRating?.toFixed(1) || '4.9'}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-honey-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-honey-400 text-honey-500" />
                ))}
              </div>
              <span className="text-[10px] text-artisan-400 font-medium">
                {reviews.length} Verified Reviews
              </span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-xs text-artisan-400 italic py-4 text-center">
            No customer reviews submitted yet. They will appear here when guests rate their experience.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.slice(0, 6).map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-artisan-50/70 border border-artisan-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-honey-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-honey-400 text-honey-500' : 'text-artisan-200'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-artisan-600 border border-artisan-200">
                    {rev.source === 'chat' ? '💬 Chat Rating' : '🏪 Storefront'}
                  </span>
                </div>

                <p className="text-xs text-artisan-800 italic">
                  "{rev.comment}"
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1 text-artisan-500 border-t border-artisan-100">
                  <span className="font-semibold text-artisan-900">{rev.customerName}</span>
                  <span className="text-[10px] text-artisan-400">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Searchable Chat Logs with CSV Export */}
      <ChatLogsTable
        businessId={profile.id}
        businessSlug={profile.slug}
        logs={logs}
        onAddFaq={onAddFaq}
        onNotify={onNotify}
      />

    </div>
  );
};
