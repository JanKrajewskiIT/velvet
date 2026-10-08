import * as React from 'react';
/**
 * Atom. Inline separator between siblings in a row: toolbar groups (line), OTP groups (dash), time units and paths (text: ":" "/" "›").
 * Decorative by default. For block-level section breaks use Divider (12 Layout).
 */
export interface SeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** line = 1px rule · dash = short 10×2 bar · text = glyph in --fg-tertiary. @default 'line' */
  variant?: 'line' | 'dash' | 'text';
  /** Only for line. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Expose role="separator" (toolbars, menus). Otherwise aria-hidden. */
  semantic?: boolean;
  /** Glyph for variant="text". @default '/' */
  children?: React.ReactNode;
}
export declare function Separator(props: SeparatorProps): JSX.Element;
