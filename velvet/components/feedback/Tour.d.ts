import * as React from 'react';
export interface TourStep {
  /** CSS selector or ref of the element to spotlight. Omit for a centred intro step. */
  target?: string | React.RefObject<HTMLElement>;
  title: React.ReactNode;
  body?: React.ReactNode;
  /** Preferred side; flips when there's no room. @default 'bottom' */
  placement?: 'bottom' | 'top' | 'left' | 'right';
}
/** Guided walkthrough: dims the page, spotlights one element, floats a step card beside it. ← → navigate, Esc skips. Keep it to 3–5 steps; the page behind is inert while open. */
export interface TourProps { steps: TourStep[]; open: boolean; onClose?: () => void; /** Last step "Done" — defaults to onClose */ onFinish?: () => void; defaultStep?: number; /** Spotlight padding px. @default 6 */ padding?: number }
export declare function Tour(props: TourProps): JSX.Element | null;
