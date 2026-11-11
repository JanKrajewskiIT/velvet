import { type JSX, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { StatusTone } from '../../utils/tone';
import { Dot } from '../primitives/Dot';
import { renderIcon } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import styles from './StatusBarItem.module.css';

export interface StatusBarItemProps extends HtmlProps<HTMLSpanElement> {
  tone?: StatusTone;
  pulse?: boolean;
  /** Replaces the status dot. */
  icon?: JSX.Element;
  mono?: boolean;
  strong?: boolean;
  /** md hides below 1024px; sm hides below 640px. */
  hide?: 'md' | 'sm';
}

export const StatusBarItem = (props: StatusBarItemProps) => {
  const [local, rest] = splitProps(props, ['tone', 'pulse', 'icon', 'mono', 'strong', 'hide', 'children', 'class']);

  return (
    <span
      {...rest}
      class={cx(styles.item, local.class)}
      data-tone={local.tone}
      data-mono={local.mono ? '' : undefined}
      data-strong={local.strong ? '' : undefined}
      data-hide={local.hide}
    >
      <Show
        when={!!local.icon}
        fallback={<Show when={local.tone}>{(tone) => <Dot tone={tone()} pulse={local.pulse} />}</Show>}
      >
        {renderIcon(local.icon, styles.icon)}
      </Show>
      <Text as="span" variant="caption" tone="inherit" class={styles.text}>
        {local.children}
      </Text>
    </span>
  );
};
