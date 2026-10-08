import * as React from 'react';
import { DateRange } from './Calendar';
/** Date field → calendar popover. Today / Clear in the footer, Esc closes and refocuses. Compact: the field is a button, no free typing. */
export interface DatePickerProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (date: Date | null) => void;
  /** @default 'Select date' */
  placeholder?: string;
  min?: Date;
  max?: Date;
  isDisabled?: (date: Date) => boolean;
  locale?: string;
  weekStartsOn?: number;
  /** Custom field text */
  format?: (date: Date) => string;
  /** @default true */
  clearable?: boolean;
  /** Popover alignment */
  align?: 'start' | 'end';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Start with the popover open (docs, onboarding) */
  defaultOpen?: boolean;
  id?: string;
}
export declare function DatePicker(props: DatePickerProps): JSX.Element;
export interface RangePreset { label: string; range: () => DateRange }
/** Range field → popover with presets column + two months (one under 720px). Changes are a draft until Apply; footer shows the span in days. */
export interface DateRangePickerProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  /** Defaults: Today, Last 7 / 30 days, This / Last month, This year. [] hides the column. */
  presets?: RangePreset[];
  placeholder?: string;
  min?: Date;
  max?: Date;
  isDisabled?: (date: Date) => boolean;
  locale?: string;
  weekStartsOn?: number;
  align?: 'start' | 'end';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  defaultOpen?: boolean;
  id?: string;
}
export declare function DateRangePicker(props: DateRangePickerProps): JSX.Element;
export declare const DEFAULT_RANGE_PRESETS: RangePreset[];
/** Time field: type freely ("930", "9:30", "9.30pm") or pick from a step list. Value is always "HH:MM" 24h. */
export interface TimePickerProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  /** "HH:MM" 24h */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (time: string | null) => void;
  /** List step in minutes. @default 15 */
  step?: number;
  /** @default '00:00' */
  min?: string;
  /** @default '23:59' */
  max?: string;
  /** Display as 9:30 AM. @default false */
  hour12?: boolean;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
}
export declare function TimePicker(props: TimePickerProps): JSX.Element;
export declare function parseTime(input: string): string | null;
