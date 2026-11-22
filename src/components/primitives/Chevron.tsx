import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { partitionProps, withDefaults } from '../../utils/props';
import styles from './Chevron.module.css';

const CHEVRON_CLASSES = {
  down: styles.chevronVariantDown,
  open: styles.chevronVariantOpen,
  up: styles.chevronVariantUp,
  right: styles.chevronVariantRight,
  left: styles.chevronVariantLeft,
} as const;

const GLYPH = { down: 'chevron-down', right: 'chevron-right', left: 'chevron-left', up: 'chevron-up' } as const;

export type ChevronDirection = keyof typeof GLYPH;

export interface ChevronProps extends HtmlProps<HTMLElement> {
  /** Resting direction. down = dropdowns/accordions · right = nested navigation. @default 'down' */
  direction?: ChevronDirection;
  /** Rotated "open" state. */
  open?: boolean;
}

/** Decorative disclosure arrow; the host carries `aria-expanded`. */
export const Chevron = (props: ChevronProps) => {
  const merged = withDefaults({ direction: 'down' } satisfies ChevronProps, props);
  const [local, rest] = partitionProps(merged, ['direction', 'open', 'class']);
  return (
    <i
      class={cx(
        styles.icon,
        `icon-${GLYPH[local.direction]}`,
        styles.chevron,
        variantClass(CHEVRON_CLASSES, local.direction),
        local.open && styles.chevronVariantOpen,
        local.class,
      )}
      aria-hidden="true"
      {...rest}
    />
  );
};
