import * as React from 'react';
/** Tiny inline trend for stat cards and table cells. Scrub with the mouse or focus + ←→; the readout floats top-right. Last point is marked. */
export interface SparklineProps { data: number[]; /** px. @default 40 */ height?: number; color?: string; area?: boolean; format?: (v: number) => string; /** Per-point labels for the readout (dates) */ labels?: string[]; label?: string; className?: string }
export declare function Sparkline(props: SparklineProps): JSX.Element;
