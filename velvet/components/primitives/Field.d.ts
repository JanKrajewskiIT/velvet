import * as React from 'react';
/** Ids and state the Field hands to its control — spread onto the input. */
export interface FieldControlProps { id: string; invalid: boolean; describedBy?: string; required?: boolean; }
/**
 * Atom. Label + control + hint/error stack with ids and aria wired. Every form component (Input, Select, DatePicker,
 * NumberInput, PhoneInput…) composes it so labels, hints, error lanes and counters look and behave the same.
 * Pass a render function to receive { id, invalid, describedBy }.
 */
export interface FieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Replaces the hint, turns the control invalid */
  error?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
  id?: string;
  /** Current length for the counter; shown when maxCount is set */
  count?: number;
  maxCount?: number;
  /** Keep the hint lane height so validation messages don't shift layout */
  reserveHint?: boolean;
  className?: string;
  children?: React.ReactNode | ((ctl: FieldControlProps) => React.ReactNode);
}
export declare function Field(props: FieldProps): JSX.Element;
/** Renders <label> when htmlFor is set, otherwise <span> (labels for radiogroups, sliders, OTP groups — pair with aria-labelledby). */
export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { as?: 'label' | 'span' | 'div'; optional?: boolean; required?: boolean; }
export declare function FieldLabel(props: FieldLabelProps): JSX.Element;
export interface FieldHintProps extends React.HTMLAttributes<HTMLSpanElement> { error?: boolean; lane?: boolean; }
export declare function FieldHint(props: FieldHintProps): JSX.Element;
