import * as React from 'react';
export interface StepItem { label: React.ReactNode; description?: React.ReactNode }
/** Progress through ordered steps: done (✓) · current · upcoming · error. Animated: connector fills left→right (top→bottom when vertical), a node pops + draws its check when it completes, the current node scales up. With onStepClick steps become buttons (←→ / ↑↓ move focus). Vertical under 640px for horizontal steppers with 4+ steps. */
export interface StepperProps {
  steps: StepItem[];
  /** 0-based */
  current?: number;
  orientation?: 'horizontal' | 'vertical';
  /** Makes steps clickable */
  onStepClick?: (index: number) => void;
  /** true: only completed steps are clickable · false: any step (free navigation). @default true */
  linear?: boolean;
  /** Index of a step that failed validation */
  errorAt?: number;
  className?: string;
}
export declare function Stepper(props: StepperProps): JSX.Element;
