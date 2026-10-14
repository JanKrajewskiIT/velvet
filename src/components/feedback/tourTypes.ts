import type { JSX } from 'solid-js';

type TourPlacement = 'bottom' | 'top' | 'left' | 'right';
export type CardSide = TourPlacement | 'center';

export interface TourStep {
  /** CSS selector, element, or accessor of the element to spotlight. Omit for a centred intro step. */
  target?: string | HTMLElement | (() => HTMLElement | undefined);
  title: JSX.Element;
  body?: JSX.Element;
  /** Preferred side; flips when there's no room. @default 'bottom' */
  placement?: TourPlacement;
}

export interface TourProps {
  steps: TourStep[];
  open: boolean;
  /** Skip, Escape. */
  onClose?: () => void;
  /** Last step "Done" — defaults to onClose. */
  onFinish?: () => void;
  /** @default 0 */
  defaultStep?: number;
  /** Spotlight padding px. @default 6 */
  padding?: number;
  /** @default localized "Skip" */
  skipLabel?: string;
  /** @default localized "Back" */
  backLabel?: string;
  /** @default localized "Next" */
  nextLabel?: string;
  /** @default localized "Done" */
  doneLabel?: string;
  /** Shown when the step's target is not in the page. @default localized "This part of the page isn’t visible right now." */
  missingLabel?: string;
}

export type ResolvedTourProps = TourProps & Required<Pick<TourProps, 'defaultStep' | 'padding'>>;
