import * as React from 'react';
/** Stepper number field: − / + buttons, clamped min/max, ↑↓ step (Shift ×10), Home/End jump to bounds, typed value committed on blur/Enter. */
export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'min' | 'max' | 'step'> {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  value?: number;
  /** @default 0 */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Decimal places follow the step (0.5 → 1 dp). @default 1 */
  step?: number;
  /** Unit after the value — "seats", "kg" */
  suffix?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
export declare function NumberInput(props: NumberInputProps): JSX.Element;
