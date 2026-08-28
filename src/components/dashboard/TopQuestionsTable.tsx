import React from 'react';
import { TopQuestion } from '../../types';
import { HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface TopQuestionsTableProps {
  questions: TopQuestion[];
}

export const TopQuestionsTable: React.FC<TopQuestionsTableProps> = ({ questions }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-artisan-400 font-sans">
        No question trends recorded yet.
      </div>
    );
  }

  const maxCount = Math.max(...questions.map(q => q.count), 1);

  return (
    <div className="bg-white/95 rounded-2xl p-5 border border-artisan-200 shadow-warm-sm space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-artisan-950 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-honey-500" />
          <span>Top Questions Asked</span>
        </div>
        <span className="text-[11px] text-artisan-500 font-medium">
          Frequency Ranked
        </span>
      </div>

      <div className="divide-y divide-artisan-100">
        {questions.map((item, idx) => {
          const pct = (item.count / maxCount) * 100;

          return (
            <div key={idx} className="py-3 flex items-center justify-between gap-4 group">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="font-mono text-xs font-bold text-artisan-400 w-5 pt-0.5">
                  #{idx + 1}
                </span>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="font-serif font-bold text-xs sm:text-sm text-artisan-900 truncate">
                    {item.question}
                  </div>

                  {/* Relative Frequency Bar */}
                  <div className="w-full max-w-xs h-1.5 bg-artisan-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.wasUnanswered ? 'bg-rose-400' : 'bg-terracotta-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono font-bold text-artisan-950 bg-artisan-100 px-2 py-0.5 rounded-md">
                  {item.count} asks
                </span>

                {item.wasUnanswered ? (
                  <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Unanswered</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Grounded</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
