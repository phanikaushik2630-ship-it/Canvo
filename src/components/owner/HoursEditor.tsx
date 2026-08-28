import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { DaySchedule } from '../../types';
import { 
  Clock, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Sparkles, 
  Coffee, 
  ShoppingBag, 
  Utensils, 
  RotateCcw,
  Zap,
  Calendar
} from 'lucide-react';

interface HoursEditorProps {
  onNotify: (text: string) => void;
}

// Quick schedule preset templates
const PRESETS = [
  {
    name: 'Bakery & Café (Early Morning)',
    icon: Coffee,
    description: 'Mon-Fri: 7:00 AM – 4:00 PM | Sat-Sun: 7:30 AM – 5:00 PM',
    getSchedule: (): DaySchedule[] => [
      { day: 'Monday', isOpen: true, openTime: '07:00', closeTime: '16:00', note: 'Fresh sourdough drop at 7:30 AM' },
      { day: 'Tuesday', isOpen: true, openTime: '07:00', closeTime: '16:00', note: 'Fresh sourdough drop at 7:30 AM' },
      { day: 'Wednesday', isOpen: true, openTime: '07:00', closeTime: '16:00', note: 'Fresh sourdough drop at 7:30 AM' },
      { day: 'Thursday', isOpen: true, openTime: '07:00', closeTime: '16:00', note: 'Fresh sourdough drop at 7:30 AM' },
      { day: 'Friday', isOpen: true, openTime: '07:00', closeTime: '17:00', note: 'Afternoon brioche & fusion drop at 2:00 PM' },
      { day: 'Saturday', isOpen: true, openTime: '07:30', closeTime: '17:00', note: 'Weekend signature pastries sell out early' },
      { day: 'Sunday', isOpen: true, openTime: '07:30', closeTime: '16:00', note: 'Pastry batch drops at 7:30 AM & 10:30 AM' },
    ]
  },
  {
    name: 'Standard Retail Boutique',
    icon: ShoppingBag,
    description: 'Mon-Sat: 10:00 AM – 7:00 PM | Sun: 11:00 AM – 5:00 PM',
    getSchedule: (): DaySchedule[] => [
      { day: 'Monday', isOpen: true, openTime: '10:00', closeTime: '19:00', note: 'Standard retail hours' },
      { day: 'Tuesday', isOpen: true, openTime: '10:00', closeTime: '19:00', note: 'Standard retail hours' },
      { day: 'Wednesday', isOpen: true, openTime: '10:00', closeTime: '19:00', note: 'Standard retail hours' },
      { day: 'Thursday', isOpen: true, openTime: '10:00', closeTime: '19:00', note: 'Standard retail hours' },
      { day: 'Friday', isOpen: true, openTime: '10:00', closeTime: '20:00', note: 'Late night shopping' },
      { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '20:00', note: 'Weekend collection showcase' },
      { day: 'Sunday', isOpen: true, openTime: '11:00', closeTime: '17:00', note: 'Sunday afternoon hours' },
    ]
  },
  {
    name: 'Restaurant & Dining Bar',
    icon: Utensils,
    description: 'Tue-Sun: 11:30 AM – 10:30 PM | Mon: Closed',
    getSchedule: (): DaySchedule[] => [
      { day: 'Monday', isOpen: false, openTime: '11:30', closeTime: '22:30', note: 'Closed for kitchen prep & rest' },
      { day: 'Tuesday', isOpen: true, openTime: '11:30', closeTime: '22:30', note: 'Lunch service 11:30–3:00, Dinner 5:30–10:30' },
      { day: 'Wednesday', isOpen: true, openTime: '11:30', closeTime: '22:30', note: 'Lunch service 11:30–3:00, Dinner 5:30–10:30' },
      { day: 'Thursday', isOpen: true, openTime: '11:30', closeTime: '23:00', note: 'Late night dinner & tasting menu' },
      { day: 'Friday', isOpen: true, openTime: '11:30', closeTime: '23:30', note: 'Weekend dinner & cocktail bar' },
      { day: 'Saturday', isOpen: true, openTime: '11:00', closeTime: '23:30', note: 'All-day brunch & dinner' },
      { day: 'Sunday', isOpen: true, openTime: '11:00', closeTime: '21:30', note: 'Sunday family dinner' },
    ]
  }
];

function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  const minStr = String(m || 0).padStart(2, '0');
  return `${hour12}:${minStr} ${ampm}`;
}

