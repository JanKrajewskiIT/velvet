import * as React from 'react';
/** Infinite horizontal scroller (logo walls, testimonials). Content is duplicated once; the copy is aria-hidden. Pauses on hover; static under reduced motion. */
export interface MarqueeProps { children: React.ReactNode; /** px per second. @default 40 */ speed?: number; direction?: 'left' | 'right'; /** @default 48 */ gap?: number; pauseOnHover?: boolean; /** Edge fade mask. @default true */ fade?: boolean; label?: string; className?: string }
export declare function Marquee(props: MarqueeProps): JSX.Element;
