import React, { useState, useEffect } from 'react';
import { SlotItem, DayOfWeek } from '../types/calendar';
import { DAYS_CONFIG } from '../data/initialSchedule';
import { WeekDayInfo } from '../utils/dateUtils';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Plus, 
  Minus,
  Trash2, 
  Flame, 
  Sparkles,
  Timer,
  Sliders,
  History
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroSession {
  id: string;
  timestamp: string;
  durationMins: number;
  mode: 'focus' | 'break';
  label?: string;
}

interface DailyAgendaViewProps {
  slots: SlotItem[];
  weekDays?: WeekDayInfo[];
  getSlotsForDay?: (dateIso: string, dayKey: DayOfWeek) => SlotItem[];
  onSlotClick: (slot: SlotItem) => void;
  onUpdateSlotStatus: (id: string, status: any) => void;
  onQuickAdd: (day: DayOfWeek, dateIso?: string) => void;
}

export const DailyAgendaView: React.FC<DailyAgendaViewProps> = ({
  slots,
  weekDays,
  getSlotsForDay,
  onSlotClick,
  onUpdateSlotStatus,
  onQuickAdd,
}) => {
  // Active selected day
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(() => {
    const dayIndex = new Date().getDay();
    const map: DayOfWeek[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return map[dayIndex];
  });

  // Pomodoro Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [initialDuration, setInitialDuration] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');

  // Completed sessions history
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => {
    try {
      const saved = localStorage.getItem('gtcat_pomodoro_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Daily Scratchpad tasks (persisted per day)
  const [scratchTasks, setScratchTasks] = useState<{ id: string; text: string; done: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem(`gtcat_scratch_${selectedDay}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newTaskInput, setNewTaskInput] = useState('');

  // Daily Journal Note
  const [dailyJournal, setDailyJournal] = useState<string>(() => {
    return localStorage.getItem(`gtcat_journal_${selectedDay}`) || '';
  });

  // Load day data when selectedDay changes
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(`gtcat_scratch_${selectedDay}`);
      setScratchTasks(savedTasks ? JSON.parse(savedTasks) : []);
      const savedJournal = localStorage.getItem(`gtcat_journal_${selectedDay}`) || '';
      setDailyJournal(savedJournal);
    } catch (e) {
      console.error(e);
    }
  }, [selectedDay]);

  // Save scratchTasks
  useEffect(() => {
    localStorage.setItem(`gtcat_scratch_${selectedDay}`, JSON.stringify(scratchTasks));
  }, [scratchTasks, selectedDay]);

  // Save journal
  useEffect(() => {
    localStorage.setItem(`gtcat_journal_${selectedDay}`, dailyJournal);
  }, [dailyJournal, selectedDay]);

  // Save session history
  useEffect(() => {
    localStorage.setItem('gtcat_pomodoro_history', JSON.stringify(sessions));
  }, [sessions]);

  // Pomodoro countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      const sessionMinutes = Math.round(initialDuration / 60);

      const newSession: PomodoroSession = {
        id: 'sess-' + Date.now(),
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        durationMins: sessionMinutes,
        mode: timerMode,
        label: timerMode === 'focus' ? 'GT3 RS Odak Bloğu' : 'Pit-Stop Mola',
      };
      setSessions(prev => [newSession, ...prev]);

      if (timerMode === 'focus') {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD000', '#10B981', '#3B82F6'],
        });
        alert(`🏁 ${sessionMinutes} dakikalık GT3 RS Odak Seansı Başarıyla Tamamlandı! 5 dakikalık mola zamanı.`);
        setTimerMode('break');
        setInitialDuration(5 * 60);
        setTimerSeconds(5 * 60);
      } else {
        alert('⚡ Mola bitti! Yeni odak bloğuna hazır mısın?');
        setTimerMode('focus');
        setInitialDuration(25 * 60);
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode, initialDuration]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Adjust time by delta seconds (+/- 60s or +/- 300s)
  const adjustTimer = (deltaSeconds: number) => {
    if (isTimerRunning) return; // Don't adjust while active
    const newSec = Math.max(60, Math.min(180 * 60, timerSeconds + deltaSeconds));
    setTimerSeconds(newSec);
    setInitialDuration(newSec);
  };

  // Set preset minutes
  const setPresetMinutes = (minutes: number, mode: 'focus' | 'break' = 'focus') => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    const sec = minutes * 60;
    setInitialDuration(sec);
    setTimerSeconds(sec);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(initialDuration);
  };

  // Clear all sessions
  const handleClearSessions = () => {
    if (window.confirm('Tüm tamamlanan seans geçmişi silinsin mi?')) {
      setSessions([]);
    }
  };

  const handleDeleteSingleSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleAddScratchTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setScratchTasks((prev) => [
      ...prev,
      { id: 'st-' + Date.now(), text: newTaskInput.trim(), done: false },
    ]);
    setNewTaskInput('');
  };

  const handleToggleScratchTask = (id: string) => {
    setScratchTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleDeleteScratchTask = (id: string) => {
    setScratchTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addTimestampToJournal = () => {
    const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const line = `\n[${time}] `;
    setDailyJournal((prev) => prev + line);
  };

  // Build day list either from weekDays or fallback to DAYS_CONFIG
  const dayButtons = weekDays ? weekDays.map(w => {
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

  const activeDayInfo = dayButtons.find(d => d.key === selectedDay) || dayButtons[0];
  const activeDateIso = activeDayInfo.dateIso;

  // Day slots
  const daySlots = (getSlotsForDay && activeDateIso)
    ? getSlotsForDay(activeDateIso, selectedDay)
    : slots
        .filter((s) => s.day === selectedDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalFocusMinutes = sessions
    .filter(s => s.mode === 'focus')
    .reduce((acc, s) => acc + s.durationMins, 0);

  return (
    <div className="no-print max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
      
      {/* 1. Day Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {dayButtons.map((d) => {
          const isSelected = selectedDay === d.key;
          return (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-gt3-cardDark dark:text-gt3-yellow border-gt3-yellow/60 shadow-gt3 ring-1 ring-gt3-yellow/40'
                  : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{d.label}</span>
              {d.dayNumber !== undefined && (
                <span className="font-mono text-[11px] opacity-70">
                  {d.dayNumber} {d.monthName}
                </span>
              )}
              {d.isToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-gt3-yellow animate-pulse" title="Bugün" />
              )}
              {d.badge && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal">
                  {d.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Main Two-Column Executive Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT: Chronological Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-gt3-cardDark rounded-2xl border border-slate-200 dark:border-gt3-borderDark p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-gt3-borderDark mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📅 Günlük Zaman Çizelgesi</span>
              </h2>
              <p className="text-xs text-slate-500">
                {activeDayInfo.label} {activeDayInfo.dayNumber ? `(${activeDayInfo.dayNumber} ${activeDayInfo.monthName})` : ''} dersleri ve odak blokları
              </p>
            </div>

            <button
              onClick={() => onQuickAdd(selectedDay, activeDateIso)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-gt3-yellow text-black hover:bg-gt3-yellowHover shadow-gt3 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Etkinlik Ekle</span>
            </button>
          </div>

          {/* Timeline List */}
          <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {daySlots.map((slot) => {
              const isAttended = slot.status === 'attended';
              return (
                <div
                  key={slot.id}
                  className="relative group flex items-start justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-gt3-yellow/60 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer shadow-xs"
                  onClick={() => onSlotClick(slot)}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gt3-cardDark ${
                    isAttended 
                      ? 'bg-emerald-500 ring-2 ring-emerald-500/20' 
                      : slot.category === 'snf1'
                      ? 'bg-emerald-500'
                      : slot.category === 'snf2'
                      ? 'bg-slate-400 dark:bg-slate-300'
                      : slot.category === 'lib'
                      ? 'bg-amber-500'
                      : slot.category === 'deepwork'
                      ? 'bg-purple-500'
                      : 'bg-gt3-yellow'
                  }`} />

                  {/* Slot Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                      <Clock className="w-3 h-3 text-gt3-yellow" />
                      <span>{slot.startTime} – {slot.endTime}</span>
                      {slot.room && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-slate-600 dark:text-slate-300">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{slot.room}</span>
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className={`text-sm font-bold text-slate-900 dark:text-white ${
                      isAttended ? 'line-through text-slate-400' : ''
                    }`}>
                      {slot.title}
                    </h3>
                    {slot.subtitle && (
                      <p className="text-xs text-slate-500 mt-0.5">{slot.subtitle}</p>
                    )}

                    {slot.notes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 font-mono line-clamp-2">
                        {slot.notes}
                      </p>
                    )}
                  </div>

                  {/* Quick Attendance Checkbox */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateSlotStatus(
                        slot.id, 
                        slot.status === 'attended' ? 'pending' : 'attended'
                      );
                    }}
                    className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"
                    title={isAttended ? 'Katılımı Geri Al' : 'Katıldım Olarak İşaretle'}
                  >
                    <CheckCircle2 className={`w-5 h-5 ${isAttended ? 'text-emerald-500 fill-emerald-500/20' : ''}`} />
                  </div>
                </div>
              );
            })}

            {daySlots.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm">Bu güne ait planlanmış slot bulunamadı.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: GT3 RS Tachometer Pomodoro + Scratchpad + Journal (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* A. GT3 RS Tachometer Focus Timer */}
          <div className="bg-white dark:bg-gt3-cardDark rounded-2xl border border-slate-200 dark:border-gt3-borderDark p-5 shadow-sm relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gt3-yellow/20 text-gt3-yellow">
                  <Timer className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                  GT3 RS Odak Sayacı (Pomodoro)
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gt3-yellow border border-slate-200 dark:border-slate-700">
                  Toplam: {totalFocusMinutes} Dk
                </span>
                {sessions.length > 0 && (
                  <button
                    onClick={handleClearSessions}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    title="Seans Geçmişini Sıfırla"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Timer Dial & Steppers */}
            <div className="py-2 text-center">
              
              {/* Steppers & Digital Readout */}
              <div className="flex items-center justify-center gap-3 mb-1">
                <button
                  onClick={() => adjustTimer(-5 * 60)}
                  disabled={isTimerRunning}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-gt3-yellow hover:bg-slate-200 dark:hover:bg-slate-700 font-mono text-xs font-bold transition-all disabled:opacity-40"
                  title="5 Dakika Azalt"
                >
                  -5 dk
                </button>

                <button
                  onClick={() => adjustTimer(-60)}
                  disabled={isTimerRunning}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-gt3-yellow hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-40"
                  title="1 Dakika Azalt"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="font-mono text-5xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-sm min-w-[170px]">
                  {formatTimer(timerSeconds)}
                </div>

                <button
                  onClick={() => adjustTimer(60)}
                  disabled={isTimerRunning}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-gt3-yellow hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-40"
                  title="1 Dakika Artır"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => adjustTimer(5 * 60)}
                  disabled={isTimerRunning}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-gt3-yellow hover:bg-slate-200 dark:hover:bg-slate-700 font-mono text-xs font-bold transition-all disabled:opacity-40"
                  title="5 Dakika Artır"
                >
                  +5 dk
                </button>
              </div>

              {/* Status Badge */}
              <span className={`text-[10.5px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full inline-block mt-1 ${
                timerMode === 'focus' 
                  ? 'bg-gt3-yellow/20 text-yellow-800 dark:text-gt3-yellow border border-gt3-yellow/30' 
                  : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
              }`}>
                {timerMode === 'focus' ? '🏎️ GT3 RS Odak Seansı' : '☕ Pit-Stop (Mola)'}
              </span>

              {/* Quick Presets (15 dk, 25 dk, 40 dk İÜHF, 50 dk, 60 dk) */}
              <div className="flex items-center justify-center gap-1.5 flex-wrap mt-3.5">
                <span className="text-[10px] text-slate-400 font-mono uppercase mr-1">Hızlı Süre:</span>
                {[
                  { m: 15, label: '15 Dk' },
                  { m: 25, label: '25 Dk (Klasik)' },
                  { m: 40, label: '40 Dk (İÜHF Ders)' },
                  { m: 50, label: '50 Dk' },
                  { m: 60, label: '60 Dk' },
                ].map(p => (
                  <button
                    key={p.m}
                    onClick={() => setPresetMinutes(p.m, 'focus')}
                    disabled={isTimerRunning}
                    className={`px-2 py-1 text-[10.5px] font-bold rounded-md border transition-all ${
                      initialDuration === p.m * 60 && timerMode === 'focus'
                        ? 'bg-gt3-yellow text-black border-gt3-yellow shadow-gt3'
                        : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-gt3-yellow'
                    } disabled:opacity-40`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all ${
                    isTimerRunning
                      ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white hover:bg-slate-800'
                      : 'bg-gt3-yellow text-black hover:bg-gt3-yellowHover shadow-gt3 hover:scale-105'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isTimerRunning ? 'Duraklat' : 'Başlat'}</span>
                </button>

                <button
                  onClick={handleResetTimer}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500 border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Süreyi Başa Sar"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setPresetMinutes(5, 'break')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                >
                  5 Dk Mola
                </button>
              </div>

              {/* Completed Sessions Log List */}
              {sessions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <History className="w-3 h-3" />
                      <span>Tamamlanan Seanslar ({sessions.length})</span>
                    </span>
                    <button
                      onClick={handleClearSessions}
                      className="text-[9.5px] text-red-400 hover:underline"
                    >
                      Tümünü Temizle
                    </button>
                  </div>

                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {sessions.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-1.5 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[10.5px] group"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${s.mode === 'focus' ? 'bg-gt3-yellow' : 'bg-emerald-500'}`} />
                          <span className="font-mono text-slate-400">{s.timestamp}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{s.durationMins} dk {s.label}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteSingleSession(s.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* B. Daily Quick Scratchpad */}
          <div className="bg-white dark:bg-gt3-cardDark rounded-2xl border border-slate-200 dark:border-gt3-borderDark p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                <span>📝 Günlük Hızlı Yapılacaklar</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {scratchTasks.filter((t) => t.done).length}/{scratchTasks.length}
              </span>
            </div>

            <form onSubmit={handleAddScratchTask} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Bugün yapılacak hızlı görev..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gt3-yellow"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white dark:text-gt3-yellow font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors"
              >
                Ekle
              </button>
            </form>

            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {scratchTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs group"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => handleToggleScratchTask(t.id)}
                      className="w-3.5 h-3.5 rounded text-gt3-yellow focus:ring-gt3-yellow"
                    />
                    <span className={t.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'}>
                      {t.text}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteScratchTask(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {scratchTasks.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-3 italic">
                  Henüz hızlı görev eklenmedi.
                </p>
              )}
            </div>
          </div>

          {/* C. Daily Notes Journal */}
          <div className="bg-white dark:bg-gt3-cardDark rounded-2xl border border-slate-200 dark:border-gt3-borderDark p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                <span>📖 Günlük Ajanda Günlüğü</span>
              </h3>
              <button
                onClick={addTimestampToJournal}
                className="text-[10px] font-mono text-gt3-yellow hover:underline"
              >
                + Saat Damgası Ekle
              </button>
            </div>
            <textarea
              rows={5}
              value={dailyJournal}
              onChange={(e) => setDailyJournal(e.target.value)}
              placeholder="Bugün öğrendiğin önemli doktrin ilkeleri, toplantı notları veya yazılım fikirleri..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-sans text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gt3-yellow resize-none leading-relaxed"
            />
          </div>

        </div>

      </div>
    </div>
  );
};