export const HoursEditor: React.FC<HoursEditorProps> = ({ onNotify }) => {
  const { businessData, updateHours } = useBusiness();
  const [schedules, setSchedules] = useState<DaySchedule[]>([...businessData.hours]);

  // Bulk Apply state
  const [bulkOpenTime, setBulkOpenTime] = useState('07:00');
  const [bulkCloseTime, setBulkCloseTime] = useState('17:00');

  const handleToggleOpen = (index: number) => {
    setSchedules(prev => prev.map((item, i) => i === index ? { ...item, isOpen: !item.isOpen } : item));
  };

  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime' | 'note', value: string) => {
    setSchedules(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  // Copy Monday times to all open days
  const handleCopyMondayToAll = () => {
    const monday = schedules.find(s => s.day === 'Monday') || schedules[0];
    setSchedules(prev => prev.map(s => ({
      ...s,
      isOpen: monday.isOpen,
      openTime: monday.openTime,
      closeTime: monday.closeTime,
      note: s.note || monday.note
    })));
    onNotify('Copied Monday opening and closing hours to all 7 days!');
  };

  // Bulk apply to weekdays (Mon-Fri)
  const handleApplyToWeekdays = () => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    setSchedules(prev => prev.map(s => {
      if (weekdays.includes(s.day)) {
        return { ...s, isOpen: true, openTime: bulkOpenTime, closeTime: bulkCloseTime };
      }
      return s;
    }));
    onNotify(`Set Weekdays (Mon-Fri) to ${formatTimeDisplay(bulkOpenTime)} – ${formatTimeDisplay(bulkCloseTime)}`);
  };

  // Bulk apply to weekends (Sat-Sun)
  const handleApplyToWeekends = () => {
    const weekends = ['Saturday', 'Sunday'];
    setSchedules(prev => prev.map(s => {
      if (weekends.includes(s.day)) {
        return { ...s, isOpen: true, openTime: bulkOpenTime, closeTime: bulkCloseTime };
      }
      return s;
    }));
    onNotify(`Set Weekends (Sat-Sun) to ${formatTimeDisplay(bulkOpenTime)} – ${formatTimeDisplay(bulkCloseTime)}`);
  };

  // Apply a template preset
  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setSchedules(preset.getSchedule());
    onNotify(`Applied "${preset.name}" schedule preset! Click Save to apply.`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHours(schedules);
    onNotify('Weekly operating hours customized and saved! AI Concierge knowledge synchronized.');
  };

  // Today's live status calculation
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  const currentDayName = dayNames[todayIndex];
  const todaySchedule = schedules.find(s => s.day === currentDayName) || schedules[0];

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-artisan-200">
        <div>
          <h3 className="font-serif font-bold text-xl text-artisan-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-terracotta-500" />
            <span>Customize Opening & Closing Hours</span>
          </h3>
          <p className="text-xs text-artisan-500 mt-0.5">
            Configure exact daily open/close timings, batch drops, and quick presets for your AI concierge.
          </p>
        </div>

        <button type="submit" className="btn-primary">
          <Save className="w-4 h-4" />
          <span>Save Hours Schedule</span>
        </button>
      </div>

      {/* QUICK PRESETS & LIVE PREVIEW BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Presets Card */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-artisan-50/80 border border-artisan-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-terracotta-500" />
              <h4 className="font-semibold text-xs uppercase tracking-wider text-artisan-800">
                Quick Schedule Presets
              </h4>
            </div>
            <span className="text-[11px] text-artisan-500">1-click configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PRESETS.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-3 rounded-xl bg-white border border-artisan-200/80 hover:border-terracotta-400 hover:shadow-warm-sm transition-all text-left group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1.5 rounded-lg bg-terracotta-50 text-terracotta-600 group-hover:bg-terracotta-500 group-hover:text-white transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-serif font-bold text-xs text-artisan-950 group-hover:text-terracotta-600 transition-colors">
                      {preset.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-artisan-500 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Today Status Widget */}
        <div className="p-4 rounded-2xl bg-white border-2 border-terracotta-200 shadow-warm-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Today's Live Status
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              todaySchedule.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {todaySchedule.isOpen ? 'Active Today' : 'Closed'}
            </span>
          </div>

          <div>
            <div className="font-serif text-lg font-bold text-artisan-950">
              {todaySchedule.day}
            </div>
            <div className="text-xs text-artisan-600 mt-0.5">
              {todaySchedule.isOpen ? (
                <span>
                  <strong>{formatTimeDisplay(todaySchedule.openTime)}</strong> to <strong>{formatTimeDisplay(todaySchedule.closeTime)}</strong>
                </span>
              ) : (
                <span className="text-rose-600 font-semibold">Closed all day</span>
              )}
            </div>
            {todaySchedule.note && (
              <p className="text-[11px] text-artisan-500 mt-1 italic line-clamp-1">
                "{todaySchedule.note}"
              </p>
            )}
          </div>

          <div className="text-[10px] text-artisan-400 border-t border-artisan-100 pt-1.5">
            Storefront header updates dynamically from this schedule.
          </div>
        </div>

      </div>

      {/* BULK TIME APPLIER TOOLBAR */}
      <div className="p-3.5 rounded-2xl bg-artisan-100/70 border border-artisan-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-artisan-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-terracotta-500" />
            Bulk Timing Adjuster:
          </span>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-artisan-200">
            <span className="text-[11px] text-artisan-500">Opens:</span>
            <input
              type="time"
              value={bulkOpenTime}
              onChange={(e) => setBulkOpenTime(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-artisan-900 focus:outline-none cursor-pointer"
            />
          </div>
          <span className="text-artisan-400 font-bold">—</span>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-artisan-200">
            <span className="text-[11px] text-artisan-500">Closes:</span>
            <input
              type="time"
              value={bulkCloseTime}
              onChange={(e) => setBulkCloseTime(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-artisan-900 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleApplyToWeekdays}
            className="btn-secondary !text-xs !py-1 !px-2.5"
          >
            Apply to Weekdays (Mon-Fri)
          </button>
          <button
            type="button"
            onClick={handleApplyToWeekends}
            className="btn-secondary !text-xs !py-1 !px-2.5"
          >
            Apply to Weekends (Sat-Sun)
          </button>
          <button
            type="button"
            onClick={handleCopyMondayToAll}
            className="inline-flex items-center gap-1 text-xs text-terracotta-700 hover:text-terracotta-800 bg-white border border-terracotta-200 px-2.5 py-1 rounded-xl font-medium shadow-warm-sm"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Mon to All Days</span>
          </button>
        </div>
      </div>

      {/* DAILY SCHEDULES LIST */}
      <div className="space-y-3.5">
        {schedules.map((schedule, idx) => {
          const isToday = schedule.day === currentDayName;

          return (
            <div
              key={schedule.day}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isToday 
                  ? 'border-terracotta-400 bg-white shadow-warm-md ring-1 ring-terracotta-400/20' 
                  : schedule.isOpen
                  ? 'bg-white border-artisan-200 shadow-warm-sm hover:border-artisan-300'
                  : 'bg-artisan-100/60 border-artisan-200/60 opacity-80'
              }`}
            >
              
              {/* Day name & toggle switch */}
              <div className="flex items-center gap-3.5 min-w-[190px]">
                <button
                  type="button"
                  onClick={() => handleToggleOpen(idx)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center shrink-0 ${
                    schedule.isOpen ? 'bg-terracotta-500' : 'bg-artisan-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      schedule.isOpen ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-base text-artisan-950">
                      {schedule.day}
                    </span>
                    {isToday && (
                      <span className="bg-terracotta-100 text-terracotta-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-artisan-500">
                    {schedule.isOpen ? 'Open for service' : 'Closed'}
                  </span>
                </div>
              </div>

              {/* Time Pickers (if open) */}
              {schedule.isOpen ? (
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Opening Time */}
                  <div className="flex items-center gap-1.5 bg-artisan-50 px-2.5 py-1.5 rounded-xl border border-artisan-200">
                    <span className="text-xs text-artisan-600 font-semibold">Opens:</span>
                    <input
                      type="time"
                      value={schedule.openTime}
                      onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                      className="bg-white border border-artisan-200 rounded-lg px-2 py-0.5 text-xs font-mono font-bold text-artisan-900 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                    <span className="text-[11px] font-semibold text-terracotta-700 ml-1">
                      ({formatTimeDisplay(schedule.openTime)})
                    </span>
                  </div>

                  <span className="text-artisan-400 font-bold hidden sm:inline">—</span>

                  {/* Closing Time */}
                  <div className="flex items-center gap-1.5 bg-artisan-50 px-2.5 py-1.5 rounded-xl border border-artisan-200">
                    <span className="text-xs text-artisan-600 font-semibold">Closes:</span>
                    <input
                      type="time"
                      value={schedule.closeTime}
                      onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                      className="bg-white border border-artisan-200 rounded-lg px-2 py-0.5 text-xs font-mono font-bold text-artisan-900 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                    <span className="text-[11px] font-semibold text-terracotta-700 ml-1">
                      ({formatTimeDisplay(schedule.closeTime)})
                    </span>
                  </div>

                </div>
              ) : (
                <div className="text-xs text-artisan-500 italic flex items-center gap-1.5 bg-artisan-50/60 px-3 py-1.5 rounded-xl border border-artisan-200/50">
                  <AlertCircle className="w-3.5 h-3.5 text-artisan-400" />
                  <span>Storefront and counter closed all day</span>
                </div>
              )}

              {/* Daily Note (e.g. Fresh batch drop time) */}
              <div className="flex-1 max-w-xs">
                <input
                  type="text"
                  value={schedule.note || ''}
                  onChange={(e) => handleTimeChange(idx, 'note', e.target.value)}
                  placeholder="Drop notes (e.g. Sourdough drop at 7:30 AM)..."
                  className="input-artisan !py-1.5 !px-3 text-xs w-full"
                />
              </div>

            </div>
          );
        })}
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-artisan-200">
        <p className="text-xs text-artisan-500">
          💡 The AI concierge automatically answers visitor questions about your opening hours, holiday timings, and batch drops using this live schedule.
        </p>
        <button type="submit" className="btn-primary shrink-0">
          <Save className="w-4 h-4" />
          <span>Save Hours Schedule</span>
        </button>
      </div>
    </form>
  );
};
