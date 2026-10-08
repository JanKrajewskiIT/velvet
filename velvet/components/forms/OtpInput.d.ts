import * as React from 'react';
/** One-time-code boxes: auto-advance, Backspace steps back, ←→ move, paste fills from the focused box. Uses autocomplete="one-time-code" so SMS codes autofill on mobile. */
export interface OtpInputProps {
  /** @default 6 */
  length?: number;
  label?: string;
  hint?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires once every box is filled */
  onComplete?: (code: string) => void;
  /** Digits only. false = A–Z/0–9, upper-cased. @default true */
  numeric?: boolean;
  /** Index where a visual gap is inserted. Default 3 for 6 boxes, 4 for 8, none otherwise. 0 = no gap. */
  groupAt?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
  className?: string;
}
export declare function OtpInput(props: OtpInputProps): JSX.Element;
