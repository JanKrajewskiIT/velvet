import * as React from 'react';
import type { Tone } from './Surface';
/** Atom. Round step / event badge — a number, icon, avatar or dot in a circle. Stepper (step state) and Timeline (event tone / status) render it; use it for any numbered or iconed rail. */
export interface MarkerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** sm 24 · md 28 · lg 32. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** soft = tinted (events) · outline = todo / upcoming · solid = done / current / error. @default 'soft' */
  appearance?: 'soft' | 'outline' | 'solid';
  /** Colour. Omit for neutral. */
  tone?: Tone;
  /** Current-step halo */
  ring?: boolean;
  /** Surface-coloured separation ring — use when the marker sits over a rail line */
  gap?: boolean;
  /** Render a centred dot instead of children */
  dot?: boolean;
  children?: React.ReactNode;
}
export declare function Marker(props: MarkerProps): JSX.Element;
