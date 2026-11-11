import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Glyph } from '../primitives/Glyph';
import styles from './DirectionBadge.module.css';

const DIRECTION_ICONS = { up: 'arrow-up', down: 'arrow-down', flat: 'minus', muted: 'x' } as const;
type Direction = keyof typeof DIRECTION_ICONS;
const isDirection = (value: string): value is Direction => Object.hasOwn(DIRECTION_ICONS, value);

const LEGACY_DIRECTIONS: Readonly<Partial<Record<string, readonly [string, string]>>> = {
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
  /** Use up, down, flat or muted. Legacy direction labels are still accepted. @default 'flat' */
  direction?: string;
  suffix?: JSX.Element;
  icon?: boolean;
  variant?: 'solid' | 'soft' | 'outline';
  size?: 'sm' | 'md';
}

export const DirectionBadge = (props: DirectionBadgeProps) => {
  const merged = mergeProps(
    { direction: 'flat', variant: 'solid', size: 'md' } satisfies Partial<DirectionBadgeProps>,
    props,
  );
  const [local, rest] = splitProps(merged, ['direction', 'children', 'suffix', 'icon', 'variant', 'size', 'class']);
  const translate = useTranslate();
  const direction = () => (isDirection(local.direction) ? local.direction : undefined);
  const key = () => local.direction.toUpperCase();
  const legacy = () => LEGACY_DIRECTIONS[key()];
  const glyph = () => {
    const current = direction();
    return current ? DIRECTION_ICONS[current] : legacy()?.[1];
  };
  const label = () => {
    const current = direction();
    return current ? translate(`velvet.finance.directionBadge.${current}`) : key().replace('_', ' ');
  };
  return (
    <span
      {...rest}
      class={cx(styles.root, direction() && styles.neutral, local.class)}
      data-dir={direction() === 'muted' ? 'off' : (direction() ?? legacy()?.[0] ?? 'flat')}
      data-size={local.size}
      data-variant={local.variant}
    >
      <Show when={local.icon && glyph()}>{(icon) => <Glyph name={icon()} />}</Show>
      {local.children ?? label()}
      <Show when={local.suffix != null}>
        <span class={styles.suffix}>{local.suffix}</span>
      </Show>
    </span>
  );
};
