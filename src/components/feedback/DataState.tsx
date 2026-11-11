import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { toneIcon } from '../../utils/tone';
import { Dot } from '../primitives/Dot';
import styles from './DataState.module.css';
import { EmptyState } from './EmptyState';
import type { StateSize, StateTone } from './StateTile';

const STATES = {
  fresh: { tone: 'success' },
  delayed: { tone: 'info', icon: 'clock' },
  stale: { tone: 'warning', icon: 'clock' },
  partial: { tone: 'warning' },
  unavailable: { tone: 'danger' },
  empty: { tone: 'neutral', icon: 'check' },
} as const satisfies Record<string, { tone: StateTone; icon?: string }>;

export interface DataStateProps extends HtmlProps<HTMLElement> {
  state?: keyof typeof STATES;
  label?: JSX.Element;
  detail?: JSX.Element;
  source?: JSX.Element;
  asOf?: JSX.Element;
  variant?: 'inline' | 'block';
  /** Block variant uses the matching EmptyState size. @default 'md' */
  size?: StateSize;
  action?: JSX.Element;
}

export const DataState = (props: DataStateProps) => {
  const merged = mergeProps({ state: 'fresh', variant: 'inline', size: 'md' } satisfies Partial<DataStateProps>, props);
  const [local, rest] = splitProps(merged, [
    'state',
    'label',
    'detail',
    'source',
    'asOf',
    'variant',
    'size',
    'action',
    'class',
  ]);
  const translate = useTranslate();
  const state = () => (Object.hasOwn(STATES, local.state) ? local.state : 'fresh');
  const meta = (): { tone: StateTone; icon?: string } => STATES[state()];
  const label = () => local.label ?? translate(`velvet.finance.dataState.${state()}`);
  const source = () => (
    <Show when={local.source || local.asOf}>
      <span class={styles.source}>
        {local.source}
        {local.source && local.asOf ? ' · ' : ''}
        {local.asOf}
      </span>
    </Show>
  );
  return (
    <Show
      when={local.variant === 'block'}
      fallback={
        <span {...rest} role="status" class={cx(styles.root, local.class)} data-variant="inline">
          <Dot tone={meta().tone} pulse={local.state === 'fresh'} />
          <span>{label()}</span>
          {source()}
        </span>
      }
    >
      <div {...rest} role="status" class={cx(styles.block, local.class)} data-variant="block" data-tone={meta().tone}>
        <EmptyState
          icon={meta().icon ?? toneIcon(meta().tone)}
          tone={meta().tone}
          size={local.size}
          title={label()}
          description={
            <Show when={local.detail || local.source || local.asOf}>
              {local.detail}
              {source()}
            </Show>
          }
          actions={local.action}
        />
      </div>
    </Show>
  );
};
