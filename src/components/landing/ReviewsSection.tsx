import React, { useState, useEffect } from 'react';
import { CustomerReview, ReviewStats } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { fetchReviewsApi, submitReviewApi } from '../../services/api';
import { Star, MessageSquarePlus, Sparkles, CheckCircle2, ShieldCheck, Heart, ThumbsUp } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { businessData } = useBusiness();
  const { profile } = businessData;

  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isSubmittingModalOpen, setIsSubmittingModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const loadReviews = () => {
    if (profile.id) {
      fetchReviewsApi(profile.id)
        .then(res => {
          if (res) {
            setReviews(res.reviews || []);
            setStats(res.stats || null);
          }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    loadReviews();
  }, [profile.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await submitReviewApi(profile.id, {
        customerName: reviewerName.trim() || 'Verified Guest',
        rating,
        comment: comment.trim(),
        source: 'storefront'
      });
      setSubmittedSuccess(true);
      setTimeout(() => {
        setIsSubmittingModalOpen(false);
        setSubmittedSuccess(false);
        setComment('');
        setReviewerName('');
        setRating(5);
        loadReviews();
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = stats?.averageRating || 4.9;
  const totalReviews = stats?.totalReviews || reviews.length;

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-artisan-50 relative border-b border-artisan-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-artisan-200">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-honey-100 text-honey-900 text-xs font-semibold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-honey-500 text-honey-500" />
              <span>Customer Love & Guest Reviews</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-artisan-950 tracking-tight">
              Loved by Our Community
            </h2>
            <p className="text-artisan-600 text-sm sm:text-base leading-relaxed">
              Read authentic feedback from guests who visited {profile.name} or ordered directly through our AI Concierge.
            </p>
          </div>

          {/* Rating Summary Card & Write Review CTA */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-artisan-200 shadow-warm-sm shrink-0">
            <div className="text-center pr-4 border-r border-artisan-100">
              <div className="font-serif font-bold text-3xl text-artisan-950 leading-none">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-0.5 mt-1 text-honey-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-honey-400 text-honey-500" />
                ))}
              </div>
              <span className="text-[10px] text-artisan-400 font-medium block mt-0.5">
                {totalReviews} Reviews
              </span>
            </div>

            <button
              onClick={() => setIsSubmittingModalOpen(true)}
              className="btn-primary !text-xs !py-2.5 !px-4 flex items-center gap-2 shadow-warm-sm"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Customer Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="card-artisan p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all duration-300 relative group"
            >
              <div className="space-y-2.5">
                
                {/* Rating Stars & Source Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-honey-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-4 h-4 ${s <= rev.rating ? 'fill-honey-400 text-honey-500' : 'text-artisan-200'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-artisan-100 text-artisan-600">
                    {rev.source === 'chat' ? 'Verified Concierge Order' : 'Storefront Guest'}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-artisan-800 leading-relaxed italic">
                  "{rev.comment}"
                </p>

                {/* Tags */}
                {rev.tags && rev.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rev.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-terracotta-50 text-terracotta-700 px-2 py-0.5 rounded-md font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Author & Date */}
              <div className="pt-3 border-t border-artisan-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-terracotta-100 text-terracotta-700 font-bold text-xs flex items-center justify-center">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-artisan-950 block leading-tight">
                      {rev.customerName}
                    </span>
                    <span className="text-[10px] text-artisan-400 flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                      Verified Experience
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-artisan-400">
                  {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Write a Review Modal */}
      {isSubmittingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="card-artisan p-6 max-w-md w-full shadow-warm-2xl space-y-4 bg-white border border-artisan-300">
            
            <div className="flex items-center justify-between pb-3 border-b border-artisan-200">
              <h3 className="font-serif font-bold text-lg text-artisan-950 flex items-center gap-2">
                <Heart className="w-4 h-4 text-terracotta-500 fill-terracotta-500" />
                <span>Review {profile.name}</span>
              </h3>
              <button 
                onClick={() => setIsSubmittingModalOpen(false)}
                className="text-artisan-400 hover:text-artisan-700 text-sm"
              >
                ✕
              </button>
            </div>

            {submittedSuccess ? (
              <div className="text-center py-8 space-y-2 animate-scale-up">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-emerald-950">Thank you for your review!</h4>
                <p className="text-xs text-artisan-600">Your feedback has been published on {profile.name}'s page.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                
                {/* Star Rating Picker */}
                <div className="space-y-1.5 text-center">
                  <label className="text-xs font-bold text-artisan-700 uppercase tracking-wider block">
                    Your Rating *
                  </label>
                  <div className="flex items-center justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star 
                          className={`w-7 h-7 ${s <= rating ? 'fill-honey-400 text-honey-500' : 'text-artisan-200 hover:text-honey-300'}`} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-honey-700">
                    {rating === 5 ? '⭐ Exceptional (5/5)' : rating === 4 ? '⭐ Great (4/5)' : rating === 3 ? '⭐ Good (3/5)' : '⭐ Needs Improvement'}
                  </span>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-artisan-700">Your Name</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Priya Sharma (or leave blank for Guest)"
                    className="input-artisan text-xs"
                  />
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-artisan-700">Your Feedback / Review *</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you enjoy about our sourdough, cruffins, or AI concierge service?..."
                    className="input-artisan text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-artisan-100">
                  <button
                    type="button"
                    onClick={() => setIsSubmittingModalOpen(false)}
                    className="btn-secondary !text-xs !py-2 flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="btn-primary !text-xs !py-2 flex-1"
                  >
                    <span>{isSubmitting ? 'Posting...' : 'Submit Review'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
