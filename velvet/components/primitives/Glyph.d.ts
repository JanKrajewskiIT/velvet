import * as React from 'react';
/**
 * Atom. One Velvet icon as a CSS-mask <i class="vui-icon icon-NAME"> (colour = currentColor). Every component that takes an `icon` prop renders through this.
 * Lighter than the SVG <Icon> (05 Icons) — no markup per glyph, sizes with text. Decorative by default; pass `label` when it carries meaning.
 */
export interface GlyphProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** File name in assets/icons without .svg, e.g. "search" */
  name: string;
  /** Token size (xs 12 · sm 14 · md 16 · lg 18 · xl 20) or px. Omit to follow text (1.15em). */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Accessible name — makes the icon role="img" */
  label?: string;
}
export declare function Glyph(props: GlyphProps): JSX.Element;
/** string → <Glyph name>, node → as-is, empty → null. For `icon` props that accept either. */
export declare function renderIcon(icon?: string | React.ReactNode, className?: string): React.ReactNode;
