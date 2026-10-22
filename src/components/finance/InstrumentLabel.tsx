import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import styles from './InstrumentLabel.module.css';

export interface InstrumentLabelProps extends HtmlProps<HTMLElement, 'onClick'> {
  symbol: string;
  name?: JSX.Element;
  exchange?: string;
  mark?: JSX.Element;
  showMark?: boolean;
  meta?: JSX.Element;
  size?: 'sm' | 'md';
  selected?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export const InstrumentLabel = (props: InstrumentLabelProps) => {
  const merged = mergeProps({ size: 'md' } satisfies Partial<InstrumentLabelProps>, props);
  const [local, rest] = splitProps(merged, [
    'symbol',
    'name',
    'exchange',
    'mark',
    'showMark',
    'meta',
    'size',
    'selected',
    'onClick',
    'class',
  ]);
  const mark = () =>
    typeof local.mark === 'string' || local.mark == null
      ? (local.mark || local.symbol)
          .replace(/[^A-Za-z0-9]/gu, '')
          .slice(0, 3)
          .toUpperCase()
      : local.mark;
  return (
    <Polymorphic
      {...rest}
      tag={local.onClick ? 'button' : 'span'}
      type={local.onClick ? 'button' : undefined}
      onClick={local.onClick}
      aria-pressed={local.onClick ? !!local.selected : undefined}
      class={cx(styles.root, local.class)}
      data-size={local.size}
      data-selected={!!local.selected}
    >
      <Show when={local.showMark}>
        <span class={styles.mark} aria-hidden="true">
          {mark()}
        </span>
      </Show>
      <span class={styles.text}>
        <span class={styles.row}>
          <span class={styles.symbol}>{local.symbol}</span>
          <Show when={local.exchange}>
            <span class={styles.exchange}>{local.exchange}</span>
          </Show>
        </span>
        <Show when={local.name || local.meta}>
          <span class={styles.name}>
            {local.name}
            {local.name && local.meta ? ' · ' : ''}
            {local.meta}
          </span>
        </Show>
      </span>
    </Polymorphic>
  );
};
