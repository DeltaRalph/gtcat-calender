import { SlotItem, DayOfWeek } from '../types/calendar';

const DAY_MAP: Record<DayOfWeek, string> = {
  monday: 'MO',
  tuesday: 'TU',
  wednesday: 'WE',
  thursday: 'TH',
  friday: 'FR',
  saturday: 'SA',
  sunday: 'SU',
};

// Map day of week to a reference Monday date in semester
const DAY_DATE_OFFSET: Record<DayOfWeek, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

export function exportScheduleToIcs(slots: SlotItem[]) {
  // Let's create an ICS string with weekly RRULE
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GTCAT//IUHF Calendar GT3RS//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:İÜHF Erdal Çetin Ders Programı',
    'X-WR-TIMEZONE:Europe/Istanbul',
  ];

  // Base reference date: Monday, Sep 14, 2026
  const baseYear = 2026;
  const baseMonth = 8; // 0-indexed September = 8
  const baseDay = 14;

  slots.forEach((slot) => {
    if (slot.category === 'lunch') return;

    const offset = DAY_DATE_OFFSET[slot.day];
    const eventDate = new Date(Date.UTC(baseYear, baseMonth, baseDay + offset));

    const [startH, startM] = slot.startTime.split(':').map(Number);
    const [endH, endM] = slot.endTime.split(':').map(Number);

    const formatTime = (d: Date, h: number, m: number) => {
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      const hours = String(h).padStart(2, '0');
      const mins = String(m).padStart(2, '0');
      return `${year}${month}${day}T${hours}${mins}00`;
    };

    const dtStart = formatTime(eventDate, startH, startM);
    const dtEnd = formatTime(eventDate, endH, endM);
    const byDay = DAY_MAP[slot.day];

    const description = `${slot.subtitle || ''}\\nAmfi/Konum: ${slot.room || 'Belirtilmedi'}\\n\\nNotlar: ${slot.notes.replace(/\n/g, '\\n')}`;

    ics.push('BEGIN:VEVENT');
    ics.push(`UID:gtcat-${slot.id}@psikobiyotek.com`);
    ics.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
    ics.push(`DTSTART;TZID=Europe/Istanbul:${dtStart}`);
    ics.push(`DTEND;TZID=Europe/Istanbul:${dtEnd}`);
    ics.push(`RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=20270131T235959Z`);
    ics.push(`SUMMARY:${slot.title}`);
    ics.push(`LOCATION:${slot.room || 'İstanbul Üniversitesi Hukuk Fakültesi'}`);
    ics.push(`DESCRIPTION:${description}`);
    ics.push('STATUS:CONFIRMED');
    ics.push('END:VEVENT');
  });

  ics.push('END:VCALENDAR');

  const blob = new Blob([ics.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'iuhf-erdal-cetin-takvim.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
