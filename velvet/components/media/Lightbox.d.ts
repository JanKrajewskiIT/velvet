import * as React from 'react';
export interface LightboxImage { src: string; thumb?: string; alt?: string; caption?: string; /** ImageGrid: span N×N cells */ span?: number; /** ImageGrid masonry: tile aspect-ratio, e.g. '3 / 4' */ ratio?: string; /** ImageGrid: floating glass label, e.g. 'Cover' */ badge?: string }
/** Full-screen image viewer: ←→ / Esc, click to zoom, thumbnail strip, focus trapped and restored. Controlled by index (−1 / null = closed). */
export interface LightboxProps { images: LightboxImage[]; index: number | null; onIndexChange?: (i: number) => void; onClose?: () => void }
export declare function Lightbox(props: LightboxProps): JSX.Element | null;
/** Image grid that opens the Lightbox. uniform = equal tiles (+ optional span), feature = 1 hero + 2 thumbs, masonry = columns of natural heights. max collapses the overflow into a "+N" tile. */
export interface ImageGridProps { images: LightboxImage[]; /** @default 'uniform' */ layout?: 'uniform' | 'feature' | 'masonry'; /** uniform / masonry column count. @default 3 */ columns?: number; /** px. @default 8 */ gap?: number; /** uniform tile ratio. @default '4 / 3' */ ratio?: string; /** feature container ratio. @default '16 / 9' */ featureRatio?: string; /** Show at most N tiles; the last becomes "+rest". feature always shows 3. */ max?: number; /** @default true */ lightbox?: boolean; className?: string }
export declare function ImageGrid(props: ImageGridProps): JSX.Element;
