import { useState, useEffect, useRef } from 'react';
import { SlotItem, ChecklistItem, SlotStatus, DayOfWeek } from '../types/calendar';
import { INITIAL_SLOTS } from '../data/initialSchedule';

const STORAGE_KEY = 'gtcat_schedule_slots_v1';
const SNAPSHOTS_KEY = 'gtcat_schedule_snapshots_v1';

export interface ScheduleSnapshot {
  id: string;
  timestamp: string;
  label: string;
  slotCount: number;
  slots: SlotItem[];
}

export function useScheduleStorage() {
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

  // Save to LocalStorage and record auto-snapshots
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
      const nowStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSaved(nowStr);

      // Create snapshot after initial mount to protect user edits
      if (!isInitialMount.current) {
        const newSnapshot: ScheduleSnapshot = {
          id: 'snap-' + Date.now(),
          timestamp: nowStr,
          label: `${slots.length} Slot Kaydedildi`,
          slotCount: slots.length,
          slots: slots,
        };

        setSnapshots(prev => {
          // Keep last 12 snapshots
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
  }, [slots]);

  const updateSlot = (id: string, updates: Partial<SlotItem>) => {
    setSlots(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const addSlot = (newSlot: Omit<SlotItem, 'id'>) => {
    const id = 'slot-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const item: SlotItem = { ...newSlot, id };
    setSlots(prev => [...prev, item]);
    return item;
  };

  const deleteSlot = (id: string) => {
    setSlots(prev => prev.filter(s => s.id !== id));
  };

  const moveSlot = (id: string, targetDay: DayOfWeek, targetStartTime?: string, targetEndTime?: string) => {
    setSlots(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        return {
          ...s,
          day: targetDay,
          startTime: targetStartTime || s.startTime,
          endTime: targetEndTime || s.endTime,
        };
      })
    );
  };

  const updateSlotStatus = (id: string, status: SlotStatus) => {
    updateSlot(id, { status });
  };

  const updateSlotNotes = (id: string, notes: string) => {
    updateSlot(id, { notes });
  };

  const toggleChecklistItem = (slotId: string, checklistId: string) => {
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
    if (window.confirm('Tüm notlar ve takvim başlangıç ayarlarına sıfırlansın mı? (Mevcut durum yedeğe kaydedilecektir)')) {
      setSlots(INITIAL_SLOTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SLOTS));
    }
  };

  const importSchedule = (newSlots: SlotItem[]) => {
    setSlots(newSlots);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlots));
  };

  return {
    slots,
    lastSaved,
    snapshots,
    restoreSnapshot,
    updateSlot,
    addSlot,
    deleteSlot,
    moveSlot,
    updateSlotStatus,
    updateSlotNotes,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
    resetToDefault,
    importSchedule,
  };
}
