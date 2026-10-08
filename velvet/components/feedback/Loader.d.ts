import * as React from 'react';
export type LoaderVariant = 'bike' | 'bouncing-dots' | 'concentric-pulse' | 'corner-pulse' | 'dual-plane' | 'ellipsis' | 'equalizer' | 'honeycomb' | 'jelly-triangle' | 'orbit-squares' | 'pulse-ring' | 'ripple-dots' | 'shape-trail' | 'shuffle-grid';
/**
 * Decorative brand loaders, ported 1:1 from the legacy VelvetUi (Solid) package — same geometry, timing and keyframes,
 * colour mapped to --action-primary. Use for page / hero / empty-wait moments; for inline/button waits use Spinner.
 * All honour prefers-reduced-motion (animation stops, shape stays visible).
 */
export interface LoaderProps {
  /** @default 'ripple-dots' */
  variant?: LoaderVariant;
  /** shape-trail only. @default 'circle' */
  shape?: 'circle' | 'triangle' | 'square';
  /** Uniform scale multiplier (CSS zoom) — native sizes are the legacy px sizes. @default 1 */
  scale?: number;
  /** 'current' = inherit text colour. @default 'brand' */
  tone?: 'brand' | 'current';
  /** Accessible label (role=status). @default 'Loading' */
  label?: string;
  /** Hide from assistive tech (when a parent already announces loading). */
  decorative?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Loader(props: LoaderProps): JSX.Element;
export declare const LOADER_VARIANTS: LoaderVariant[];
/** Full-screen (fixed, z-modal) or contained (absolute) page veil with a centred Loader. */
export interface PageLoaderProps { /** @default true */ fullScreen?: boolean; /** @default 'ripple-dots' */ variant?: LoaderVariant; label?: string; className?: string }
export declare function PageLoader(props: PageLoaderProps): JSX.Element;
