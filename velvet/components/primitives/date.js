// Shared date helpers — local-time, no dependencies. Calendar re-exports the public ones.
export const DAY_MS = 864e5;
export const pad = (n) => String(n).padStart(2, '0');
export const sameDay = (a, b) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
export const minutesOfDay = (d) => d.getHours() * 60 + d.getMinutes();
// "2026-10-05" → local midnight (not UTC); Date passes through; anything else → new Date(v)
export const toDate = (v) => (v instanceof Date ? v : /^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? (([y, m, d]) => new Date(y, m - 1, d))(String(v).split('-').map(Number)) : new Date(v));
export const ymd = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
// Short weekday names starting at weekStartsOn (0 = Sun). len trims (2 → 'Mo').
export const weekdayNames = (locale = 'en-US', weekStartsOn = 1, len) => Array.from({ length: 7 }, (_, i) => { const s = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 7 + ((i + weekStartsOn) % 7))); return len ? s.slice(0, len) : s; });
export const fmtDate = (d, locale = 'en-US', opts = { month: 'short', day: 'numeric', year: 'numeric' }) => (d ? new Intl.DateTimeFormat(locale, opts).format(d) : '');
