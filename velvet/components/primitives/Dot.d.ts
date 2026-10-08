import * as React from 'react';
import type { Tone } from './Surface';
/**
 * Atom. Small round status / presence / category marker. Used by Badge, Avatar presence, legends, error hints.
 * Status colour never alone — pair with a label.
 */
export interface DotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'neutral' */
  tone?: Tone;
  /** sm 5px · md 6px · lg 8px. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Soft ping for live states */
  pulse?: boolean;
  /** 2px surface-coloured ring — for dots overlapping avatars */
  ring?: boolean;
  /** Accessible name when the dot stands alone; otherwise hidden from AT */
  label?: string;
}
export declare function Dot(props: DotProps): JSX.Element;
