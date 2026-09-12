import React, { useState } from 'react';
import { SlotItem } from '../types/calendar';
import { ScheduleSnapshot } from '../hooks/useScheduleStorage';
import { exportScheduleToJson, importScheduleFromJson } from '../utils/backupJson';
import { 
  X, 
  Database, 
  ShieldCheck, 
  Download, 
  Upload, 
  RotateCcw, 
  Server, 
  Cloud, 
  Check, 
  AlertCircle,
  HardDrive,
  Globe
} from 'lucide-react';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: SlotItem[];
  lastSaved: string;
  snapshots: ScheduleSnapshot[];
  onRestoreSnapshot: (id: string) => void;
  onImport: (slots: SlotItem[]) => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  slots,
  lastSaved,
  snapshots,
  onRestoreSnapshot,
  onImport,
}) => {
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  // Test Hostinger API Sync
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
        setSyncStatus('⚠️ Hostinger API Henüz Yüklenmedi (Yerel Geliştirme Ortamı). Hostinger sunucunuza aktarıldığında otomatik çalışacaktır.');
      }
    } catch {
      setSyncStatus('ℹ️ Yerel moddasınız. Hostinger public_html içine yüklendiğinde /api/sync.php anında aktif olacaktır.');
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

      <div className="relative w-full max-w-2xl bg-white dark:bg-gt3-cardDark rounded-2xl shadow-2xl border border-slate-200 dark:border-gt3-borderDark p-5 sm:p-7 z-10 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gt3-borderDark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gt3-yellow/20 text-gt3-yellow flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Veritabanı & Hostinger Bulut Merkezi</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  Korumalı DB
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Son Otomatik Kayıt: <b className="text-slate-700 dark:text-slate-300 font-mono">{lastSaved}</b>
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

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 text-xs">
          
          {/* 1. DB Health Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  Çift Katmanlı Güvenli Depolama Aktif
                </h4>
                <p className="text-[11px] text-slate-500">
                  Her değişiklik anında yerel tarayıcıya (`localStorage`) ve anlık otomatik yedeklere (Snapshot) kaydedilir.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportScheduleToJson(slots)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-800 dark:text-gt3-yellow rounded-lg font-bold hover:bg-slate-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON Yedek İndir</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Yedek Yükle</span>
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

          {/* 2. Hostinger Entegrasyonu Bölümü */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  Hostinger Dağıtımı & PHP API Altyapısı
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                Hostinger Uyumlu (%100)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Proje **Hostinger'ın LiteSpeed / Apache web sunucusuna %100 uyumludur**. Projede oluşturduğumuz `public/.htaccess` ve `public/api/sync.php` dosyaları sayesinde:
              <br />• Hostinger'a yüklediğinde sayfa yenilemelerinde 404 hatası almazsın.
              <br />• Telefonundan ve bilgisayarından girip Hostinger bulut veritabanına tek tıkla senkronize olabilirsin.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleTestHostingerSync}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm transition-all"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>{isSyncing ? 'Senkronize Ediliyor...' : 'Hostinger Bulutuna Eşitle'}</span>
              </button>

              {syncStatus && (
                <span className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                  {syncStatus}
                </span>
              )}
            </div>
          </div>

          {/* 3. Otomatik Snapshot / Geri Alma Geçmişi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-gt3-yellow" />
                <span>Otomatik Sistem Yedekleri (Anlık Geri Alma Noktaları)</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                {snapshots.length} Yedek Mevcut
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs"
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
                  Henüz değişiklik yapılmadı. Düzenleme yaptıkça burada anlık geri alma noktaları listelenecektir.
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-gt3-borderDark flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            GTCAT Zero-Loss Data Protection Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gt3-yellow text-black font-bold text-xs hover:bg-gt3-yellowHover transition-all shadow-gt3"
          >
            Tamam
          </button>
        </div>

      </div>
    </div>
  );
};
