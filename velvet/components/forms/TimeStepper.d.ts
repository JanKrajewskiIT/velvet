import * as React from 'react';
/** Inline hour/minute stepper with AM/PM toggle — for popovers, schedulers and touch where a typed TimePicker is awkward. Values wrap at their bounds. ↑/↓ step, PgUp/PgDn ×5. Value is "HH:MM" 24h. */
export interface TimeStepperProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: string) => void;
  /** Show 12h + AM/PM toggle. Default true. */
  hour12?: boolean;
  /** Minutes per step. Default 5. */
  minuteStep?: number;
  /** Accessible group label */
  label?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}
export declare function TimeStepper(props: TimeStepperProps): JSX.Element;
