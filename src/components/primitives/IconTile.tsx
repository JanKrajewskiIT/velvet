import { type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { Tone } from '../../utils/tone';
import { renderIcon } from './Glyph';

export interface IconTileProps extends HtmlProps<HTMLSpanElement> {
  icon?: JSX.Element;
  tone?: Tone;
  /** sm 32 · md 36 · lg 40 · xl 48 · 2xl 56 · 3xl 72. @default 'md' */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** Soft tinted halo around the tile. `true` = md. */
  halo?: boolean | 'md' | 'lg';
  /** @default 'square' */
  shape?: 'square' | 'circle';
  /** Hairline border — for brand / source logos on a neutral ground. */
  outline?: boolean;
  /** Custom ink (brand colour of a source) — wins over the tone foreground. */
  color?: string;
}

/** A glyph in a tinted box — the leading visual of notification rows, source rows, feature cards and dialogs. */
export const IconTile = (props: IconTileProps) => {
  const merged = mergeProps({ size: 'md', shape: 'square' } satisfies IconTileProps, props);
  const [local, rest] = splitProps(merged, [
    'icon',
    'tone',
    'size',
    'halo',
    'shape',
    'outline',
    'color',
    'class',
    'style',
    'children',
  ]);
  const halo = () => (local.halo ? `vui-icon-tile--halo-${local.halo === true ? 'md' : local.halo}` : false);
  return (
    <span
      class={cx(
        'vui-icon-tile',
        `vui-icon-tile--${local.size}`,
        local.shape === 'circle' && 'vui-icon-tile--circle',
        local.outline && 'vui-icon-tile--outline',
        halo(),
        local.class,
      )}
      data-tone={local.tone}
      style={local.color ? { ...local.style, color: local.color } : local.style}
      aria-hidden={rest['aria-label'] ? undefined : true}
      {...rest}
    >
      {local.children ?? renderIcon(local.icon)}
    </span>
  );
};
