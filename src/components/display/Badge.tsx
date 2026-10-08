import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx, modifier } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { StatusTone } from '../../utils/tone';
import { renderIcon } from '../primitives/Glyph';

export type BadgeVariant = 'soft' | 'solid' | 'outline';

export interface BadgeProps extends HtmlProps<HTMLSpanElement> {
  /** @default 'neutral' */
  tone?: StatusTone;
  /** @default 'soft' */
  variant?: BadgeVariant;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Leading status dot. */
  dot?: boolean;
  /** Pulsing dot — live / streaming / analysing states. Use with `dot`. Static under reduced motion. */
  pulse?: boolean;
  /** Leading glyph name or node (ignored when `dot` is set). */
  icon?: JSX.Element;
}

/** Small non-interactive status or count label. */
export const Badge = (props: BadgeProps) => {
  const merged = mergeProps({ tone: 'neutral', variant: 'soft', size: 'md' } satisfies BadgeProps, props);
  const [local, rest] = splitProps(merged, ['tone', 'variant', 'size', 'dot', 'pulse', 'icon', 'class', 'children']);
  return (
    <span
      {...rest}
      class={cx(
        'vui-badge',
        `vui-badge--${local.tone}`,
        modifier('vui-badge', local.variant, 'soft'),
        local.size === 'sm' && 'vui-badge--sm',
        local.pulse && 'vui-badge--pulse',
        local.class,
      )}
    >
      <Show when={local.dot} fallback={renderIcon(local.icon)}>
        <span class="vui-badge__dot" aria-hidden="true" />
      </Show>
      {local.children}
    </span>
  );
};
