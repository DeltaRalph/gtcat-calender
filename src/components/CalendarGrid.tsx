import React from 'react';
import { SlotItem, DayOfWeek, FilterCategory } from '../types/calendar';
import { DAYS_CONFIG } from '../data/initialSchedule';
import { SlotCard } from './SlotCard';
import { Plus } from 'lucide-react';

interface CalendarGridProps {
  slots: SlotItem[];
  activeFilter: FilterCategory;
  searchQuery: string;
  onSlotClick: (slot: SlotItem) => void;
  onQuickAdd: (day: DayOfWeek) => void;
  onMoveSlot?: (slotId: string, targetDay: DayOfWeek) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  slots,
  activeFilter,
  searchQuery,
  onSlotClick,
  onQuickAdd,
  onMoveSlot,
}) => {
  const [dragOverDay, setDragOverDay] = React.useState<DayOfWeek | null>(null);

  // Determine current day of week (0 is Sunday, 1 is Monday...)
  const dayIndex = new Date().getDay();
  const currentDayKey: DayOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ][dayIndex] as DayOfWeek;

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
        {DAYS_CONFIG.map((day) => {
          const isToday = day.key === currentDayKey;
          const isDragOver = dragOverDay === day.key;
          const daySlots = slots
            .filter((s) => s.day === day.key)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={day.key}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                setDragOverDay(day.key);
              }}
              onDragLeave={() => setDragOverDay(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverDay(null);
                const slotId = e.dataTransfer.getData('text/plain');
                if (slotId && onMoveSlot) {
                  onMoveSlot(slotId, day.key);
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
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {day.label}
                  </h2>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gt3-yellow animate-pulse" title="Bugün" />
                  )}
                </div>

                {day.badge ? (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    day.key === 'friday'
                      ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                      : day.key === 'thursday'
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                      : day.badge.includes('14.30')
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}>
                    {day.badge}
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
                  onClick={() => onQuickAdd(day.key)}
                  className="mt-auto py-2 px-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-gt3-yellow text-slate-400 hover:text-slate-700 dark:hover:text-gt3-yellow text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all group"
                >
                  <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>{day.short}'ye Ekle</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
