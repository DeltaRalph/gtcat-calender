import React, { useRef, useState } from 'react';
import { SlotItem } from '../types/calendar';
import { ScheduleSnapshot } from '../hooks/useScheduleStorage';
import { exportScheduleToJson, importScheduleFromJson } from '../utils/backupJson';
import { exportScheduleToIcs } from '../utils/exportIcs';
import { 
  X, 
  Settings, 
  Printer, 
  Calendar as CalendarIcon, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Cloud, 
  ShieldCheck, 
  HardDrive,
  Check,
  Globe,
  Sliders
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: SlotItem[];
  lastSaved: string;
  snapshots: ScheduleSnapshot[];
  onRestoreSnapshot: (id: string) => void;
  onReset: () => void;
  onImport: (slots: SlotItem[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  slots,
  lastSaved,
  snapshots,
  onRestoreSnapshot,
  onReset,
  onImport,
}) => {
  const [activeTab, setActiveTab] = useState<'sync' | 'backup' | 'export'>('sync');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importScheduleFromJson(
        file,
        (imported) => {
          onImport(imported);
          alert('Yedek başarıyla geri yüklendi!');
        },
        (error) => alert('Hata: ' + error)
      );
    }
  };

  const handleTestHostingerSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Hostinger API aranıyor...');
    try {
      const res = await fetch('/api/sync.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots, exportedAt: new Date().toISOString() }),
      });
      if (res.ok) {
        setSyncStatus('✅ Hostinger Bulutuna Başarıyla Senkronize Edildi!');
      } else {
        setSyncStatus('ℹ️ Hostinger API Henüz Yüklenmedi. Hostinger public_html içine yüklendiğinde otomatik aktif olacaktır.');
      }
    } catch {
      setSyncStatus('ℹ️ Yerel moddasınız. Hostinger sunucunuza aktarıldığında /api/sync.php anında aktifleşir.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-gt3-cardDark rounded-2xl shadow-2xl border border-slate-200 dark:border-gt3-borderDark z-10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-gt3-borderDark flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gt3-yellow/20 text-gt3-yellow flex items-center justify-center font-bold">
              <Settings className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Kontrol & Veri Merkezi</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  Sistem Aktif
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Son Kayıt: <b className="text-slate-700 dark:text-slate-300 font-mono">{lastSaved}</b>
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-gt3-borderDark px-5 bg-slate-50/30 dark:bg-slate-900/30 text-xs">
          <button
            onClick={() => setActiveTab('sync')}
            className={`py-3 px-4 font-bold border-b-2 transition-all ${
              activeTab === 'sync'
                ? 'border-gt3-yellow text-slate-900 dark:text-gt3-yellow'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Bulut & Senkronizasyon
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-4 font-bold border-b-2 transition-all ${
              activeTab === 'backup'
                ? 'border-gt3-yellow text-slate-900 dark:text-gt3-yellow'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Yedekleme & Geri Alma ({snapshots.length})
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 px-4 font-bold border-b-2 transition-all ${
              activeTab === 'export'
                ? 'border-gt3-yellow text-slate-900 dark:text-gt3-yellow'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Dışa Aktar (A4 / iCal)
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          
          {/* TAB 1: SYNC */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Hostinger & Vercel Bulut Senkronizasyonu
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                    Hazır
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Bu takvim ister <b>Vercel</b> üzerinde ücretsiz statik CDN ile, ister <b>Hostinger</b> üzerinde PHP API altyapısıyla çalışabilir. Her iki platform için de yönlendirme ve önbellek dosyaları (`vercel.json`, `.htaccess`, `sync.php`) tam konfigüre edilmiştir.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTestHostingerSync}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-sm"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>{isSyncing ? 'Senkronize Ediliyor...' : 'Buluta Senkronize Et'}</span>
                  </button>

                  {syncStatus && (
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                      {syncStatus}
                    </span>
                  )}
                </div>
              </div>

              {/* Reset to defaults danger zone */}
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                    Varsayılan İÜHF Programına Sıfırla
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Mevcut notları ve programı ilk 63 AKTS başlangıç durumuna döndürür.
                  </p>
                </div>
                <button
                  onClick={onReset}
                  className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 font-bold transition-colors"
                >
                  Sıfırla
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: BACKUP & SNAPSHOTS */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              {/* Quick file backup */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                    Dosya Yedeği (JSON)
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Tüm ders notlarını ve zaman çizelgesini tek bir `.json` dosyası olarak sakla.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportScheduleToJson(slots)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gt3-yellow text-black rounded-lg font-bold hover:bg-gt3-yellowHover shadow-gt3 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>İndir</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Geri Yükle</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".json" 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* Snapshots list */}
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-2 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-gt3-yellow" />
                  <span>Anlık Sistem Geri Alma Noktaları (Rollback)</span>
                </h5>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {snapshots.map((snap) => (
                    <div
                      key={snap.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{snap.timestamp}</span>
                        <span className="text-slate-500 text-[11px]">({snap.label})</span>
                      </div>
                      <button
                        onClick={() => onRestoreSnapshot(snap.id)}
                        className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-gt3-yellow font-bold text-[10.5px] hover:bg-gt3-yellow hover:text-black transition-colors"
                      >
                        Bu Yedeğe Dön
                      </button>
                    </div>
                  ))}
                  {snapshots.length === 0 && (
                    <p className="text-center text-slate-400 py-4 italic">
                      Henüz otomatik yedek oluşmadı.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-3">
              <div 
                onClick={() => {
                  onClose();
                  setTimeout(() => window.print(), 200);
                }}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50/60 dark:bg-slate-900/60 cursor-pointer flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-emerald-500 transition-colors">
                      A4 Landscape (Yatay) Resmî Çıktı / PDF İndir
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Tek sayfaya tam oturan, amfi ve saatlerin taşmadığı akademik program baskısı.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Yazdır →</span>
              </div>

              <div 
                onClick={() => exportScheduleToIcs(slots)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 bg-slate-50/60 dark:bg-slate-900/60 cursor-pointer flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-purple-500 transition-colors">
                      Google & Apple Takvime Aktar (.ics Dosyası)
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Haftalık tüm amfi derslerini telefonundaki takvim uygulamasına tek tıkla entegre et.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">.ics İndir →</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-gt3-borderDark bg-slate-50/60 dark:bg-slate-900/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            GTCAT Calendar Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gt3-yellow text-black font-bold text-xs hover:bg-gt3-yellowHover shadow-gt3 transition-all"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
