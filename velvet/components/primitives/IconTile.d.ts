import * as React from 'react';
import type { Tone } from './Surface';
/**
 * Atom. A glyph in a tinted box — the leading visual of notification rows, data-source rows, feature cards, confirm dialogs, file rows.
 * No tone = neutral (subtle ground, secondary ink). Tones read --tone-bg / --tone-fg.
 */
export interface IconTileProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: string | React.ReactNode;
  tone?: Tone;
  /** sm 32 · md 36 · lg 40 · xl 48 · 2xl 56 · 3xl 72 (empty / status heroes). @default 'md' */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** Soft tinted halo around the tile — empty states, status heroes. true = md */
  halo?: boolean | 'md' | 'lg';
  /** @default 'square' */
  shape?: 'square' | 'circle';
  /** Hairline border — for brand / source logos on a neutral ground */
  outline?: boolean;
  /** Custom ink (brand colour of a source) — wins over tone fg */
  color?: string;
}
export declare function IconTile(props: IconTileProps): JSX.Element;
