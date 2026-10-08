import * as React from 'react';
/**
 * Atom. Disclosure arrow for anything that opens: Select, Accordion, nav groups, menu triggers, Cascader.
 * `open` rotates it (down → up, right → down) with --dur-base. Decorative — the host carries aria-expanded.
 */
export interface ChevronProps extends React.HTMLAttributes<HTMLElement> {
  /** Resting direction. down = dropdowns/accordions · right = nested navigation. @default 'down' */
  direction?: 'down' | 'right' | 'left' | 'up';
  /** Rotated "open" state */
  open?: boolean;
}
export declare function Chevron(props: ChevronProps): JSX.Element;
