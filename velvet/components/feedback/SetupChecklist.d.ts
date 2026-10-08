import * as React from 'react';
export interface ChecklistStep {
  id?: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Velvet icon shown until the step is done (else the step number) */
  icon?: string;
  done?: boolean;
  /** Renders the step as a link */
  href?: string;
  /** Renders the step as a button (when no href) */
  onClick?: () => void;
}
/**
 * "Get started" card for first-run setup — profile, import, first record. Progress bar + steps that link to where each
 * task is done; done steps show a check, the first open step is highlighted. Hides itself once every step is done.
 * Not a Tour (guided overlay) or Stepper (linear form flow) — steps here are independent and done in any order.
 */
export interface SetupChecklistProps {
  /** @default 'Get started' */
  title?: React.ReactNode;
  description?: React.ReactNode;
  steps: ChecklistStep[];
  /** list = stacked rows (side column, popover) · grid = tiles in a row (dashboard hero). @default 'list' */
  layout?: 'list' | 'grid';
  /** @default true */
  hideWhenComplete?: boolean;
  /** Shows a close button */
  onDismiss?: () => void;
  /** @default 'Dismiss' */
  dismissLabel?: string;
  /** @default (v, m) => v + ' of ' + m + ' done' */
  progressFormat?: (done: number, total: number) => string;
  className?: string;
}
export declare function SetupChecklist(props: SetupChecklistProps): JSX.Element | null;
