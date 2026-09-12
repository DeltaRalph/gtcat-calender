import React from 'react';
import { COURSES_DATA } from '../data/initialSchedule';
import { X, BookOpen, GraduationCap, Award, MapPin } from 'lucide-react';

interface QuickSyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSyllabusModal: React.FC<QuickSyllabusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const snf1Courses = COURSES_DATA.filter(c => c.grade === 1);
  const snf2Courses = COURSES_DATA.filter(c => c.grade === 2);

  const totalEcts = COURSES_DATA.reduce((sum, c) => sum + c.ects, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-3xl bg-white dark:bg-gt3-cardDark rounded-2xl shadow-2xl border border-slate-200 dark:border-gt3-borderDark p-5 sm:p-7 z-10 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gt3-borderDark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gt3-yellow/20 text-gt3-yellow flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                İÜHF Akademik Ders Rehberi & Sınav Stratejileri
              </h3>
              <p className="text-xs text-slate-500 dark:text-gt3-textMutedDark">
                Erdal Çetin • Çift Şube • Toplam {COURSES_DATA.length} Ders ({totalEcts} AKTS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 text-xs">
          
          {/* 1. Sınıf Grubu */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                1. Sınıf Zorunlu Dersleri (Amfi 8 / Öğleden Sonra)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {snf1Courses.map(course => (
                <div 
                  key={course.code}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 border-l-4 border-l-emerald-500"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {course.code}
                    </span>
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      {course.ects} AKTS • {course.weeklyHours} Saat
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    {course.name}
                  </h5>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{course.room}</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{course.examFormat}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-white/60 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    💡 <b>Taktik:</b> {course.strategy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Sınıf Grubu */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                2. Sınıf Zorunlu Dersleri (Amfi 1 / Sabah Grubu)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {snf2Courses.map(course => (
                <div 
                  key={course.code}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 border-l-4 border-l-blue-500"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      {course.code}
                    </span>
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300">
                      {course.ects} AKTS • {course.weeklyHours} Saat
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    {course.name}
                  </h5>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{course.room}</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{course.examFormat}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-white/60 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    💡 <b>Taktik:</b> {course.strategy}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-gt3-borderDark flex items-center justify-between text-slate-500 text-[11px]">
          <span>İstanbul Üniversitesi Hukuk Fakültesi Beyazıt Kampüsü</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gt3-yellow text-black font-bold text-xs hover:bg-gt3-yellowHover transition-all"
          >
            Anladım
          </button>
        </div>

      </div>
    </div>
  );
};
