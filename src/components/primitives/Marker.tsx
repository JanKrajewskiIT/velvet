import { mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { Tone } from '../../utils/tone';
import styles from './Marker.module.css';
import { Text } from './Text';

const MARKER_CLASSES = {
  sm: styles.markerVariantSm,
  lg: styles.markerVariantLg,
  soft: styles.markerVariantSoft,
  outline: styles.markerVariantOutline,
  solid: styles.markerVariantSolid,
  ring: styles.markerVariantRing,
  gap: styles.markerVariantGap,
} as const;

export interface MarkerProps extends HtmlProps<HTMLSpanElement> {
  /** sm 24 · md 28 · lg 32. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** soft = tinted (events) · outline = todo / upcoming · solid = done / current / error. @default 'soft' */
  appearance?: 'soft' | 'outline' | 'solid';
  /** Colour. Omit for neutral. */
  tone?: Tone;
  /** Current-step halo. */
  ring?: boolean;
  /** Surface-coloured separation ring — use when the marker sits over a rail line. */
  gap?: boolean;
  /** Render a centred dot instead of children. */
  dot?: boolean;
}

/** Round step / event badge — a number, icon, avatar or dot in a circle. */
export const Marker = (props: MarkerProps) => {
  const merged = mergeProps({ size: 'md', appearance: 'soft' } satisfies MarkerProps, props);
  const [local, rest] = splitProps(merged, ['size', 'appearance', 'tone', 'ring', 'gap', 'dot', 'class', 'children']);
  return (
    <Text
      as="span"
      variant="label-sm"
      tone="inherit"
      class={cx(
        styles.marker,
        variantClass(MARKER_CLASSES, local.size, 'md'),
        variantClass(MARKER_CLASSES, local.appearance),
        local.ring && styles.markerVariantRing,
        local.gap && styles.markerVariantGap,
        local.class,
      )}
      data-tone={local.tone}
      {...rest}
    >
      <Show when={local.dot} fallback={local.children}>
        <span class={styles.markerPartDot} />
      </Show>
    </Text>
  );
};
