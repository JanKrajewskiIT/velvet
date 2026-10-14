import { addDays, startOfDay } from './date';

export const calendarDays = (from: Date, to: Date, limit = 367): Date[] => {
  if (!Number.isFinite(+from) || !Number.isFinite(+to) || from > to) return [];
  const result: Date[] = [];
  for (let day = startOfDay(from); day <= startOfDay(to) && result.length < limit; day = addDays(day, 1))
    result.push(day);
  return result;
};

export const clipDayInterval = (
  start: Date,
  end: Date,
  day: Date,
  startHour = 0,
  endHour = 24,
): { start: Date; end: Date } | undefined => {
  if (![+start, +end, +day].every(Number.isFinite) || end <= start) return undefined;
  const from = new Date(day.getFullYear(), day.getMonth(), day.getDate(), startHour);
  const to = new Date(day.getFullYear(), day.getMonth(), day.getDate(), endHour);
  const clippedStart = new Date(Math.max(+start, +from));
  const clippedEnd = new Date(Math.min(+end, +to));
  return clippedStart < clippedEnd ? { start: clippedStart, end: clippedEnd } : undefined;
};
