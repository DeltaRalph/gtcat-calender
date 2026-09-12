import React from 'react';
import { 
  Plus, 
  BookOpen, 
  Settings, 
  Sun, 
  Moon, 
  Table, 
  CalendarCheck, 
  LayoutGrid,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ViewMode } from '../types/calendar';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenAddModal: () => void;
  onOpenSyllabusModal: () => void;
  onOpenSettingsModal: () => void;
  weekTitle: string;
  semesterWeekLabel: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  isCurrentWeek: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  viewMode,
  onViewModeChange,
  onOpenAddModal,
  onOpenSyllabusModal,
  onOpenSettingsModal,
  weekTitle,
  semesterWeekLabel,
  onPrevWeek,
  onNextWeek,
  onToday,
  isCurrentWeek,
}) => {
  return (
    <header className="no-print bg-white/95 dark:bg-gt3-cardDark/95 backdrop-blur-md border-b border-gt3-borderLight dark:border-gt3-borderDark sticky top-0 z-30 transition-colors">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Clean Brand & Dynamic Week Navigator */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gt3-yellow to-amber-500 flex items-center justify-center font-mono font-black text-black shadow-gt3 text-base tracking-tighter shrink-0 cursor-pointer hover:scale-105 transition-transform">
              GT3
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm text-slate-900 dark:text-white tracking-tight">
                GTCAT <span className="text-gt3-yellow">CALENDAR</span>
              </span>
              
              <div className="hidden xl:flex items-center gap-1.5 pl-2.5 border-l border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">Erdal Çetin</span>
                <span>•</span>
                <span>İÜHF Çift Şube</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gt3-yellow/20 text-yellow-800 dark:text-gt3-yellow border border-gt3-yellow/30 font-mono">
                  63 AKTS
                </span>
              </div>
            </div>

            {/* Dynamic Multi-Week Stepper (Linear / Cron style) */}
            <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-900/90 px-2 py-1 rounded-xl border border-slate-200/80 dark:border-slate-800 ml-1">
              <div className="flex items-center">
                <button
                  onClick={onPrevWeek}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  title="Önceki Hafta"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={onToday}
                  className={`px-2 py-0.5 text-xs font-bold rounded-lg transition-all ${
                    isCurrentWeek
                      ? 'text-slate-400 dark:text-slate-500 cursor-default'
                      : 'text-slate-900 dark:text-gt3-yellow hover:bg-slate-200/60 dark:hover:bg-slate-800 font-extrabold'
                  }`}
                  title="Bu Haftaya Git"
                >
                  Bugün
                </button>
                <button
                  onClick={onNextWeek}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  title="Sonraki Hafta"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

              <div className="flex items-center gap-1.5 px-1">
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white whitespace-nowrap">
                  {weekTitle}
                </span>
                {semesterWeekLabel && (
                  <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-gt3-yellow/15 text-yellow-800 dark:text-gt3-yellow border border-gt3-yellow/30 font-mono whitespace-nowrap">
                    {semesterWeekLabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Segmented View Mode Switcher */}
          <div className="flex items-center bg-slate-100/90 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => onViewModeChange('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'matrix'
                  ? 'bg-white text-slate-900 dark:bg-gt3-cardDark dark:text-gt3-yellow shadow-sm ring-1 ring-gt3-yellow/40'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="40 Dakikalık İÜHF Matrisi"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">40 Dk Matris</span>
            </button>

            <button
              onClick={() => onViewModeChange('agenda')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'agenda'
                  ? 'bg-white text-slate-900 dark:bg-gt3-cardDark dark:text-gt3-yellow shadow-sm ring-1 ring-gt3-yellow/40'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Girişimci Günlük Ajandası & Pomodoro Sayacı"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ajanda & Odak</span>
            </button>

            <button
              onClick={() => onViewModeChange('cards')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 dark:bg-gt3-cardDark dark:text-gt3-yellow shadow-sm ring-1 ring-gt3-yellow/40'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="7 Günlük Kart Panosu"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kart Panosu</span>
            </button>
          </div>

          {/* Right: Only Essential Actions (Sleek & Single Line) */}
          <div className="flex items-center gap-2">
            {/* Syllabus / Ders Rehberi */}
            <button
              onClick={onOpenSyllabusModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              title="9 Dersin Sınav Stratejileri & AKTS Rehberi"
            >
              <BookOpen className="w-3.5 h-3.5 text-gt3-yellow" />
              <span className="hidden md:inline">Ders Rehberi</span>
            </button>

            {/* Primary CTA: Add Slot */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-lg bg-gt3-yellow text-black hover:bg-gt3-yellowHover transition-all shadow-gt3 hover:shadow-gt3-lg"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Yeni Slot</span>
            </button>

            {/* Master Settings Hub (Replaces the 7 cluttered buttons) */}
            <button
              onClick={onOpenSettingsModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Ayarlar, DB Yedekleme, Hostinger Bulut & Yazdır"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden lg:inline">Ayarlar</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gt3-yellow hover:border-gt3-yellow/50 transition-colors"
              title={theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
