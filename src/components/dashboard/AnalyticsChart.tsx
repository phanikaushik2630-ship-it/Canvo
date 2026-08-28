import React, { useState } from 'react';
import { TimelinePoint } from '../../types';

interface AnalyticsChartProps {
  timeline: TimelinePoint[];
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ timeline }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-artisan-400 font-sans">
        No conversation data recorded yet in this time frame.
      </div>
    );
  }

  const maxTotal = Math.max(...timeline.map(t => t.total), 8);
  const chartHeight = 160;
  const barWidth = Math.max(8, Math.min(24, Math.floor(600 / timeline.length) - 4));

  return (
    <div className="space-y-3 font-sans">
      
      {/* Chart Canvas */}
      <div className="relative pt-4 pb-2">
        
        {/* Tooltip Hover Overlay */}
        {hoveredIdx !== null && timeline[hoveredIdx] && (
          <div 
            className="absolute top-0 z-20 -translate-x-1/2 bg-artisan-950 text-white px-3 py-1.5 rounded-xl text-[11px] shadow-warm-lg pointer-events-none transition-all duration-150 border border-artisan-800"
            style={{
              left: `${((hoveredIdx + 0.5) / timeline.length) * 100}%`
            }}
          >
            <div className="font-bold text-terracotta-300">{timeline[hoveredIdx].label}</div>
            <div className="flex items-center gap-2 text-[10px] text-artisan-300 mt-0.5">
              <span>Total: <strong className="text-white">{timeline[hoveredIdx].total}</strong></span>
              <span>•</span>
              <span className="text-emerald-300">Answered: {timeline[hoveredIdx].answered}</span>
              {timeline[hoveredIdx].unanswered > 0 && (
                <>
                  <span>•</span>
                  <span className="text-rose-300">Gaps: {timeline[hoveredIdx].unanswered}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* SVG Bars & Gridlines */}
        <div className="h-44 w-full flex items-end justify-between gap-1 border-b border-artisan-200/80 px-2 relative">
          
          {/* Subtle Background Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-dashed border-artisan-200 w-full"></div>
            <div className="border-b border-dashed border-artisan-200 w-full"></div>
            <div className="border-b border-dashed border-artisan-200 w-full"></div>
          </div>

          {timeline.map((point, idx) => {
            const heightPercent = point.total > 0 ? (point.total / maxTotal) * 100 : 4;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={point.date}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative z-10"
              >
                <div 
                  className={`w-full max-w-[20px] rounded-t-md transition-all duration-200 ${
                    isHovered 
                      ? 'bg-terracotta-600 scale-y-105 shadow-warm-sm' 
                      : point.total > 0 
                        ? 'bg-terracotta-500 hover:bg-terracotta-600' 
                        : 'bg-artisan-200/60'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Unanswered gap red top cap */}
                  {point.unanswered > 0 && (
                    <div 
                      className="w-full bg-rose-500 rounded-t-md"
                      style={{ height: `${Math.min(100, (point.unanswered / point.total) * 100)}%` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* X-Axis Date Labels */}
        <div className="flex justify-between text-[10px] text-artisan-500 pt-2 px-1 font-mono">
          <span>{timeline[0]?.label}</span>
          {timeline.length > 10 && <span>{timeline[Math.floor(timeline.length / 2)]?.label}</span>}
          <span>{timeline[timeline.length - 1]?.label}</span>
        </div>

      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-[11px] text-artisan-600 pt-1 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-terracotta-500"></span>
          <span>Grounded Answer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
          <span>Unanswered Gap</span>
        </div>
      </div>

    </div>
  );
};
