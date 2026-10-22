import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Glyph } from '../primitives/Glyph';
import styles from './DirectionBadge.module.css';

const DIRECTIONS: Readonly<Record<string, readonly [string, string]>> = {
  LONG: ['up', 'arrow-up'],
  BUY: ['up', 'arrow-up'],
  ADD: ['up', 'plus'],
  SHORT: ['down', 'arrow-down'],
  SELL: ['down', 'arrow-down'],
  TRIM: ['down', 'minus'],
  WAIT: ['flat', 'clock'],
  HOLD: ['flat', 'pause'],
  NO_TRADE: ['off', 'x'],
  SKIP: ['off', 'x'],
};

export interface DirectionBadgeProps extends HtmlProps<HTMLSpanElement> {
  direction: string;
  suffix?: JSX.Element;
  icon?: boolean;
  variant?: 'solid' | 'soft' | 'outline';
  size?: 'sm' | 'md';
}

export const DirectionBadge = (props: DirectionBadgeProps) => {
  const merged = mergeProps({ variant: 'solid', size: 'md' } satisfies Partial<DirectionBadgeProps>, props);
  const [local, rest] = splitProps(merged, ['direction', 'suffix', 'icon', 'variant', 'size', 'class']);
  const key = () => local.direction.toUpperCase();
  const meta = () => DIRECTIONS[key()];
  return (
    <span
      {...rest}
      class={cx(styles.root, local.class)}
      data-dir={meta()?.[0] ?? 'flat'}
      data-size={local.size}
      data-variant={local.variant}
    >
      <Show when={local.icon && meta()?.[1]}>{(icon) => <Glyph name={icon()} />}</Show>
      {key().replace('_', ' ')}
      <Show when={local.suffix != null}>
        <span class={styles.suffix}>{local.suffix}</span>
      </Show>
    </span>
  );
};
