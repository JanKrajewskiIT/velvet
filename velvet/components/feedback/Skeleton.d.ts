import * as React from 'react';
/** Shimmering placeholder in the shape of content that's loading. Wrap the loading region in aria-busy="true". Shimmer stops under reduced motion. */
export interface SkeletonProps { width?: number | string; /** @default 12 */ height?: number | string; circle?: boolean; radius?: number | string; className?: string; style?: React.CSSProperties }
export declare function Skeleton(props: SkeletonProps): JSX.Element;
/** Paragraph placeholder — full-width lines, shorter last line. */
export interface SkeletonTextProps { /** @default 3 */ lines?: number; /** @default '60%' */ lastWidth?: string; gap?: number; className?: string }
export declare function SkeletonText(props: SkeletonTextProps): JSX.Element;
