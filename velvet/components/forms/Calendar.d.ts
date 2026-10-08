import * as React from 'react';
export interface DateRange { start: Date | null; end: Date | null }
/** Month grid. single or range (hover previews the range). Keyboard: arrows = day/week, PageUp/Down = month (Shift = year), Home/End = week edges, Enter selects. Weeks start Monday by default. */
export interface CalendarProps {
  /** @default 'single' */
  mode?: 'single' | 'range';
  value?: Date | null | DateRange;
  defaultValue?: Date | null | DateRange;
  onChange?: (value: any) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: any) => void;
  /** Side-by-side months (range pickers use 2). @default 1 */
  months?: number;
  /** Controlled visible month */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  min?: Date;
  max?: Date;
  isDisabled?: (date: Date) => boolean;
  /** Dot under days with events: array of dates or predicate */
  marks?: Date[] | ((date: Date) => boolean);
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: number;
  /** Intl locale for month/weekday names. @default 'en-US' */
  locale?: string;
  className?: string;
}
export declare function Calendar(props: CalendarProps): JSX.Element;
export declare function fmtDate(d: Date | null, locale?: string, opts?: Intl.DateTimeFormatOptions): string;
export declare function sameDay(a: Date | null, b: Date | null): boolean;
export declare function addDays(d: Date, n: number): Date;
export declare function addMonths(d: Date, n: number): Date;
export declare function startOfDay(d: Date): Date;
