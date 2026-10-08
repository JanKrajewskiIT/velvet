import * as React from 'react';
export interface WizardStep {
  label: React.ReactNode;
  description?: React.ReactNode;
  content: React.ReactNode;
  /** Return an error string (sync or async) to block Next */
  validate?: () => string | null | undefined | Promise<string | null | undefined>;
  /** Hide the step heading above content */
  title?: false;
}
/** Multi-step flow that owns its index: Stepper on top, one step's content, Back / Next → Finish. Validation errors mark the step red and block. Focus moves to the new panel. */
export interface WizardProps {
  steps: WizardStep[];
  /** Awaited — Finish shows a spinner meanwhile */
  onFinish?: () => void | Promise<void>;
  /** Shows Cancel instead of Back on step 1 */
  onCancel?: () => void;
  /** @default 'Finish' */
  finishLabel?: string;
  defaultStep?: number;
  className?: string;
}
export declare function Wizard(props: WizardProps): JSX.Element;
