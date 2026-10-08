import { pad } from '../../utils/date';

const TIME_INPUT = /^(\d{1,2})(?:[:.h]?(\d{2}))?\s*(a|am|p|pm)?$/u;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const NOON = 12;
const AM = 'AM';
const PM = 'PM';
const DEFAULT_LOCALE = 'en-US';
const EXAMPLE_MINUTES = 9 * MINUTES_PER_HOUR + 30;

let meridiemCache: { locale: string; labels: readonly [string, string] } | undefined;

/** AM and PM as the locale writes them; `AM`/`PM` when the runtime has no day-period name. */
const meridiemLabels = (locale: string): readonly [string, string] => {
  if (meridiemCache?.locale === locale) return meridiemCache.labels;
  const format = new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true });
  const labelOf = (hours: number) =>
    format.formatToParts(new Date(2000, 0, 1, hours)).find((part) => part.type === 'dayPeriod')?.value;
  const labels = [labelOf(0) ?? AM, labelOf(NOON) ?? PM] as const;
  meridiemCache = { locale, labels };
  return labels;
};

/** Free-form time ("930", "9:30", "9.30pm", "9h30") → `"HH:MM"` (24h), or `null` when it is not a time. */
export const parseTime = (input: string): string | null => {
  const match = TIME_INPUT.exec(input.trim().toLowerCase());
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3]?.[0];
  if (meridiem) {
    if (hours < 1 || hours > NOON) return null;
    if (meridiem === 'p' && hours < NOON) hours += NOON;
    if (meridiem === 'a' && hours === NOON) hours = 0;
  }
  if (hours >= HOURS_PER_DAY || minutes >= MINUTES_PER_HOUR) return null;
  return `${pad(hours)}:${pad(minutes)}`;
};

/** `"HH:MM"` → minutes since midnight (`0` for a malformed value). */
export const minutesOfTime = (time: string | null | undefined): number => {
  const [hours = 0, minutes = 0] = (time ?? '00:00').split(':').map(Number);
  return (hours || 0) * MINUTES_PER_HOUR + (minutes || 0);
};

/** Meridiem label of an hour (0–23). */
export const meridiemOf = (hours: number, locale = DEFAULT_LOCALE): string =>
  meridiemLabels(locale)[hours < NOON ? 0 : 1];

/** Minutes since midnight → `"HH:MM"` (24h) or `"9:30 AM"`. */
export const formatMinutes = (minutes: number, hour12: boolean, locale = DEFAULT_LOCALE): string => {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const rest = minutes % MINUTES_PER_HOUR;
  if (!hour12) return `${pad(hours)}:${pad(rest)}`;
  return `${((hours + NOON - 1) % NOON) + 1}:${pad(rest)} ${meridiemOf(hours, locale)}`;
};

/** `"HH:MM"` → display text; empty for no value. */
export const formatTime = (time: string | null | undefined, hour12: boolean, locale = DEFAULT_LOCALE): string =>
  time ? formatMinutes(minutesOfTime(time), hour12, locale) : '';

/** `"HH:MM"` for hours/minutes that may overflow either way; wraps around midnight. */
export const timeOf = (hours: number, minutes: number): string =>
  `${pad((hours + HOURS_PER_DAY) % HOURS_PER_DAY)}:${pad((minutes + MINUTES_PER_HOUR) % MINUTES_PER_HOUR)}`;

/** A sample time (9:30) in the display format, shown as a placeholder and in the invalid-time message. */
export const exampleTime = (hour12: boolean, locale = DEFAULT_LOCALE): string =>
  formatMinutes(EXAMPLE_MINUTES, hour12, locale);
