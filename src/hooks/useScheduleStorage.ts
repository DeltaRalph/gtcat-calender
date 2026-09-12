import { useState, useEffect, useRef, useMemo } from 'react';
import { SlotItem, ChecklistItem, SlotStatus, DayOfWeek, TodoItem, Category } from '../types/calendar';
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
const TODOS_KEY = 'gtcat_schedule_todos_v1';

export interface ScheduleSnapshot {
  id: string;
  timestamp: string;
  label: string;
  slotCount: number;
  slots: SlotItem[];
}

const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'todo-1',
    text: 'Borçlar Hukuku: Kusursuz Sorumluluk & Adam Çalıştıranın Sorumluluğu olay çözümü',
    done: false,
    category: 'snf2',
    priority: true,
    createdAt: 'Bugün',
  },
  {
    id: 'todo-2',
    text: 'Ceza Genel: Olası Kast ve Bilinçli Taksir ayrımı Yargıtay özetini çıkar',
    done: false,
    category: 'snf2',
    priority: true,
    createdAt: 'Bugün',
  },
  {
    id: 'todo-3',
    text: 'GT3 Core Engine: Takvim bulut eşitleme ve sürükle-bırak API optimizasyonu',
    done: true,
    category: 'deepwork',
    priority: true,
    createdAt: 'Dün',
  },
  {
    id: 'todo-4',
    text: 'Anayasa Hukuku: İptal Davaları ve Somut Norm Denetimi süre tablosu',
    done: false,
    category: 'snf1',
    priority: false,
    createdAt: 'Bugün',
  },
  {
    id: 'todo-5',
    text: 'Merkez Kütüphane: 3 saatlik blokta Medeni Hukuk pratik çalışma',
    done: false,
    category: 'lib',
    priority: false,
    createdAt: 'Bugün',
  },
];

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

  // 4. Amie Todos State (Draggable to Calendar)
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem(TODOS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TODOS;
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
      localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
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
  }, [slots, dateOverrides, todos]);

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

  // --- Amie Todo Methods ---
  const addTodo = (text: string, category: Category = 'custom', priority: boolean = false, dateIso?: string) => {
    const newTodo: TodoItem = {
      id: 'todo-' + Date.now(),
      text: text.trim(),
      done: false,
      category,
      priority,
      dateIso,
      createdAt: 'Bugün',
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const toggleTodoPriority = (id: string) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, priority: !t.priority } : t)));
  };

  /**
   * Converts a todo item directly into a calendar time-block slot!
   * Supports dragging from AmieTodoSidebar into MatrixGrid or CalendarGrid.
   */
  const convertTodoToSlot = (
    todoId: string, 
    day: DayOfWeek, 
    startTime: string, 
    endTime: string, 
    dateIso?: string
  ) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    addSlot({
      day,
      startTime,
      endTime,
      title: todo.text,
      category: todo.category,
      status: 'pending',
      notes: `Amie To-do listesinden zaman bloğu olarak eklendi.`,
      checklist: [],
      isCustom: true,
      dateIso,
    }, dateIso);

    // Auto mark as completed or keep in list
    toggleTodo(todoId);
  };

  return {
    slots,
    todos,
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
    // Amie Todo handlers
    addTodo,
    toggleTodo,
    deleteTodo,
    toggleTodoPriority,
    convertTodoToSlot,
  };
}

