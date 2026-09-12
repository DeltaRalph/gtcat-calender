import { useState, useEffect, useRef, useMemo } from 'react';
import { SlotItem, ChecklistItem, SlotStatus, DayOfWeek } from '../types/calendar';
import { INITIAL_SLOTS } from '../data/initialSchedule';
import { 
  getMonday, 
  addWeeks, 
  getWeekDays, 
  formatWeekTitle, 
  getSemesterWeekLabel,
  formatDateIso,
  isSameDay
} from '../utils/dateUtils';

const STORAGE_KEY = 'gtcat_schedule_slots_v1';
const SNAPSHOTS_KEY = 'gtcat_schedule_snapshots_v1';
const OVERRIDES_KEY = 'gtcat_schedule_overrides_v1';

export interface ScheduleSnapshot {
  id: string;
  timestamp: string;
  label: string;
  slotCount: number;
  slots: SlotItem[];
}

export function useScheduleStorage() {
  // 1. Dynamic Week Date State (defaults to current week's Monday)
  const [currentMonday, setCurrentMonday] = useState<Date>(() => getMonday(new Date()));

  // 2. Base Slots & Date-Specific Custom Slots
  const [slots, setSlots] = useState<SlotItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('LocalStorage parse error:', e);
    }
    return INITIAL_SLOTS;
  });

  // 3. Date-Specific Overrides (e.g. notes taken on 15 September for Borçlar Hukuku)
  const [dateOverrides, setDateOverrides] = useState<Record<string, Partial<SlotItem>>>(() => {
    try {
      const saved = localStorage.getItem(OVERRIDES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [lastSaved, setLastSaved] = useState<string>('Az önce');
  const [snapshots, setSnapshots] = useState<ScheduleSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem(SNAPSHOTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const isInitialMount = useRef(true);

  // Computed Week Info
  const weekDays = useMemo(() => getWeekDays(currentMonday), [currentMonday]);
  const weekTitle = useMemo(() => formatWeekTitle(currentMonday), [currentMonday]);
  const semesterWeekLabel = useMemo(() => getSemesterWeekLabel(currentMonday), [currentMonday]);
  const isCurrentWeek = useMemo(() => isSameDay(currentMonday, getMonday(new Date())), [currentMonday]);

  // Week Navigation
  const goToNextWeek = () => setCurrentMonday(prev => addWeeks(prev, 1));
  const goToPreviousWeek = () => setCurrentMonday(prev => addWeeks(prev, -1));
  const goToToday = () => setCurrentMonday(getMonday(new Date()));
  const goToDate = (date: Date) => setCurrentMonday(getMonday(date));

  // Save to LocalStorage and record auto-snapshots
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(dateOverrides));
      const nowStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSaved(nowStr);

      if (!isInitialMount.current) {
        const newSnapshot: ScheduleSnapshot = {
          id: 'snap-' + Date.now(),
          timestamp: nowStr,
          label: `${slots.length} Slot Kaydedildi`,
          slotCount: slots.length,
          slots: slots,
        };

        setSnapshots(prev => {
          const updated = [newSnapshot, ...prev.slice(0, 11)];
          try {
            localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(updated));
          } catch (e) {
            console.warn('Snapshot storage limit reached:', e);
          }
          return updated;
        });
      } else {
        isInitialMount.current = false;
      }
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  }, [slots, dateOverrides]);

  /**
   * Get active slots for a specific calendar date and day of week
   * Merges recurring weekly templates + date-specific custom slots + date overrides!
   */
  const getSlotsForDay = (dateIso: string, dayKey: DayOfWeek): SlotItem[] => {
    return slots
      .filter(s => {
        // If it's tied to a specific date, it only shows on that date
        if (s.dateIso) {
          return s.dateIso === dateIso;
        }
        // Otherwise, it's a recurring semester template for that day of week (Mon, Tue...)
        return s.day === dayKey;
      })
      .map(s => {
        // Apply date-specific override if any (e.g. status or notes edited on that specific day)
        const overrideKey = `${dateIso}_${s.id}`;
        const override = dateOverrides[overrideKey];
        if (override) {
          return { ...s, ...override };
        }
        return s;
      });
  };

  /**
   * Update a slot. If dateIso is provided, saves as a date-specific override so next week stays clean!
   */
  const updateSlot = (id: string, updates: Partial<SlotItem>, dateIso?: string) => {
    if (dateIso) {
      const overrideKey = `${dateIso}_${id}`;
      setDateOverrides(prev => ({
        ...prev,
        [overrideKey]: { ...prev[overrideKey], ...updates }
      }));
    } else {
      setSlots(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    }
  };

  const addSlot = (newSlot: Omit<SlotItem, 'id'>, dateIso?: string) => {
    const id = 'slot-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const item: SlotItem = { 
      ...newSlot, 
      id, 
      dateIso: dateIso || newSlot.dateIso 
    };
    setSlots(prev => [...prev, item]);
    return item;
  };

  const deleteSlot = (id: string, dateIso?: string) => {
    if (dateIso) {
      // Mark as cancelled for this specific date
      const overrideKey = `${dateIso}_${id}`;
      setDateOverrides(prev => ({
        ...prev,
        [overrideKey]: { ...prev[overrideKey], status: 'cancelled' }
      }));
    } else {
      setSlots(prev => prev.filter(s => s.id !== id));
    }
  };

  const moveSlot = (
    id: string, 
    targetDay: DayOfWeek, 
    targetStartTime?: string, 
    targetEndTime?: string,
    targetDateIso?: string
  ) => {
    setSlots(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        return {
          ...s,
          day: targetDay,
          startTime: targetStartTime || s.startTime,
          endTime: targetEndTime || s.endTime,
          dateIso: targetDateIso || s.dateIso,
        };
      })
    );
  };

  const updateSlotStatus = (id: string, status: SlotStatus, dateIso?: string) => {
    updateSlot(id, { status }, dateIso);
  };

  const toggleChecklistItem = (slotId: string, checklistId: string, dateIso?: string) => {
    // If dateIso is provided, apply to date override
    if (dateIso) {
      const overrideKey = `${dateIso}_${slotId}`;
      const existing = dateOverrides[overrideKey]?.checklist || 
        slots.find(s => s.id === slotId)?.checklist || [];
      
      const updated = existing.map(item =>
        item.id === checklistId ? { ...item, done: !item.done } : item
      );

      setDateOverrides(prev => ({
        ...prev,
        [overrideKey]: { ...prev[overrideKey], checklist: updated }
      }));
    } else {
      setSlots(prev =>
        prev.map(slot => {
          if (slot.id !== slotId) return slot;
          return {
            ...slot,
            checklist: slot.checklist.map(item =>
              item.id === checklistId ? { ...item, done: !item.done } : item
            ),
          };
        })
      );
    }
  };

  const addChecklistItem = (slotId: string, text: string) => {
    if (!text.trim()) return;
    const newItem: ChecklistItem = {
      id: 'check-' + Date.now(),
      text: text.trim(),
      done: false,
    };
    setSlots(prev =>
      prev.map(slot => {
        if (slot.id !== slotId) return slot;
        return {
          ...slot,
          checklist: [...slot.checklist, newItem],
        };
      })
    );
  };

  const deleteChecklistItem = (slotId: string, checklistId: string) => {
    setSlots(prev =>
      prev.map(slot => {
        if (slot.id !== slotId) return slot;
        return {
          ...slot,
          checklist: slot.checklist.filter(item => item.id !== checklistId),
        };
      })
    );
  };

  const restoreSnapshot = (snapshotId: string) => {
    const found = snapshots.find(s => s.id === snapshotId);
    if (found && Array.isArray(found.slots)) {
      if (window.confirm(`${found.timestamp} saatindeki yedeğe geri dönmek istediğine emin misin?`)) {
        setSlots(found.slots);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(found.slots));
      }
    }
  };

  const resetToDefault = () => {
    if (window.confirm('Tüm notlar ve takvim başlangıç ayarlarına sıfırlansın mı?')) {
      setSlots(INITIAL_SLOTS);
      setDateOverrides({});
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SLOTS));
      localStorage.removeItem(OVERRIDES_KEY);
    }
  };

  const importSchedule = (newSlots: SlotItem[]) => {
    setSlots(newSlots);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlots));
  };

  return {
    slots,
    currentMonday,
    weekDays,
    weekTitle,
    semesterWeekLabel,
    isCurrentWeek,
    lastSaved,
    snapshots,
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
    goToDate,
    getSlotsForDay,
    restoreSnapshot,
    updateSlot,
    addSlot,
    deleteSlot,
    moveSlot,
    updateSlotStatus,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
    resetToDefault,
    importSchedule,
  };
}
