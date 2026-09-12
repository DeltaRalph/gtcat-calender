import { SlotItem } from '../types/calendar';

export function exportScheduleToJson(slots: SlotItem[]) {
  const dataStr = JSON.stringify({
    appName: 'GTCAT Calendar',
    version: '1.0.0',
    owner: 'Erdal Çetin',
    exportedAt: new Date().toISOString(),
    slots,
  }, null, 2);

  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `gtcat-calender-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importScheduleFromJson(
  file: File, 
  onSuccess: (slots: SlotItem[]) => void, 
  onError: (msg: string) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const parsed = JSON.parse(content);
      const slots = parsed.slots || parsed;
      if (Array.isArray(slots)) {
        onSuccess(slots);
      } else {
        onError('Geçersiz dosya formatı. "slots" dizisi bulunamadı.');
      }
    } catch (err) {
      onError('JSON dosyası okunamadı veya biçimi bozuk.');
    }
  };
  reader.onerror = () => onError('Dosya okuma hatası oluştu.');
  reader.readAsText(file);
}
