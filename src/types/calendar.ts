export type DayOfWeek = 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday' 
  | 'sunday';

export type Category = 
  | 'snf1'      // 1. Sınıf Zorunlu (Amfi 8 - Zümrüt Yeşili)
  | 'snf2'      // 2. Sınıf Zorunlu (Amfi 1 - Shark Blue)
  | 'lib'       // Merkez Kütüphane / Olay Çözümü (Altın / Amber)
  | 'deepwork'  // Yazılım, Donanım & Şirket Projeleri (Mor / Electric Violet)
  | 'free'      // Doktrin Taraması, Hazırlık, Serbest
  | 'lunch'     // Öğle Yemeği & Mola
  | 'weekend'   // Hafta Sonu Dinlenme & Spor
  | 'custom';   // Kullanıcı Özel Etkinliği

export type SlotStatus = 'pending' | 'attended' | 'critical' | 'cancelled';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface SlotItem {
  id: string;
  day: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "09:40"
  title: string;
  subtitle?: string;
  room?: string;     // "Amfi 8", "Amfi 1", vb.
  category: Category;
  status: SlotStatus;
  notes: string;
  checklist: ChecklistItem[];
  ects?: number;
  rowSpan?: number;  // For visual block grouping if needed
  isCustom?: boolean;
  dateIso?: string;   // YYYY-MM-DD for specific calendar day
  isRecurring?: boolean; // True for semester recurring weekly lectures
}

export interface CourseInfo {
  code: string;
  name: string;
  grade: 1 | 2;
  room: string;
  ects: number;
  weeklyHours: number;
  instructor?: string;
  examFormat: 'Olay Çözümü & Klasik' | 'Çoktan Seçmeli (Test)' | 'Teorik Klasik';
  strategy: string;
}

export type FilterCategory = 'all' | 'snf1' | 'snf2' | 'deepwork' | 'lib';

export type ViewMode = 'matrix' | 'agenda' | 'cards';
