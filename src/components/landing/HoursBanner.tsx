import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { useChat } from '../../context/ChatContext';
import { Clock, Calendar, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

export const HoursBanner: React.FC = () => {
  const { businessData } = useBusiness();
  const { hours, botConfig, profile } = businessData;
  const { prefillAndOpen } = useChat();

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  const currentDayName = dayNames[todayIndex];

  return (
    <section id="hours" className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-artisan-100/80 backdrop-blur-sm border border-artisan-200 rounded-3xl p-6 sm:p-10 shadow-warm-md">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-artisan-200/80">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-terracotta-600 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Bakery & Oven Drop Schedule</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-artisan-950">
                Weekly Operating Hours
              </h2>
            </div>

            <button
              onClick={() => prefillAndOpen(`Are you open on ${currentDayName} and what are the freshest drop times?`, true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-terracotta-700 hover:text-terracotta-800 bg-white/80 border border-terracotta-200/70 rounded-full px-4 py-2 hover:bg-white transition-all shadow-warm-sm self-start md:self-auto"
            >
              <MessageSquare className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Ask {botConfig.botName} about holiday or pickup times</span>
            </button>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 pt-8">
            {hours.map((schedule) => {
              const isToday = schedule.day === currentDayName;

              return (
                <div
                  key={schedule.day}
                  className={`rounded-2xl p-4 transition-all ${
                    isToday
                      ? 'bg-white border-2 border-terracotta-500 shadow-warm-md -translate-y-1 relative'
                      : 'bg-white/60 border border-artisan-200/80 hover:bg-white'
                  }`}
                >
                  {isToday && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terracotta-500 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full shadow-warm-sm">
                      Today
                    </span>
                  )}

                  <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
                    <span className={`font-serif font-bold text-sm ${isToday ? 'text-terracotta-800' : 'text-artisan-900'}`}>
                      {schedule.day}
                    </span>

                    <div className="flex items-center gap-1.5 mt-1">
                      {schedule.isOpen ? (
                        <>
                          <CheckCircle className={`w-3.5 h-3.5 ${isToday ? 'text-emerald-600' : 'text-emerald-500'}`} />
                          <span className={`text-xs font-semibold ${isToday ? 'text-artisan-950 font-bold' : 'text-artisan-800'}`}>
                            {schedule.openTime} – {schedule.closeTime}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-artisan-400" />
                          <span className="text-xs font-medium text-artisan-500 italic">
                            Closed
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {schedule.note && (
                    <p className="text-[11px] text-artisan-600 mt-2.5 pt-2 border-t border-artisan-100 line-clamp-2">
                      {schedule.note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Notice */}
          <div className="mt-8 pt-6 border-t border-artisan-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-artisan-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-terracotta-500" />
              <span>Catering & large loaf pre-orders require 24 hours advance notice.</span>
            </div>
            <div className="text-artisan-500 font-medium">
              Counter Phone: <a href={`tel:${profile.phone}`} className="text-terracotta-700 underline">{profile.phone}</a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
