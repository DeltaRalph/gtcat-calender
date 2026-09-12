import React from 'react';
import { SlotItem } from '../types/calendar';
import { DAYS_CONFIG, TIME_SLOTS } from '../data/initialSchedule';

interface PrintViewProps {
  slots: SlotItem[];
}

export const PrintView: React.FC<PrintViewProps> = ({ slots }) => {
  return (
    <div className="print-only hidden print:block p-0 m-0 bg-white text-black font-sans">
      {/* Print Header */}
      <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-900 text-white font-extrabold flex items-center justify-center font-mono text-sm">
            İÜ
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-blue-950 uppercase leading-none">
              İSTANBUL ÜNİVERSİTESİ HUKUK FAKÜLTESİ
            </h1>
            <p className="text-[9px] text-slate-600 mt-1 font-semibold">
              2026 – 2027 Güz Yarıyılı • Haftalık Akademik Çizelge (GTCAT Cockpit)
            </p>
          </div>
        </div>

        <div className="flex gap-2 text-right">
          <div className="border border-slate-300 rounded px-2 py-1">
            <span className="text-[7px] text-slate-500 font-bold block uppercase">Öğrenci</span>
            <span className="text-[9px] font-bold text-black">Erdal Çetin</span>
          </div>
          <div className="border border-slate-300 rounded px-2 py-1">
            <span className="text-[7px] text-slate-500 font-bold block uppercase">Öğrenci No</span>
            <span className="text-[9px] font-bold font-mono text-black">0201230222</span>
          </div>
          <div className="border border-slate-300 rounded px-2 py-1">
            <span className="text-[7px] text-slate-500 font-bold block uppercase">Şube</span>
            <span className="text-[9px] font-bold text-black">ÇİFT (1. & 2. Snf)</span>
          </div>
          <div className="border border-slate-300 rounded px-2 py-1">
            <span className="text-[7px] text-slate-500 font-bold block uppercase">Kayıt</span>
            <span className="text-[9px] font-bold text-black">9 Ders • 63 AKTS</span>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <table className="w-full border-collapse border border-slate-300 text-[8pt] table-fixed">
        <thead>
          <tr className="bg-slate-900 text-white text-[7.5pt] uppercase">
            <th className="w-[65px] border border-slate-400 p-1 text-center font-bold">Saat</th>
            {DAYS_CONFIG.map(d => (
              <th key={d.key} className="border border-slate-400 p-1 text-center font-bold">
                {d.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((t) => (
            <tr key={t.start} className="h-[46px]">
              <td className="border border-slate-300 p-1 text-center font-mono font-bold text-[7pt] bg-slate-100 whitespace-nowrap">
                {t.start} - {t.end}
              </td>

              {DAYS_CONFIG.map((d) => {
                const daySlots = slots.filter(
                  (s) => s.day === d.key && s.startTime === t.start
                );

                if (daySlots.length === 0) {
                  return (
                    <td key={d.key} className="border border-slate-200 p-1 text-center text-slate-400 text-[6.5pt] italic">
                      —
                    </td>
                  );
                }

                return (
                  <td key={d.key} className="border border-slate-300 p-1 align-middle">
                    {daySlots.map((slot) => {
                      const isSnf1 = slot.category === 'snf1';
                      const isSnf2 = slot.category === 'snf2';
                      const isLib = slot.category === 'lib';
                      const isTech = slot.category === 'deepwork';

                      let borderClass = 'border-l-2 border-slate-400 bg-slate-50';
                      if (isSnf1) borderClass = 'border-l-3 border-emerald-600 bg-emerald-50 text-emerald-950';
                      if (isSnf2) borderClass = 'border-l-3 border-blue-600 bg-blue-50 text-blue-950';
                      if (isLib) borderClass = 'border-l-3 border-amber-600 bg-amber-50 text-amber-950';
                      if (isTech) borderClass = 'border-l-3 border-purple-600 bg-purple-50 text-purple-950';

                      return (
                        <div key={slot.id} className={`p-1 rounded text-left ${borderClass} leading-tight`}>
                          <div className="font-bold text-[7.5pt] flex items-center justify-between">
                            <span>{slot.title}</span>
                            {slot.room && (
                              <span className="text-[6pt] font-extrabold px-1 rounded bg-black/10">
                                {slot.room}
                              </span>
                            )}
                          </div>
                          {slot.subtitle && (
                            <div className="text-[6.5pt] opacity-85 mt-0.5 truncate">
                              {slot.subtitle}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Print Footer */}
      <div className="mt-2 pt-1 border-t border-slate-300 flex justify-between items-center text-[7pt] text-slate-600">
        <div className="flex gap-4">
          <span><b className="text-emerald-700">■ Yeşil:</b> 1. Sınıf Dersleri (Amfi 8 / ÖÖ)</span>
          <span><b className="text-blue-700">■ Mavi:</b> 2. Sınıf Dersleri (Amfi 1 / Sabah)</span>
          <span><b className="text-amber-700">■ Altın:</b> Merkez Kütüphane Olay Çözümü</span>
          <span><b className="text-purple-700">■ Mor:</b> Deep Work & Yazılım</span>
        </div>
        <div className="font-semibold text-slate-500">
          GTCAT Calendar • Porsche 911 GT3 RS Edition • erdalcetin.com
        </div>
      </div>
    </div>
  );
};
