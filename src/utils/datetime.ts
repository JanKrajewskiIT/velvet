export interface DayCell {
  day: number;
  month: number;
  year: number;
  outside: boolean;
}

export interface DateTimeParts {
  date: string;
  time: string;
}

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const getNow = (): Date => new Date();

export const pad = (value: number): string => String(value).padStart(2, '0');

export const buildTimeOptions = (step: number): string[] => {
  const options: string[] = [];
  const safeStep = Number.isFinite(step) && step > 0 ? Math.max(1, Math.floor(step)) : 30;

  for (let minutes = 0; minutes < 1440; minutes += safeStep) {
    options.push(`${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`);
  }

  return options;
};

export const toIso = (year: number, month: number, day: number): string => `${year}-${pad(month + 1)}-${pad(day)}`;

export const getTodayIso = (): string => {
  const now = getNow();
  return toIso(now.getFullYear(), now.getMonth(), now.getDate());
};

export const isoToDate = (iso: string): Date => {
  const [yearRaw, monthRaw, dayRaw] = iso.split('-');
  return new Date(Number(yearRaw), Number(monthRaw) - 1, Number(dayRaw));
};

export const addDays = (iso: string, delta: number): string => {
  const date = isoToDate(iso);
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
  return toIso(next.getFullYear(), next.getMonth(), next.getDate());
};

export const getDateDiffInDays = (fromIso: string, toIsoDate: string): number => {
  const from = isoToDate(fromIso);
  const to = isoToDate(toIsoDate);
  return Math.round((to.getTime() - from.getTime()) / MS_IN_DAY);
};

export const buildDaysGrid = (year: number, month: number): DayCell[] => {
  const first = new Date(year, month, 1).getDay();
  const offset = (first + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: DayCell[] = [];

  for (let index = offset - 1; index >= 0; index -= 1) {
    const day = daysInPrev - index;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({ day, month: prevMonth, year: prevYear, outside: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, month, year, outside: false });
  }

  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day += 1) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    cells.push({ day, month: nextMonth, year: nextYear, outside: true });
  }

  return cells;
};

export const parseDate = (iso: string): { year: number; month: number } => {
  const [yearRaw, monthRaw] = iso.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw) - 1;
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 0 || month > 11) {
    const now = getNow();
    return { year: now.getFullYear(), month: now.getMonth() };
  }

  return { year, month };
};

export const parseDateParts = (isoDate?: string): { year: number; month: number; day: number } => {
  if (!isoDate) {
    const now = getNow();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  }

  const [yearRaw, monthRaw, dayRaw] = isoDate.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw) - 1;
  const day = Number(dayRaw);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    const now = getNow();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  }

  return { year, month, day };
};

export const splitDateTimeValue = (value?: string): DateTimeParts => {
  const safeValue = value ?? '';
  const [date = '', time = ''] = safeValue.split('T');
  return { date, time };
};

export const joinDateTimeValue = (date: string, time?: string): string => {
  if (!date) return '';
  return `${date}T${time || '00:00'}`;
};
