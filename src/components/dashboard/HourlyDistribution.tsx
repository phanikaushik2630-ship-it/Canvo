import React from 'react';
import { Clock, Calendar } from 'lucide-react';

interface HourlyDistributionProps {
  hourCounts: number[];
  peakHour: string;
  peakDay: string;
  dayOfWeekCounts: Record<string, number>;
}

export const HourlyDistribution: React.FC<HourlyDistributionProps> = ({
  hourCounts,
  peakHour,
  peakDay,
  dayOfWeekCounts
}) => {
  const maxHour = Math.max(...(hourCounts || []), 1);
  const maxDay = Math.max(...Object.values(dayOfWeekCounts || {}), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
      
      {/* 24-Hour Distribution Card */}
      <div className="bg-white/95 rounded-2xl p-5 border border-artisan-200 shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-artisan-950 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-terracotta-500" />
            <span>Time of Day Peak</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-honey-100 text-honey-900 border border-honey-200">
            Peak: {peakHour}
          </span>
        </div>

        {/* 24 Bar Columns */}
        <div className="space-y-1">
          <div className="h-24 flex items-end justify-between gap-0.5 border-b border-artisan-200 pb-1">
            {hourCounts?.map((count, h) => {
              const heightPct = count > 0 ? (count / maxHour) * 100 : 4;
              const isPeak = count === maxHour && count > 0;

              return (
                <div
                  key={h}
                  title={`${h}:00 - ${count} chats`}
                  className="flex-1 flex flex-col justify-end items-center group cursor-pointer"
                >
                  <div
                    className={`w-full rounded-t-sm transition-all ${
                      isPeak 
                        ? 'bg-honey-500' 
                        : count > 0 
                          ? 'bg-terracotta-400/80 group-hover:bg-terracotta-600' 
                          : 'bg-artisan-200/50'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[9px] text-artisan-400 font-mono pt-1">
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>11 PM</span>
          </div>
        </div>
      </div>

      {/* Day of Week Distribution Card */}
      <div className="bg-white/95 rounded-2xl p-5 border border-artisan-200 shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-artisan-950 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Day of Week Pattern</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
            Peak: {peakDay}
          </span>
        </div>

        {/* Horizontal Bars */}
        <div className="space-y-2">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
            const count = dayOfWeekCounts?.[day] || 0;
            const pct = maxDay > 0 ? (count / maxDay) * 100 : 0;
            const isPeak = day === peakDay;

            return (
              <div key={day} className="flex items-center gap-2 text-xs">
                <span className={`w-18 truncate text-[11px] ${isPeak ? 'font-bold text-artisan-950' : 'text-artisan-500'}`}>
                  {day.slice(0, 3)}
                </span>
                <div className="flex-1 h-3 bg-artisan-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isPeak ? 'bg-emerald-600' : 'bg-artisan-400/70'
                    }`}
                    style={{ width: `${Math.max(4, pct)}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-[10px] text-artisan-600 font-semibold">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
