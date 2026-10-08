import * as React from 'react';
import type { Tone } from './Surface';
/** Atom. A colour chip — presets, label colours, picker trigger. Clickable when onClick is set (selected ring + check). */
export interface SwatchProps extends React.HTMLAttributes<HTMLElement> {
  /** Any CSS colour; wins over tone */
  color?: string;
  tone?: Tone;
  /** sm 20 · md 28 · lg 40 · fill (grid cell). @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'fill';
  round?: boolean;
  selected?: boolean;
  label?: string;
}
export declare function Swatch(props: SwatchProps): JSX.Element;
