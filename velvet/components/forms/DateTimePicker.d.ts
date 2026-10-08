import * as React from 'react';
/**
 * One field for a moment in time — meetings, deadlines, scheduled sends. Popover pairs the Calendar with a time column
 * (step list, auto-scrolled to the current pick); changes are a draft until Apply; "Now" jumps to the next step.
 * Times outside min/max are disabled. Use DatePicker when time doesn't matter, TimePicker for a time on its own.
 */
export interface DateTimePickerProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  required?: boolean;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: Date | null) => void;
  placeholder?: string;
  /** Earliest selectable moment (date and time) */
  min?: Date;
  max?: Date;
  /** Minutes between time slots. @default 30 */
  step?: number;
  /** @default false */
  hour12?: boolean;
  locale?: string;
  weekStartsOn?: number;
  /** @default true */
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  defaultOpen?: boolean;
  align?: 'start' | 'end';
  id?: string;
}
export declare function DateTimePicker(props: DateTimePickerProps): JSX.Element;
