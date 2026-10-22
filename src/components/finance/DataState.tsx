import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { Dot } from '../primitives/Dot';
import { Glyph } from '../primitives/Glyph';
import styles from './DataState.module.css';

const STATES = {
  fresh: { tone: 'success', icon: 'check' },
  delayed: { tone: 'info', icon: 'clock' },
  stale: { tone: 'warning', icon: 'clock' },
  partial: { tone: 'warning', icon: 'triangle-alert' },
  unavailable: { tone: 'danger', icon: 'triangle-alert' },
  empty: { tone: 'neutral', icon: 'check' },
} as const;

export interface DataStateProps extends HtmlProps<HTMLElement> {
  state?: keyof typeof STATES;
  label?: JSX.Element;
  detail?: JSX.Element;
  source?: JSX.Element;
  asOf?: JSX.Element;
  variant?: 'inline' | 'block';
  action?: JSX.Element;
}

export const DataState = (props: DataStateProps) => {
  const merged = mergeProps({ state: 'fresh', variant: 'inline' } satisfies Partial<DataStateProps>, props);
  const [local, rest] = splitProps(merged, [
    'state',
    'label',
    'detail',
    'source',
    'asOf',
    'variant',
    'action',
    'class',
  ]);
  const translate = useTranslate();
  const meta = () => STATES[local.state];
  const block = () => local.variant === 'block';
  return (
    <Polymorphic
      {...rest}
      tag={block() ? 'div' : 'span'}
      role="status"
      class={cx(styles.root, local.class)}
      data-variant={local.variant}
      data-tone={block() ? meta().tone : undefined}
    >
      <Show when={block()} fallback={<Dot tone={meta().tone} pulse={local.state === 'fresh'} />}>
        <span class={styles.icon}>
          <Glyph name={meta().icon} />
        </span>
      </Show>
      <span class={styles.title}>{local.label ?? translate(`velvet.finance.dataState.${local.state}`)}</span>
      <Show when={block() && local.detail}>
        <span class={styles.detail}>{local.detail}</span>
      </Show>
      <Show when={local.source || local.asOf}>
        <span class={styles.source}>
          {local.source}
          {local.source && local.asOf ? ' · ' : ''}
          {local.asOf}
        </span>
      </Show>
      <Show when={block()}>{local.action}</Show>
    </Polymorphic>
  );
};
