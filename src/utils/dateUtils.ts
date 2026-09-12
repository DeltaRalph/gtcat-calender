/**
 * GTCAT Calendar — Dynamic Date & Week Utilities
 * Supports infinite multi-week navigation, academic semester week calculation,
 * and date formatting in Turkish.
 */

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const TURKISH_MONTHS_SHORT = [
  'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
  'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
];

const TURKISH_DAYS = [
  'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'
];

const TURKISH_DAYS_SHORT = [
  'Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'
];

// Reference semester start: Mid September 2026 (Monday, Sep 14, 2026)
export const SEMESTER_START_DATE = new Date(2026, 8, 14); // 14 Sept 2026

/**
 * Gets the Monday of the week for any given date
 */
export function getMonday(d: Date): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = date.getDay(); // 0 is Sunday, 1 is Monday...
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

/**
 * Format a Date to 'YYYY-MM-DD'
 */
export function formatDateIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse 'YYYY-MM-DD' to Date
 */
export function parseDateIso(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Add weeks to a date
 */
export function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Check if two dates are the same calendar day
 */
export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Returns formatted 7 days of the week starting from given Monday
 */
export interface WeekDayInfo {
  date: Date;
  dateIso: string;
  dayKey: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  dayName: string;
  dayShort: string;
  dayNumber: number;
  monthName: string;
  isToday: boolean;
  isPast: boolean;
}

const DAY_KEYS: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

export function getWeekDays(monday: Date): WeekDayInfo[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }).map((_, i) => {
    const current = addDays(monday, i);
    current.setHours(0, 0, 0, 0);
    const dayOfWeek = current.getDay(); // 0 is Sun, 1 is Mon...

    return {
      date: current,
      dateIso: formatDateIso(current),
      dayKey: DAY_KEYS[i],
      dayName: TURKISH_DAYS[dayOfWeek],
      dayShort: TURKISH_DAYS_SHORT[dayOfWeek],
      dayNumber: current.getDate(),
      monthName: TURKISH_MONTHS_SHORT[current.getMonth()],
      isToday: isSameDay(current, today),
      isPast: current < today,
    };
  });
}

/**
 * Formats week range for top bar, e.g. "14 – 20 Eylül 2026"
 */
export function formatWeekTitle(monday: Date): string {
  const sunday = addDays(monday, 6);
  const startDay = monday.getDate();
  const endDay = sunday.getDate();
  const startMonth = TURKISH_MONTHS[monday.getMonth()];
  const endMonth = TURKISH_MONTHS[sunday.getMonth()];
  const year = sunday.getFullYear();

  if (monday.getMonth() === sunday.getMonth()) {
    return `${startDay} – ${endDay} ${startMonth} ${year}`;
  }
  return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`;
}

/**
 * Calculates academic semester week number (e.g. "Güz 1. Hafta", "Güz 5. Hafta")
 */
export function getSemesterWeekLabel(monday: Date): string {
  const diffTime = monday.getTime() - SEMESTER_START_DATE.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;

  if (diffWeeks <= 0) {
    return 'Dönem Öncesi Hazırlık';
  } else if (diffWeeks >= 1 && diffWeeks <= 14) {
    return `Güz Yarıyılı ${diffWeeks}. Hafta`;
  } else if (diffWeeks === 15 || diffWeeks === 16) {
    return `Final Sınavları Haftası`;
  } else {
    return `${diffWeeks}. Hafta`;
  }
}
