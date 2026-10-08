import { type JSX, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';

export type GlyphSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface GlyphProps extends HtmlProps<HTMLElement, 'children'> {
  /** File name in `assets/icons` without `.svg`, e.g. `"search"`. */
  name: string;
  /** Token size (xs 12 · sm 14 · md 16 · lg 18 · xl 20) or px. Omit to follow the text (1.15em). */
  size?: GlyphSize | number;
  /** Accessible name — makes the icon `role="img"`. */
  label?: string;
}

/** One Velvet icon as a CSS-mask glyph. Decorative unless `label` is set. */
export const Glyph = (props: GlyphProps) => {
  const [local, rest] = splitProps(props, ['name', 'size', 'label', 'class', 'style']);
  const style = (): JSX.CSSProperties | undefined =>
    typeof local.size === 'number' ? { 'font-size': `${local.size}px`, ...local.style } : local.style;
  return (
    <i
      class={cx(
        'vui-icon',
        `icon-${local.name}`,
        typeof local.size === 'string' && `vui-icon--${local.size}`,
        local.class,
      )}
      style={style()}
      role={local.label ? 'img' : undefined}
      aria-label={local.label}
      aria-hidden={local.label ? undefined : true}
      {...rest}
    />
  );
};

/** string → `<Glyph name>`, node → as-is, empty → `null`. For `icon` props that accept either. */
export const renderIcon = (icon: JSX.Element | undefined, className?: string): JSX.Element => {
  return typeof icon === 'string' ? <Glyph name={icon} class={className} /> : (icon ?? null);
};
