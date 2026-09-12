import React, { useState } from 'react';
import { SlotItem, DayOfWeek, FilterCategory } from '../types/calendar';
import { DAYS_CONFIG } from '../data/initialSchedule';
import { WeekDayInfo } from '../utils/dateUtils';
import { Plus, Clock, MapPin, CheckCircle2, Star, CheckSquare } from 'lucide-react';

interface MatrixGridProps {
  slots: SlotItem[];
  weekDays?: WeekDayInfo[];
  getSlotsForDay?: (dateIso: string, dayKey: DayOfWeek) => SlotItem[];
  activeFilter: FilterCategory;
  searchQuery: string;
  onSlotClick: (slot: SlotItem) => void;
  onCellAdd: (day: DayOfWeek, startTime: string, endTime: string, dateIso?: string) => void;
  onMoveSlot: (slotId: string, targetDay: DayOfWeek, targetStartTime?: string, targetEndTime?: string, targetDateIso?: string) => void;
}

export const MatrixGrid: React.FC<MatrixGridProps> = ({
  slots,
  weekDays,
  getSlotsForDay,
  activeFilter,
  searchQuery,
  onSlotClick,
  onCellAdd,
  onMoveSlot,
}) => {
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

  // Extended time slots covering morning to evening
  const extendedTimeSlots = [
    { start: '09:00', end: '09:40', label: '09:00 – 09:40' },
    { start: '09:50', end: '10:30', label: '09:50 – 10:30' },
    { start: '10:40', end: '12:10', label: '10:40 – 12:10' },
    { start: '12:10', end: '12:50', label: '12:10 – 12:50' },
    { start: '13:00', end: '13:40', label: '13:00 – 13:40' },
    { start: '13:50', end: '14:30', label: '13:50 – 14:30' },
    { start: '14:40', end: '15:20', label: '14:40 – 15:20' },
    { start: '15:30', end: '16:10', label: '15:30 – 16:10' },
    { start: '16:20', end: '18:00', label: '16:20 – 18:00' },
  ];

  // Helper to find slot in specific cell
  const findSlotsForCell = (daySlots: SlotItem[], timeStart: string) => {
    return daySlots.filter(s => {
      // Exact match or slot spans across this time
      if (s.startTime === timeStart) return true;
      // If slot covers multi-hours (e.g. Thu 09:50 - 13:40 or Fri 09:00 - 12:50)
      const slotStart = s.startTime;
      const slotEnd = s.endTime;
      return slotStart <= timeStart && slotEnd > timeStart;
    });
  };

  const isSlotVisible = (slot: SlotItem): boolean => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = slot.title.toLowerCase().includes(q) ||
                    slot.subtitle?.toLowerCase().includes(q) ||
                    slot.notes.toLowerCase().includes(q) ||
                    slot.room?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (activeFilter === 'all') return true;
    if (activeFilter === 'snf1') return slot.category === 'snf1';
    if (activeFilter === 'snf2') return slot.category === 'snf2';
    if (activeFilter === 'lib') return slot.category === 'lib';
    if (activeFilter === 'deepwork') return slot.category === 'deepwork';
    return true;
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'snf1': return 'border-l-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
      case 'snf2': return 'border-l-slate-400 dark:border-l-slate-300 bg-slate-500/10 text-slate-800 dark:text-slate-200';
      case 'lib': return 'border-l-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-300';
      case 'deepwork': return 'border-l-purple-500 bg-purple-500/10 text-purple-800 dark:text-purple-300';
      case 'lunch': return 'border-l-slate-300 bg-slate-100 dark:bg-slate-800 text-slate-500';
      default: return 'border-l-slate-400 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300';
    }
  };

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

  return (
    <div className="no-print max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="bg-white dark:bg-gt3-cardDark rounded-2xl border border-slate-200 dark:border-gt3-borderDark shadow-sm overflow-hidden">
        
        {/* Table Matrix Header Info */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-gt3-borderDark flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gt3-yellow animate-pulse" />
            <span className="font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              40 Dakikalık İÜHF Zaman Matrisi (Drag & Drop Destekli)
            </span>
          </div>
          <p className="text-slate-500 text-[11px]">
            💡 <i>Kartları sürükleyip başka güne veya saate bırakabilir, boş hücrelere tıklayarak doğrudan slot ekleyebilirsiniz.</i>
          </p>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[1100px]">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-900 border-b border-slate-200 dark:border-gt3-borderDark text-xs">
                <th className="w-[110px] p-3 text-center font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-r border-slate-200 dark:border-gt3-borderDark">
                  Saat
                </th>
                {columns.map(col => (
                  <th 
                    key={col.key}
                    className={`p-3 text-center uppercase tracking-tight border-r border-slate-200 dark:border-gt3-borderDark last:border-r-0 transition-colors ${
                      col.isToday ? 'bg-gt3-yellow/10 dark:bg-gt3-yellow/5' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex items-center justify-center gap-1.5 font-extrabold text-slate-800 dark:text-white">
                        <span>{col.label}</span>
                        {col.isToday && (
                          <span className="px-1.5 py-0.2 rounded bg-gt3-yellow text-black text-[9px] font-black tracking-tighter">
                            BUGÜN
                          </span>
                        )}
                      </div>
                      
                      {col.dayNumber !== undefined && (
                        <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 lowercase">
                          {col.dayNumber} {col.monthName}
                        </span>
                      )}

                      {col.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold lowercase">
                          {col.badge}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {extendedTimeSlots.map((time) => (
                <tr 
                  key={time.start} 
                  className="border-b border-slate-200/80 dark:border-gt3-borderDark/80 hover:bg-slate-50/30 dark:hover:bg-slate-900/20 transition-colors"
                >
                  {/* Time Label */}
                  <td className="p-2 text-center font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30 border-r border-slate-200 dark:border-gt3-borderDark whitespace-nowrap">
                    {time.label}
                  </td>

                  {/* Day Cells */}
                  {columns.map((col) => {
                    const cellKey = `${col.key}-${time.start}`;
                    const isDragOver = dragOverCell === cellKey;
                    
                    // Retrieve slots for this day and cell
                    const daySlots = (getSlotsForDay && col.dateIso) 
                      ? getSlotsForDay(col.dateIso, col.key)
                      : slots.filter(s => s.day === col.key);

                    const cellSlots = findSlotsForCell(daySlots, time.start);

                    return (
                      <td
                        key={col.key}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          setDragOverCell(cellKey);
                        }}
                        onDragLeave={() => setDragOverCell(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOverCell(null);
                          const slotId = e.dataTransfer.getData('text/plain');
                          if (slotId) {
                            onMoveSlot(slotId, col.key, time.start, time.end, col.dateIso);
                          }
                        }}
                        className={`p-1.5 align-top border-r border-slate-200/80 dark:border-gt3-borderDark/80 last:border-r-0 relative transition-all min-h-[58px] ${
                          isDragOver 
                            ? 'bg-gt3-yellow/20 ring-2 ring-gt3-yellow ring-inset' 
                            : col.isToday
                            ? 'bg-gt3-yellow/[0.02] dark:bg-gt3-yellow/[0.01]'
                            : ''
                        }`}
                      >
                        {cellSlots.length > 0 ? (
                          <div className="space-y-1">
                            {cellSlots.map((slot) => {
                              const visible = isSlotVisible(slot);
                              const colorClass = getCategoryColor(slot.category);

                              return (
                                <div
                                  key={slot.id}
                                  draggable={true}
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', slot.id);
                                    e.dataTransfer.effectAllowed = 'move';
                                  }}
                                  onClick={() => onSlotClick(slot)}
                                  className={`p-2 rounded-lg border-l-4 border shadow-xs cursor-grab active:cursor-grabbing hover:shadow transition-all group ${colorClass} ${
                                    visible ? 'opacity-100' : 'opacity-25 grayscale'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <span className="font-bold text-xs tracking-tight line-clamp-1">
                                      {slot.title}
                                    </span>
                                    {slot.status === 'attended' && (
                                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                    )}
                                    {slot.status === 'critical' && (
                                      <Star className="w-3 h-3 text-gt3-yellow fill-current shrink-0" />
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between text-[9.5px] opacity-85 mt-1">
                                    {slot.room ? (
                                      <span className="font-semibold flex items-center gap-0.5">
                                        <MapPin className="w-2.5 h-2.5" />
                                        <span>{slot.room}</span>
                                      </span>
                                    ) : <span />}

                                    {slot.checklist.length > 0 && (
                                      <span className="flex items-center gap-0.5 font-mono text-[9px] font-bold">
                                        <CheckSquare className="w-2.5 h-2.5" />
                                        <span>
                                          {slot.checklist.filter(c => c.done).length}/{slot.checklist.length}
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* Empty cell with click-to-add trigger */
                          <div 
                            onClick={() => onCellAdd(col.key, time.start, time.end, col.dateIso)}
                            className="w-full h-full min-h-[46px] rounded-lg border border-transparent hover:border-dashed hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-gt3-yellow cursor-pointer transition-all group"
                            title={`${col.label} ${time.label} saatine slot ekle`}
                          >
                            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
