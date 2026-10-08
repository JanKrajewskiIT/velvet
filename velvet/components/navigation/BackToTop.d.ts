import * as React from 'react';
/** Floating "scroll to top" that appears after the threshold, with a ring showing scroll progress. Respects reduced motion. */
export interface BackToTopProps {
  /** Scroll container (selector or ref). Defaults to the window. */
  target?: string | React.RefObject<HTMLElement>;
  /** px scrolled before it appears. @default 400 */
  threshold?: number;
  label?: string;
  /** fixed = viewport corner · static = place it yourself. @default 'fixed' */
  position?: 'fixed' | 'static';
  className?: string;
}
export declare function BackToTop(props: BackToTopProps): JSX.Element;
