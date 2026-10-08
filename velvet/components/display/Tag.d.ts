import * as React from 'react';
/** Chip for filters, categories and removable selections. */
export interface TagProps extends React.HTMLAttributes<HTMLElement> {
  icon?: string | React.ReactNode;
  /** Selected (filter on) — only meaningful with onClick */
  selected?: boolean;
  /** Makes the tag a toggle button */
  onClick?: (e: React.MouseEvent) => void;
  /** Shows a remove (×) affordance */
  onRemove?: (e: React.MouseEvent) => void;
  /** Accessible name of the remove control. @default 'Remove ' + children (when a string) */
  removeLabel?: string;
  /** Dims the tag and disables the remove control / click */
  disabled?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** outline = hairline on raised (filters) · soft = tinted fill from tone (keyword hits, statuses) · dashed = missing / placeholder. @default 'outline' */
  variant?: 'outline' | 'soft' | 'dashed';
  /** Colour for soft / outline (status or label hue) */
  tone?: import('../primitives/Surface').Tone;
  /** pill = fully rounded (keyword chips, comparison chips). @default 'rounded' */
  shape?: 'rounded' | 'pill';
  children?: React.ReactNode;
}
export declare function Tag(props: TagProps): JSX.Element;
