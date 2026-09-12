import React from 'react';
import { SlotItem } from '../types/calendar';
import { Scale, Cpu, BookOpenCheck, CheckCircle2 } from 'lucide-react';

interface StatsHUDProps {
  slots: SlotItem[];
}

export const StatsHUD: React.FC<StatsHUDProps> = ({ slots }) => {
  let totalTasks = 0;
  let doneTasks = 0;
  slots.forEach(slot => {
    slot.checklist.forEach(item => {
      totalTasks++;
      if (item.done) doneTasks++;
    });
  });

  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="no-print max-w-[1720px] mx-auto px-4 sm:px-6 pt-3 pb-1">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        
        {/* Law Class Hours */}
        <div className="bg-white/80 dark:bg-gt3-cardDark/80 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-gt3-borderDark/80 flex items-center justify-between group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-gt3-textMutedDark tracking-wider uppercase block">
                Fakülte Dersi
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Amfi 8 & Amfi 1
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black font-mono text-slate-900 dark:text-white block">15 Saat</span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">/ Hafta</span>
          </div>
        </div>

        {/* Deep Work & Tech */}
        <div className="bg-white/80 dark:bg-gt3-cardDark/80 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-gt3-borderDark/80 flex items-center justify-between group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-gt3-textMutedDark tracking-wider uppercase block">
                Deep Work & Şirket
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Yazılım & Donanım
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black font-mono text-purple-600 dark:text-purple-400 block">Cuma</span>
            <span className="text-[9px] text-slate-400 font-semibold">Tam Gün Boş</span>
          </div>
        </div>

        {/* Library Focus Block */}
        <div className="bg-white/80 dark:bg-gt3-cardDark/80 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-gt3-borderDark/80 flex items-center justify-between group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <BookOpenCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-gt3-textMutedDark tracking-wider uppercase block">
                Merkez Kütüphane
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Olay Çözümü & İçtihat
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black font-mono text-amber-600 dark:text-amber-400 block">4 Saat</span>
            <span className="text-[9px] text-slate-400 font-semibold">Perşembe</span>
          </div>
        </div>

        {/* Sprint / Checklist Progress */}
        <div className="bg-white/80 dark:bg-gt3-cardDark/80 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-gt3-borderDark/80 flex items-center justify-between group hover:border-gt3-yellow/40 transition-colors">
          <div className="flex items-center gap-2.5 flex-1 pr-3">
            <div className="w-7 h-7 rounded-lg bg-yellow-500/10 text-gt3-yellow flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-gt3-textMutedDark tracking-wider uppercase truncate">
                  Sprint Görevleri
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white">
                  %{progressPercent}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gt3-yellow h-full rounded-full transition-all duration-500 shadow-gt3"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 block">
              {doneTasks}/{totalTasks}
            </span>
            <span className="text-[9px] text-slate-400 font-semibold">Görev</span>
          </div>
        </div>

      </div>
    </div>
  );
};
