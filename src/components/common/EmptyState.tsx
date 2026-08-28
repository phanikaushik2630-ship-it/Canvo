import React from 'react';
import { Sparkles, Plus, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="text-center py-12 px-6 bg-artisan-50/60 rounded-3xl border border-dashed border-artisan-300/80 space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-terracotta-500/10 border border-terracotta-500/20 text-terracotta-600 flex items-center justify-center mx-auto shadow-warm-sm">
        <Icon className="w-6 h-6" />
      </div>
      <div className="max-w-sm mx-auto space-y-1">
        <h4 className="font-serif font-bold text-base text-artisan-950">
          {title}
        </h4>
        <p className="text-xs text-artisan-500 leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary !text-xs !py-2 !px-4 mt-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
