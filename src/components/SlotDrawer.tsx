import React, { useState, useEffect } from 'react';
import { SlotItem, SlotStatus, Category } from '../types/calendar';
import { 
  X, 
  Trash2, 
  Plus, 
  Check, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  FileText, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SlotDrawerProps {
  slot: SlotItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<SlotItem>) => void;
  onDelete: (id: string) => void;
  onToggleChecklist: (slotId: string, itemId: string) => void;
  onAddChecklist: (slotId: string, text: string) => void;
  onDeleteChecklist: (slotId: string, itemId: string) => void;
}

export const SlotDrawer: React.FC<SlotDrawerProps> = ({
  slot,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onToggleChecklist,
  onAddChecklist,
  onDeleteChecklist,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [room, setRoom] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<SlotStatus>('pending');
  const [newChecklistText, setNewChecklistText] = useState('');

  useEffect(() => {
    if (slot) {
      setTitle(slot.title || '');
      setSubtitle(slot.subtitle || '');
      setRoom(slot.room || '');
      setNotes(slot.notes || '');
      setStatus(slot.status || 'pending');
    }
  }, [slot]);

  if (!isOpen || !slot) return null;

  const handleStatusChange = (newStatus: SlotStatus) => {
    setStatus(newStatus);
    onUpdate(slot.id, { status: newStatus });
    if (newStatus === 'attended') {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#FFD000', '#10B981', '#3B82F6'],
      });
    }
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    onUpdate(slot.id, { notes: val });
  };

  const handleAddChecklist = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newChecklistText.trim()) {
      onAddChecklist(slot.id, newChecklistText.trim());
      setNewChecklistText('');
    }
  };

  const handleQuickSnippet = (snippet: string) => {
    const updated = notes ? notes + '\n' + snippet : snippet;
    setNotes(updated);
    onUpdate(slot.id, { notes: updated });
  };

  const handleDelete = () => {
    if (window.confirm(`"${slot.title}" slotunu silmek istediğine emin misin?`)) {
      onDelete(slot.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gt3-cardDark h-full shadow-2xl border-l border-slate-200 dark:border-gt3-borderDark flex flex-col z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-gt3-borderDark flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gt3-yellow animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gt3-yellow">
              Slot Inspector & Not Defteri
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Bu slotu sil"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Title & Timing Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-gt3-yellow mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{slot.startTime} – {slot.endTime}</span>
              <span>•</span>
              <span className="text-slate-400 capitalize">{slot.day}</span>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Ders / Slot Adı
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  onUpdate(slot.id, { title: e.target.value });
                }}
                className="w-full text-lg font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-gt3-yellow tracking-tight"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Alt Konu / Detay
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => {
                    setSubtitle(e.target.value);
                    onUpdate(slot.id, { subtitle: e.target.value });
                  }}
                  placeholder="Örn: 1. Blok / Pratik"
                  className="w-full text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-gt3-yellow"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Mekan / Amfi
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => {
                    setRoom(e.target.value);
                    onUpdate(slot.id, { room: e.target.value });
                  }}
                  placeholder="Örn: Amfi 8, Amfi 1"
                  className="w-full text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-gt3-yellow"
                />
              </div>
            </div>
          </div>

          {/* Status Switcher */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-gt3-textMutedDark block mb-2">
              Ders / Slot Durumu
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleStatusChange('pending')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  status === 'pending'
                    ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-slate-700 ring-1 ring-gt3-yellow/50'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                Beklemede
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('attended')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  status === 'attended'
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50 ring-1 ring-emerald-500/60'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Katıldım</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('critical')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  status === 'critical'
                    ? 'bg-yellow-500/20 text-yellow-800 dark:text-gt3-yellow border-yellow-500/50 ring-1 ring-gt3-yellow'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current text-gt3-yellow" />
                <span>Kritik Vize</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('cancelled')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  status === 'cancelled'
                    ? 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50 ring-1 ring-red-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                İptal / Boş
              </button>
            </div>
          </div>

          {/* Interactive Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-gt3-textMutedDark block">
                Görevler & Hazırlık Listesi ({slot.checklist.filter(c => c.done).length}/{slot.checklist.length})
              </label>
            </div>

            {/* Checklist Items */}
            <div className="space-y-1.5 mb-2.5">
              {slot.checklist.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 group"
                >
                  <label className="flex items-center gap-2.5 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => onToggleChecklist(slot.id, item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-gt3-yellow focus:ring-gt3-yellow"
                    />
                    <span className={`text-xs font-medium ${
                      item.done 
                        ? 'line-through text-slate-400 dark:text-slate-500' 
                        : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {item.text}
                    </span>
                  </label>

                  <button
                    onClick={() => onDeleteChecklist(slot.id, item.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Checklist Input */}
            <form onSubmit={handleAddChecklist} className="flex gap-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                placeholder="Yeni görev veya olay çalışması ekle..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gt3-yellow"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-800 dark:text-gt3-yellow text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                Ekle
              </button>
            </form>
          </div>

          {/* Rich Notes Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-gt3-textMutedDark block">
                Ders & Doktrin Notları (Markdown Destekli)
              </label>
            </div>

            {/* Quick Snippet Chips */}
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <button
                type="button"
                onClick={() => handleQuickSnippet('⚖️ Mevzuat Maddesi: ')}
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-gt3-yellow hover:border-gt3-yellow border border-slate-200 dark:border-slate-700 transition-colors"
              >
                + Mevzuat
              </button>
              <button
                type="button"
                onClick={() => handleQuickSnippet('📌 Olay Pratiği: ')}
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-gt3-yellow hover:border-gt3-yellow border border-slate-200 dark:border-slate-700 transition-colors"
              >
                + Olay Pratiği
              </button>
              <button
                type="button"
                onClick={() => handleQuickSnippet('🔍 Yargıtay İçtihadı: ')}
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-gt3-yellow hover:border-gt3-yellow border border-slate-200 dark:border-slate-700 transition-colors"
              >
                + Yargıtay Emsali
              </button>
              <button
                type="button"
                onClick={() => handleQuickSnippet('💻 Sprint Task: ')}
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30"
              >
                + Sprint Görevi
              </button>
            </div>

            <textarea
              rows={8}
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Ders notlarını, hocanın vurguladığı sınav sorularını veya sprint task'lerini buraya yazabilirsin..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-sans text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gt3-yellow leading-relaxed resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-gt3-borderDark bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Otomatik kaydedildi (LocalStorage)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gt3-yellow text-black font-bold text-xs hover:bg-gt3-yellowHover transition-all shadow-gt3"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
