export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type CalendarValue = Date | null | DateRange;

interface CalendarBaseProps {
  /** Side-by-side months (range pickers use 2). @default 1 */
  months?: number;
  /** Controlled visible month. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  min?: Date;
  max?: Date;
  isDisabled?: (date: Date) => boolean;
  /** Dot under days with events: array of dates or predicate. */
  marks?: Date[] | ((date: Date) => boolean);
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: number;
  /** Intl locale for month/weekday names. @default the active i18n locale */
  locale?: string;
  class?: string;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  /** @default 'single' */
  mode?: 'single';
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  /** Alias of `onValueChange`. */
  onChange?: (value: Date | null) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range';
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  /** Alias of `onValueChange`. */
  onChange?: (value: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

/** Both modes seen through one value type; the public union keeps each mode's callback precisely typed. */
export interface CalendarModelProps extends CalendarBaseProps {
  mode?: 'single' | 'range';
  value?: CalendarValue;
  defaultValue?: CalendarValue;
  onValueChange?: (value: CalendarValue) => void;
  onChange?: (value: CalendarValue) => void;
}

export type CalendarConfig = CalendarModelProps & Required<Pick<CalendarModelProps, 'months' | 'weekStartsOn'>>;
