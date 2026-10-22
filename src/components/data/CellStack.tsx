import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './CellStack.module.css';

export interface CellStackProps extends HtmlProps<HTMLSpanElement> {
  primary: JSX.Element;
  secondary?: JSX.Element;
  mono?: boolean;
  secondaryMono?: boolean;
  /** @default true */
  strong?: boolean;
  align?: 'left' | 'right';
  leading?: JSX.Element;
  trailing?: JSX.Element;
}

export const CellStack = (props: CellStackProps) => {
  const merged = mergeProps({ strong: true, align: 'left' } satisfies Partial<CellStackProps>, props);
  const [local, rest] = splitProps(merged, [
    'primary',
    'secondary',
    'mono',
    'secondaryMono',
    'strong',
    'align',
    'leading',
    'trailing',
    'class',
  ]);
  return (
    <span {...rest} class={cx(styles.root, local.align === 'right' && styles.end, local.class)}>
      <Show when={local.leading}>
        <span class={styles.slot}>{local.leading}</span>
      </Show>
      <span class={styles.text}>
        <span class={cx(styles.primary, local.mono && styles.mono, local.strong && styles.strong)}>
          {local.primary}
        </span>
        <Show when={local.secondary != null && local.secondary !== ''}>
          <span class={cx(styles.secondary, local.secondaryMono && styles.mono)}>{local.secondary}</span>
        </Show>
      </span>
      <Show when={local.trailing}>
        <span class={styles.slot}>{local.trailing}</span>
      </Show>
    </span>
  );
};
