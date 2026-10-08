import { DAY_MS, toDate } from '../../utils/date';

export interface CalendarEventDetails {
  id?: string;
  title: string;
  /** Date or ISO / local `"YYYY-MM-DD"` / `"YYYY-MM-DDTHH:mm"` — local strings are read in the user's time zone. */
  start: Date | string;
  end?: Date | string;
  /** Used when `end` is omitted. @default 60 (or one day when `allDay`) */
  durationMinutes?: number;
  allDay?: boolean;
  description?: string;
  location?: string;
}

const MINUTE_MS = 60_000;
const DEFAULT_TIMED_MINUTES = 60;
const DEFAULT_ALL_DAY_MINUTES = 1440;

const eventSpan = (event: CalendarEventDetails): [Date, Date] => {
  const start = toDate(event.start);
  const minutes = event.durationMinutes ?? (event.allDay ? DEFAULT_ALL_DAY_MINUTES : DEFAULT_TIMED_MINUTES);
  return [start, event.end ? toDate(event.end) : new Date(start.getTime() + minutes * MINUTE_MS)];
};

/** `20261005T090000Z` — UTC basic format used by Google Calendar and iCalendar. */
const utcStamp = (d: Date): string =>
  d
    .toISOString()
    .replace(/[-:]/gu, '')
    .replace(/\.\d{3}/u, '');

const dateStamp = (d: Date): string =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

/** All-day ranges end exclusively, so a same-day span is widened by one day. */
const allDayEnd = (start: Date, end: Date): Date =>
  dateStamp(end) === dateStamp(start) ? new Date(end.getTime() + DAY_MS) : end;

export const buildGoogleCalendarUrl = (event: CalendarEventDetails): string => {
  const [start, end] = eventSpan(event);
  const dates = event.allDay
    ? `${dateStamp(start)}/${dateStamp(allDayEnd(start, end))}`
    : `${utcStamp(start)}/${utcStamp(end)}`;
  const params = new URLSearchParams({ action: 'TEMPLATE', text: event.title || '', dates });
  if (event.description) params.set('details', event.description);
  if (event.location) params.set('location', event.location);
  return `https://calendar.google.com/calendar/render?${params}`;
};

export const buildOutlookCalendarUrl = (event: CalendarEventDetails): string => {
  const [start, end] = eventSpan(event);
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title || '',
    startdt: start.toISOString(),
    enddt: end.toISOString(),
  });
  if (event.allDay) params.set('allday', 'true');
  if (event.description) params.set('body', event.description);
  if (event.location) params.set('location', event.location);
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
};

const escapeIcsText = (text: string | undefined): string =>
  (text ?? '')
    .replace(/\\/gu, '\\\\')
    .replace(/\n/gu, '\\n')
    .replace(/[,;]/gu, (m) => `\\${m}`);

/** RFC 5545 VCALENDAR text. */
export const buildIcs = (event: CalendarEventDetails, now: Date = new Date()): string => {
  const [start, end] = eventSpan(event);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Velvet UI//Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${event.id ?? `${now.getTime()}@velvet-ui`}`,
    `DTSTAMP:${utcStamp(now)}`,
    event.allDay ? `DTSTART;VALUE=DATE:${dateStamp(start)}` : `DTSTART:${utcStamp(start)}`,
    event.allDay ? `DTEND;VALUE=DATE:${dateStamp(allDayEnd(start, end))}` : `DTEND:${utcStamp(end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.description && `DESCRIPTION:${escapeIcsText(event.description)}`,
    event.location && `LOCATION:${escapeIcsText(event.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
};

export const isValidEvent = (event: CalendarEventDetails | undefined): event is CalendarEventDetails =>
  !!event?.start && !Number.isNaN(toDate(event.start).getTime());
