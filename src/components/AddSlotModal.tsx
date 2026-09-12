import React, { useState, useEffect } from 'react';
import { SlotItem, DayOfWeek, Category } from '../types/calendar';
import { DAYS_CONFIG } from '../data/initialSchedule';
import { X, Plus, Calendar, Clock, MapPin } from 'lucide-react';

interface AddSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newSlot: Omit<SlotItem, 'id'>, dateIso?: string) => void;
  initialDay?: DayOfWeek;
  initialStartTime?: string;
  initialEndTime?: string;
  initialDateIso?: string;
}

export const AddSlotModal: React.FC<AddSlotModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialDay = 'monday',
  initialStartTime = '16:30',
  initialEndTime = '17:30',
  initialDateIso,
}) => {
  const [day, setDay] = useState<DayOfWeek>(initialDay);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [room, setRoom] = useState('');
  const [category, setCategory] = useState<Category>('custom');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDay(initialDay);
      setStartTime(initialStartTime);
      setEndTime(initialEndTime);
      setTitle('');
      setSubtitle('');
      setRoom('');
      setNotes('');
    }
  }, [isOpen, initialDay, initialStartTime, initialEndTime]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Lütfen bir başlık giriniz.');
      return;
    }

    onAdd({
      day,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      startTime,
      endTime,
      room: room.trim() || undefined,
      category,
      status: 'pending',
      notes,
      checklist: [],
      isCustom: true,
      dateIso: initialDateIso,
    }, initialDateIso);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-md bg-white dark:bg-gt3-cardDark rounded-2xl shadow-2xl border border-slate-200 dark:border-gt3-borderDark p-5 sm:p-6 z-10 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gt3-borderDark mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gt3-yellow/20 text-gt3-yellow">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Yeni Takvim Slotu Ekle
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Day Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-gt3-textMutedDark uppercase mb-1">
              Gün
            </label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value as DayOfWeek)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-gt3-yellow"
            >
              {DAYS_CONFIG.map(d => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-gt3-textMutedDark uppercase mb-1">
              Başlık *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Sprint Planlama / Borçlar Olay Çözümü"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-gt3-yellow"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-gt3-textMutedDark uppercase mb-1">
              Alt Başlık / Konu
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Örn: Hafta 4 pratik tekrarı"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-gt3-yellow"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-gt3-textMutedDark uppercase mb-1">
                Başlangıç
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-gt3-yellow"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-gt3-textMutedDark uppercase mb-1">
                Bitiş
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-gt3-yellow"
              />
            </div>
          </div>

          {/* Room / Location */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-gt3-textMutedDark uppercase mb-1">
              Mekan / Amfi
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Örn: Amfi 8, Amfi 1, Merkez Ktp., Home Office"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-gt3-yellow"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-gt3-textMutedDark uppercase mb-1">
              Kategori & Renk Stili
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-gt3-yellow"
            >
              <option value="custom">Özel Etkinlik (GT3 RS Sarı)</option>
              <option value="snf1">1. Sınıf Dersi (Amfi 8 - Yeşil)</option>
              <option value="snf2">2. Sınıf Dersi (Amfi 1 - Mavi)</option>
              <option value="lib">Kütüphane / Etüt (Altın / Amber)</option>
              <option value="deepwork">Deep Work & Yazılım (Mor / Violet)</option>
              <option value="free">Serbest / Dinlenme (Gri)</option>
              <option value="weekend">Hafta Sonu (Gri)</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-gt3-borderDark">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-white font-semibold transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gt3-yellow text-black font-extrabold hover:bg-gt3-yellowHover transition-all shadow-gt3"
            >
              Takvime Kaydet
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
