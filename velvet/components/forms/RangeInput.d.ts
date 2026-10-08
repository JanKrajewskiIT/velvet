import * as React from 'react';
import type { SelectOption } from './Select';
export interface RangeValue { min?: number | null; max?: number | null }
/**
 * From–to numeric field — salary, budget, price filter, size range. Two bounds share one label and error lane;
 * values are grouped per locale when not focused. Optional inline unit (currency) and period selects turn it into a
 * money range ("10 000 – 15 000 PLN / month"). An inverted range flags itself. Either bound may be left empty (open range).
 */
export interface RangeInputProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
  value?: RangeValue;
  defaultValue?: RangeValue;
  onValueChange?: (value: RangeValue) => void;
  /** Clamp for both bounds. @default 0 */
  min?: number;
  max?: number;
  /** Text affix inside each bound, e.g. "€" or "m²" — use instead of unitOptions for a fixed unit */
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /** Placeholders / accessible names. @default 'From' / 'To' */
  fromLabel?: string;
  toLabel?: string;
  /** @default 'The lower bound is greater than the upper bound' */
  invertedError?: string;
  /** Inline unit select (e.g. currencies) */
  unitOptions?: Array<string | SelectOption>;
  unit?: string;
  defaultUnit?: string;
  onUnitChange?: (unit: string) => void;
  /** @default 'Currency' */
  unitLabel?: string;
  /** Inline period select (e.g. Hourly / Monthly / Yearly) */
  periodOptions?: Array<string | SelectOption>;
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (period: string) => void;
  /** @default 'Period' */
  periodLabel?: string;
  /** Number grouping locale, e.g. 'pl' */
  locale?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function RangeInput(props: RangeInputProps): JSX.Element;
