export const DAY_MS = 864e5;

export const pad = (n: number): string => String(n).padStart(2, '0');

export const sameDay = (a: Date | null | undefined, b: Date | null | undefined): boolean =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const addMonths = (d: Date, n: number): Date => new Date(d.getFullYear(), d.getMonth() + n, 1);

export const minutesOfDay = (d: Date): number => d.getHours() * 60 + d.getMinutes();

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/u;

/** `"2026-10-05"` → local midnight (not UTC); a `Date` passes through; anything else → `new Date(v)`. */
export const toDate = (v: Date | string | number): Date => {
  if (v instanceof Date) return v;
  if (typeof v === 'string' && DATE_ONLY.test(v)) {
    const [y = 0, m = 1, d = 1] = v.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(v);
};

export const ymd = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Short weekday names starting at `weekStartsOn` (0 = Sunday); `length` trims each name. */
export const weekdayNames = (locale = 'en-US', weekStartsOn = 1, length?: number): string[] => {
  const format = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  return Array.from({ length: 7 }, (_, i) => {
    const name = format.format(new Date(2024, 0, 7 + ((i + weekStartsOn) % 7)));
    return length ? name.slice(0, length) : name;
  });
};

const DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };

export const fmtDate = (d: Date | null | undefined, locale = 'en-US', options = DEFAULT_DATE_FORMAT): string =>
  d ? new Intl.DateTimeFormat(locale, options).format(d) : '';
