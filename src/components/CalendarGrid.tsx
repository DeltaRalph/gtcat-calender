import React from 'react';
import { SlotItem, DayOfWeek, FilterCategory } from '../types/calendar';
import { DAYS_CONFIG } from '../data/initialSchedule';
import { WeekDayInfo } from '../utils/dateUtils';
import { SlotCard } from './SlotCard';
import { Plus } from 'lucide-react';

interface CalendarGridProps {
  slots: SlotItem[];
  weekDays?: WeekDayInfo[];
  getSlotsForDay?: (dateIso: string, dayKey: DayOfWeek) => SlotItem[];
  activeFilter: FilterCategory;
  searchQuery: string;
  onSlotClick: (slot: SlotItem) => void;
  onQuickAdd: (day: DayOfWeek, dateIso?: string) => void;
  onMoveSlot?: (slotId: string, targetDay: DayOfWeek, targetDateIso?: string) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  slots,
  weekDays,
  getSlotsForDay,
  activeFilter,
  searchQuery,
  onSlotClick,
  onQuickAdd,
  onMoveSlot,
}) => {
  const [dragOverDay, setDragOverDay] = React.useState<DayOfWeek | null>(null);

  // Build column metadata from weekDays or fallback to DAYS_CONFIG
  const columns = weekDays ? weekDays.map(w => {
    const config = DAYS_CONFIG.find(d => d.key === w.dayKey);
    return {
      key: w.dayKey,
      label: w.dayName,
      short: w.dayShort,
      dateIso: w.dateIso,
      dayNumber: w.dayNumber,
      monthName: w.monthName,
      isToday: w.isToday,
      badge: config?.badge,
    };
  }) : DAYS_CONFIG.map(d => ({
    key: d.key,
    label: d.label,
    short: d.short,
    dateIso: undefined,
    dayNumber: undefined,
    monthName: undefined,
    isToday: false,
    badge: d.badge,
  }));

  // Check if slot matches current filter & search
  const isSlotVisible = (slot: SlotItem): boolean => {
    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = slot.title.toLowerCase().includes(q);
      const matchSubtitle = slot.subtitle?.toLowerCase().includes(q);
      const matchNotes = slot.notes.toLowerCase().includes(q);
      const matchRoom = slot.room?.toLowerCase().includes(q);
      if (!matchTitle && !matchSubtitle && !matchNotes && !matchRoom) {
        return false;
      }
    }

    // Category filter matching
    if (activeFilter === 'all') return true;
    if (activeFilter === 'snf1') return slot.category === 'snf1';
    if (activeFilter === 'snf2') return slot.category === 'snf2';
    if (activeFilter === 'lib') return slot.category === 'lib';
    if (activeFilter === 'deepwork') return slot.category === 'deepwork';

    return true;
  };

  return (
    <div className="no-print max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
      {/* 7 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7 gap-3.5">
        {columns.map((col) => {
          const isToday = col.isToday;
          const isDragOver = dragOverDay === col.key;
          const daySlots = ((getSlotsForDay && col.dateIso) 
            ? getSlotsForDay(col.dateIso, col.key)
            : slots.filter((s) => s.day === col.key)
          ).sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={col.key}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                setDragOverDay(col.key);
              }}
              onDragLeave={() => setDragOverDay(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverDay(null);
                const slotId = e.dataTransfer.getData('text/plain');
                if (slotId && onMoveSlot) {
                  onMoveSlot(slotId, col.key, col.dateIso);
                }
              }}
              className={`flex flex-col rounded-2xl bg-slate-50/70 dark:bg-gt3-cardDark/50 border transition-all ${
                isDragOver
                  ? 'border-gt3-yellow shadow-gt3-lg ring-2 ring-gt3-yellow/50 scale-[1.01]'
                  : isToday
                  ? 'border-gt3-yellow/60 shadow-gt3 ring-1 ring-gt3-yellow/30'
                  : 'border-slate-200/80 dark:border-gt3-borderDark'
              }`}
            >
              {/* Day Header */}
              <div className="p-3 border-b border-slate-200/80 dark:border-gt3-borderDark flex items-center justify-between bg-white dark:bg-gt3-cardDark rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {col.label}
                      </h2>
                      {isToday && (
                        <span className="px-1.5 py-0.2 rounded bg-gt3-yellow text-black text-[9px] font-black tracking-tighter">
                          BUGÜN
                        </span>
                      )}
                    </div>
                    {col.dayNumber !== undefined && (
                      <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
                        {col.dayNumber} {col.monthName}
                      </span>
                    )}
                  </div>
                </div>

                {col.badge ? (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    col.key === 'friday'
                      ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                      : col.key === 'thursday'
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                      : col.badge.includes('14.30')
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}>
                    {col.badge}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400">
                    {daySlots.length} slot
                  </span>
                )}
              </div>

              {/* Day Slots List */}
              <div className="p-2.5 flex-1 flex flex-col gap-2.5 min-h-[460px]">
                {daySlots.map((slot) => {
                  const visible = isSlotVisible(slot);
                  return (
                    <SlotCard
                      key={slot.id}
                      slot={slot}
                      onClick={() => onSlotClick(slot)}
                      isMuted={!visible}
                    />
                  );
                })}

                {/* Quick Add Button at bottom of column */}
                <button
                  onClick={() => onQuickAdd(col.key, col.dateIso)}
                  className="mt-auto py-2 px-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-gt3-yellow text-slate-400 hover:text-slate-700 dark:hover:text-gt3-yellow text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all group"
                >
                  <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>{col.short}'ye Ekle</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
