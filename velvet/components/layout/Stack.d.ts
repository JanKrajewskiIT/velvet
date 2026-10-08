import * as React from 'react';
/** Flex stack with token gaps. gap is a space-scale step (4 → var(--space-4)) or any CSS length. divider adds hairlines between children. */
export interface StackProps extends React.HTMLAttributes<HTMLElement> { as?: any; direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'; /** @default 4 */ gap?: number | string; align?: React.CSSProperties['alignItems']; justify?: React.CSSProperties['justifyContent']; wrap?: boolean; divider?: boolean }
export declare function Stack(props: StackProps): JSX.Element;
/** CSS grid. Fixed columns (collapse to 1 under 640px), or min = auto-fill cards of at least that width. */
export interface GridProps extends React.HTMLAttributes<HTMLElement> { as?: any; /** @default 3 */ columns?: number; /** px or CSS length — switches to auto-fill */ min?: number | string; /** @default 4 */ gap?: number | string }
export declare function Grid(props: GridProps): JSX.Element;
