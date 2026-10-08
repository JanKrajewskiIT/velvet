import { addDays, addMonths } from '../../utils/date';

export const WEEK_LENGTH = 7;
const GRID_DAYS = 42;
const MONTHS_PER_YEAR = 12;

export const monthKey = (d: Date): number => d.getFullYear() * MONTHS_PER_YEAR + d.getMonth();

export const startOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), 1);

/** Days between the week start and `d`'s weekday. */
export const weekOffset = (d: Date, weekStartsOn: number): number =>
  (d.getDay() - weekStartsOn + WEEK_LENGTH) % WEEK_LENGTH;

/** Six weeks of days that cover the month starting at `first`. */
export const monthGrid = (first: Date, weekStartsOn: number): Date[] => {
  const start = addDays(first, -weekOffset(first, weekStartsOn));
  return Array.from({ length: GRID_DAYS }, (_, i) => addDays(start, i));
};

/** Same day-of-month `n` months away, clamped to the target month's last day. */
const shiftMonths = (d: Date, n: number): Date => {
  const target = addMonths(d, n);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay));
};

const DAY_STEPS: Readonly<Record<string, number>> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -WEEK_LENGTH,
  ArrowDown: WEEK_LENGTH,
};

/** Target of a grid navigation key (arrows, PageUp/PageDown with Shift = year, Home/End = week edges), or `null`. */
export const navigateDay = (from: Date, key: string, shiftKey: boolean, weekStartsOn: number): Date | null => {
  const step = DAY_STEPS[key];
  if (step !== undefined) return addDays(from, step);
  const monthsPerPage = shiftKey ? MONTHS_PER_YEAR : 1;
  if (key === 'PageUp') return shiftMonths(from, -monthsPerPage);
  if (key === 'PageDown') return shiftMonths(from, monthsPerPage);
  if (key === 'Home') return addDays(from, -weekOffset(from, weekStartsOn));
  if (key === 'End') return addDays(from, WEEK_LENGTH - 1 - weekOffset(from, weekStartsOn));
  return null;
};
