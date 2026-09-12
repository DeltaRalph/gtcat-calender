import React from 'react';
import { SlotItem } from '../types/calendar';
import { 
  CheckCircle2, 
  Star, 
  FileText, 
  CheckSquare, 
  AlertCircle,
  MapPin
} from 'lucide-react';

interface SlotCardProps {
  slot: SlotItem;
  onClick: () => void;
  isMuted?: boolean;
}

export const SlotCard: React.FC<SlotCardProps> = ({ slot, onClick, isMuted = false }) => {
  const isLunch = slot.category === 'lunch';
  
  // Style config per category
  const categoryStyles: Record<string, { border: string; bg: string; text: string; badge: string }> = {
    snf1: {
      border: 'border-l-4 border-l-emerald-500',
      bg: 'bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08] dark:bg-emerald-500/[0.07] dark:hover:bg-emerald-500/[0.12]',
      text: 'text-emerald-700 dark:text-emerald-400',
      badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    },
    snf2: {
      border: 'border-l-4 border-l-slate-400 dark:border-l-slate-300',
      bg: 'bg-slate-400/[0.06] hover:bg-slate-400/[0.12] dark:bg-slate-700/[0.2] dark:hover:bg-slate-700/[0.3]',
      text: 'text-slate-800 dark:text-slate-200',
      badge: 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    },
    lib: {
      border: 'border-l-4 border-l-amber-500',
      bg: 'bg-amber-500/[0.05] hover:bg-amber-500/[0.09] dark:bg-amber-500/[0.08] dark:hover:bg-amber-500/[0.13]',
      text: 'text-amber-800 dark:text-amber-300',
      badge: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30',
    },
    deepwork: {
      border: 'border-l-4 border-l-purple-500',
      bg: 'bg-purple-500/[0.04] hover:bg-purple-500/[0.08] dark:bg-purple-500/[0.07] dark:hover:bg-purple-500/[0.12]',
      text: 'text-purple-700 dark:text-purple-400',
      badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/20',
    },
    weekend: {
      border: 'border-l-4 border-l-slate-400 dark:border-l-slate-600',
      bg: 'bg-slate-500/[0.03] hover:bg-slate-500/[0.06] dark:bg-slate-800/40 dark:hover:bg-slate-800/60',
      text: 'text-slate-700 dark:text-slate-300',
      badge: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    },
    free: {
      border: 'border-l-3 border-l-slate-300 dark:border-l-slate-700',
      bg: 'bg-slate-50/50 hover:bg-slate-100/60 dark:bg-slate-900/30 dark:hover:bg-slate-900/60',
      text: 'text-slate-600 dark:text-slate-400',
      badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800',
    },
    custom: {
      border: 'border-l-4 border-l-gt3-yellow',
      bg: 'bg-yellow-500/[0.04] hover:bg-yellow-500/[0.08] dark:bg-yellow-500/[0.06] dark:hover:bg-yellow-500/[0.10]',
      text: 'text-yellow-700 dark:text-gt3-yellow',
      badge: 'bg-yellow-500/20 text-yellow-800 dark:text-gt3-yellow border-yellow-500/30',
    },
  };

  const style = categoryStyles[slot.category] || categoryStyles.free;
  const completedChecklistCount = slot.checklist.filter(c => c.done).length;
  const hasChecklist = slot.checklist.length > 0;
  const hasNotes = Boolean(slot.notes && slot.notes.trim().length > 0);

  if (isLunch) {
    return (
      <div 
        onClick={onClick}
        className={`px-2.5 py-1.5 rounded-lg text-center cursor-pointer transition-all border border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 ${
          isMuted ? 'opacity-20 grayscale' : 'opacity-85'
        }`}
      >
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <span>🍽️</span> <span>{slot.title}</span>
        </span>
      </div>
    );
  }

  return (
    <div
      draggable={true}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', slot.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={onClick}
      className={`group relative rounded-xl p-2.5 sm:p-3 transition-all cursor-grab active:cursor-grabbing border border-slate-200/80 dark:border-gt3-borderDark/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
        style.border
      } ${style.bg} ${
        isMuted ? 'opacity-25 grayscale' : 'opacity-100'
      } ${
        slot.status === 'attended' ? 'ring-1 ring-emerald-500/30' : ''
      } ${
        slot.status === 'critical' ? 'ring-2 ring-gt3-yellow/60' : ''
      }`}
    >
      {/* Top Meta Line: Time & Status Badges */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
          {slot.startTime} – {slot.endTime}
        </span>

        <div className="flex items-center gap-1">
          {slot.status === 'critical' && (
            <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-yellow-400/20 text-yellow-700 dark:text-gt3-yellow border border-yellow-400/30" title="Kritik / Vize Konusu">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span>KRİTİK</span>
            </span>
          )}

          {slot.status === 'attended' && (
            <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30" title="Tamamlandı / Katıldım">
              <CheckCircle2 className="w-2.5 h-2.5 stroke-[2.5]" />
              <span>KATILDIM</span>
            </span>
          )}

          {slot.status === 'cancelled' && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 line-through">
              İPTAL
            </span>
          )}
        </div>
      </div>

      {/* Main Title */}
      <h3 className={`text-xs font-bold leading-snug tracking-tight mb-1 ${style.text} ${slot.status === 'cancelled' ? 'line-through text-slate-400' : ''}`}>
        {slot.title}
      </h3>

      {/* Subtitle / Short Topic */}
      {slot.subtitle && (
        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mb-1.5">
          {slot.subtitle}
        </p>
      )}

      {/* Bottom Row: Room Badge & Indicators */}
      <div className="flex items-center justify-between gap-1 mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-[10px]">
        {slot.room ? (
          <span className={`inline-flex items-center gap-1 font-bold text-[9px] px-1.5 py-0.5 rounded border ${style.badge}`}>
            <MapPin className="w-2.5 h-2.5" />
            <span>{slot.room}</span>
          </span>
        ) : <span />}

        {/* Notes & Checklist Indicators */}
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
          {hasNotes && (
            <span className="flex items-center" title="Not kaydedildi">
              <FileText className="w-3 h-3 text-slate-500 dark:text-slate-400 hover:text-gt3-yellow" />
            </span>
          )}

          {hasChecklist && (
            <span 
              className={`flex items-center gap-0.5 font-mono text-[9px] font-bold px-1 py-0.2 rounded ${
                completedChecklistCount === slot.checklist.length
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-500'
              }`}
              title={`${completedChecklistCount}/${slot.checklist.length} görev tamamlandı`}
            >
              <CheckSquare className="w-2.5 h-2.5" />
              <span>{completedChecklistCount}/{slot.checklist.length}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
