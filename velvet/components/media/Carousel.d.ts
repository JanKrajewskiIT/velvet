import * as React from 'react';
/** Horizontal slider: arrows, dots, swipe/drag, ←→ keys. Off-screen slides are inert. Autoplay pauses on hover/focus and is disabled under reduced motion. */
export interface CarouselProps {
  slides: React.ReactNode[];
  /** Slides visible at once. @default 1 */
  perView?: number;
  /** px. @default 16 */
  gap?: number;
  loop?: boolean;
  /** ms between slides; 0 = off */
  autoplay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  label?: string;
  className?: string;
}
export declare function Carousel(props: CarouselProps): JSX.Element;
