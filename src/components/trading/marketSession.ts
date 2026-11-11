import { pad } from '../../utils/date';
import type { MarketHours, MarketSessionState } from './marketSessionTypes';

export const SESSION_MINUTES_PER_HOUR = 60;
const DEFAULT_OPEN = '09:00';
const DEFAULT_CLOSE = '17:00';
const WEEKDAYS: readonly number[] = Object.freeze([0, 1, 2, 3, 4, 5, 6]);
const DEFAULT_DAYS = Object.freeze(WEEKDAYS.slice(1, 6));
const SESSION_TIME = /^(?:[01]?\d|2[0-3]):[0-5]\d$/u;
const SESSION_DATE = /^\d{4}-\d{2}-\d{2}$/u;

const minutesOf = (value: string): number => {
  if (!SESSION_TIME.test(value))
    throw new RangeError('Market session times must be local HH:MM values from 00:00 to 23:59.');
  const [hours, minutes] = value.split(':');
  return Number(hours) * SESSION_MINUTES_PER_HOUR + Number(minutes);
};

const clockTime = (minutes: number): string =>
  `${pad(Math.floor(minutes / SESSION_MINUTES_PER_HOUR))}:${pad(minutes % SESSION_MINUTES_PER_HOUR)}`;

const calendarDate = (year: number, month: number, day: number): Date => {
  const result = new Date(0);
  result.setUTCFullYear(year, month - 1, day);
  return result;
};

const checkCalendarDate = (value: string): string => {
  if (!SESSION_DATE.test(value)) throw new RangeError('Market calendar dates must use YYYY-MM-DD.');
  const [year, month, day] = value.split('-').map(Number);
  if (year === undefined || month === undefined || day === undefined)
    throw new RangeError('Invalid market calendar date.');
  const date = calendarDate(year, month, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
    throw new RangeError('Invalid market calendar date.');
  }
  return value;
};

const localSessionTime = (date: Date, formatter: Intl.DateTimeFormat) => {
  const parts = formatter.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes): string => {
    const value = parts.find((candidate) => candidate.type === type)?.value;
    if (value === undefined) throw new RangeError('Missing market time-zone date part.');
    return value;
  };
  const year = part('year').padStart(4, '0');
  const month = part('month');
  const day = part('day');
  return {
    date: `${year}-${month}-${day}`,
    weekday: calendarDate(Number(year), Number(month), Number(day)).getUTCDay(),
    minutes: Number(part('hour')) * SESSION_MINUTES_PER_HOUR + Number(part('minute')),
  };
};

/** Keeps validated calendar data and its formatter scoped to one market definition. */
export const createMarketSessionReader = (market: MarketHours): ((date: Date) => MarketSessionState) => {
  if (market.alwaysOpen) return () => ({ state: 'open', alwaysOpen: true });
  const open = minutesOf(market.open || DEFAULT_OPEN);
  const closeOf = (value: string): number => {
    const close = minutesOf(value);
    if (close < open) throw new RangeError('Market sessions must open and close on the same local day.');
    return close;
  };
  const close = closeOf(market.close || DEFAULT_CLOSE);
  const days = new Set(market.days ?? DEFAULT_DAYS);
  if ([...days].some((day) => !WEEKDAYS.includes(day)))
    throw new RangeError('Market weekdays must be integers from 0 to 6.');
  const holidays = new Set((market.holidays ?? []).map(checkCalendarDate));
  const earlyClose = new Map(
    Object.entries(market.earlyClose ?? {}).map(([date, time]) => [checkCalendarDate(date), closeOf(time)] as const),
  );
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: market.timeZone || 'UTC',
    calendar: 'iso8601',
    numberingSystem: 'latn',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  return (date) => {
    if (!Number.isFinite(date.getTime())) throw new RangeError('Market session date must be valid.');
    const local = localSessionTime(date, formatter);
    if (!days.has(local.weekday)) return { state: 'closed', reason: 'weekend' };
    if (holidays.has(local.date)) return { state: 'closed', reason: 'holiday' };
    const early = earlyClose.get(local.date);
    const end = early ?? close;
    if (local.minutes < open) return { state: 'pre', minutesToOpen: open - local.minutes, opensAt: clockTime(open) };
    if (local.minutes < end) {
      return {
        state: 'open',
        closesAt: clockTime(end),
        minutesToClose: end - local.minutes,
        early: early !== undefined,
      };
    }
    return { state: 'closed', reason: 'after' };
  };
};

export const marketSession = (market: MarketHours, date: Date = new Date()): MarketSessionState =>
  createMarketSessionReader(market)(date);
