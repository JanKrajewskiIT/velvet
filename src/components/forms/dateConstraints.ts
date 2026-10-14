import { startOfDay } from '../../utils/date';
import type { DateRange } from './calendarTypes';

export interface DateConstraints {
  min?: Date;
  max?: Date;
  isDisabled?: (date: Date) => boolean;
}

export const isDateAllowed = (date: Date, constraints: DateConstraints): boolean => {
  const day = startOfDay(date);
  return (
    Number.isFinite(day.getTime()) &&
    (!constraints.min || day >= startOfDay(constraints.min)) &&
    (!constraints.max || day <= startOfDay(constraints.max)) &&
    !constraints.isDisabled?.(day)
  );
};

export const isDateRangeAllowed = (range: DateRange, constraints: DateConstraints): boolean =>
  !!range.start &&
  !!range.end &&
  startOfDay(range.start) <= startOfDay(range.end) &&
  isDateAllowed(range.start, constraints) &&
  isDateAllowed(range.end, constraints);
