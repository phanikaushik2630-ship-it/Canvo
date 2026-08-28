import React from 'react';
import { UnansweredQuery } from '../../types';
import { AlertCircle, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

interface UnansweredGapsProps {
  unanswered: UnansweredQuery[];
  onAddFaq: (question: string) => void;
}

export const UnansweredGaps: React.FC<UnansweredGapsProps> = ({ unanswered, onAddFaq }) => {
  if (!unanswered || unanswered.length === 0) {
    return (
      <div className="bg-emerald-50/60 rounded-2xl p-6 border border-emerald-200 text-center space-y-2 font-sans">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
        <h4 className="font-serif font-bold text-sm text-emerald-950">
          Zero Knowledge Gaps Detected!
        </h4>
        <p className="text-xs text-emerald-800 max-w-sm mx-auto">
          Your AI bot was able to answer 100% of customer queries using your configured menu, hours, and FAQs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-bold text-artisan-950 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>Unanswered Customer Gaps ({unanswered.length})</span>
          </div>
          <p className="text-xs text-artisan-500">
            Real questions asked by customers that your bot didn't have data for. Add them as FAQs with 1 click.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {unanswered.map((gap, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-warm-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
          >
            <div className="space-y-1 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60 font-mono">
                  {gap.count} {gap.count === 1 ? 'ask' : 'asks'}
                </span>
                <span className="text-[11px] text-artisan-400">
                  Last asked: {new Date(gap.latestTimestamp).toLocaleDateString()}
                </span>
              </div>

              <h4 className="font-serif font-bold text-sm text-artisan-950">
                "{gap.question}"
              </h4>
            </div>

            <button
              type="button"
              onClick={() => onAddFaq(gap.question)}
              className="btn-primary !text-xs !py-2 !px-3.5 whitespace-nowrap bg-rose-700 hover:bg-rose-800 shadow-warm-sm shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-honey-300" />
              <span>Add to FAQ</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
