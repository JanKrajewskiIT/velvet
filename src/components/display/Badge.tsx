import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { StatusTone } from '../../utils/tone';
import { renderIcon } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import styles from './Badge.module.css';

const BADGE_CLASSES = {
  sm: styles.badgeVariantSm,
  pulse: styles.badgeVariantPulse,
  neutral: styles.badgeVariantNeutral,
  brand: styles.badgeVariantBrand,
  success: styles.badgeVariantSuccess,
  warning: styles.badgeVariantWarning,
  danger: styles.badgeVariantDanger,
  info: styles.badgeVariantInfo,
  solid: styles.badgeVariantSolid,
  outline: styles.badgeVariantOutline,
} as const;

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
    <Text
      as="span"
      variant={local.size === 'sm' ? 'overline' : 'label-sm'}
      tone="inherit"
      {...rest}
      class={cx(
        styles.badge,
        variantClass(BADGE_CLASSES, local.tone),
        variantClass(BADGE_CLASSES, local.variant, 'soft'),
        local.size === 'sm' && styles.badgeVariantSm,
        local.pulse && styles.badgeVariantPulse,
        local.class,
      )}
    >
      <Show when={local.dot} fallback={renderIcon(local.icon)}>
        <span class={styles.badgePartDot} aria-hidden="true" />
      </Show>
      {local.children}
    </Text>
  );
};
