import * as React from 'react';
/**
 * Repeating diagonal text over its children — "Confidential", "Draft", the viewer's email on shared documents and previews.
 * Painted with --fg-primary through a CSS mask, so it follows the theme. Never intercepts clicks or selection. Deterrent only — not access control.
 */
export interface WatermarkProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default 'Confidential' */
  text?: string;
  /** Multi-line stamp, e.g. ['anna@velvet.io', '2026-10-06'] — overrides text */
  lines?: string[];
  /** Degrees. @default -24 */
  rotate?: number;
  /** [x, y] px between stamps. @default [96, 72] */
  gap?: [number, number];
  /** @default 14 */
  fontSize?: number;
  /** @default 600 */
  fontWeight?: number;
  /** 0.05–0.12 keeps content readable. @default 0.08 */
  opacity?: number;
  children?: React.ReactNode;
}
export declare function Watermark(props: WatermarkProps): JSX.Element;
