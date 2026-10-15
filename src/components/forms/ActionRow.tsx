import { type JSX, mergeProps, Show } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { typographyClass } from '../primitives/typography';
import styles from './ActionRow.module.css';

const ACTIONROW_CLASSES = {
  end: styles.actionrowVariantEnd,
  start: styles.actionrowVariantStart,
  center: styles.actionrowVariantCenter,
  between: styles.actionrowVariantBetween,
  divider: styles.actionrowVariantDivider,
  sticky: styles.actionrowVariantSticky,
} as const;

export interface ActionRowProps {
  /** @default 'end' */
  align?: 'start' | 'center' | 'end' | 'between';
  /** Pins to the bottom of the scroll container with a frosted background. */
  sticky?: boolean;
  divider?: boolean;
  /** Left slot, e.g. Delete or "Saved 2 min ago". */
  start?: JSX.Element;
  class?: string;
  children?: JSX.Element;
}

/** Button row for forms, dialogs and panels. Wraps on narrow widths; the primary action stays last. */
export const ActionRow = (props: ActionRowProps) => {
  const p = mergeProps({ align: 'end' } satisfies Partial<ActionRowProps>, props);
  return (
    <div
      class={cx(
        styles.actionrow,
        variantClass(ACTIONROW_CLASSES, p.align),
        p.sticky && styles.actionrowVariantSticky,
        p.divider && styles.actionrowVariantDivider,
        p.class,
      )}
    >
      <Show when={p.start}>
        <div class={cx(styles.actionrowPartStart, typographyClass('body-sm'))}>{p.start}</div>
      </Show>
      <div class={styles.actionrowPartMain}>{p.children}</div>
    </div>
  );
};
