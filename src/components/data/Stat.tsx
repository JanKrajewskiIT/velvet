import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { Tone } from '../../utils/tone';
import { Sparkline } from '../charts/Sparkline';
import { Badge } from '../display/Badge';
import { Card, type CardProps } from '../display/Card';
import { Text } from '../primitives/Text';
import styles from './Stat.module.css';

const DELTA_COLOR = {
  success: 'var(--status-success-fg)',
  danger: 'var(--status-danger-fg)',
  warning: 'var(--status-warning-fg)',
  neutral: 'var(--fg-secondary)',
} as const;

const SPARK_HEIGHT = 32;

export interface StatProps extends HtmlProps<HTMLElement, 'title'> {
  label: JSX.Element;
  value: JSX.Element;
  delta?: string;
  /** Colour of the delta badge. @default 'success' */
  tone?: keyof typeof DELTA_COLOR;
  hint?: JSX.Element;
  /** Category coding — Surface accent strip in this tone; also colours the sparkline. */
  accent?: Tone;
  /** Recent values → small trend line under the number. */
  spark?: number[];
  /** Card padding. @default 'sm' */
  padding?: CardProps['padding'];
  /** Card pass-through. */
  variant?: CardProps['variant'];
  hoverable?: CardProps['hoverable'];
  interactive?: CardProps['interactive'];
  reveal?: CardProps['reveal'];
  selected?: CardProps['selected'];
  as?: CardProps['as'];
}

/** KPI card built on Card: label, big value, delta badge, hint. `spark` adds a trend line. */
export const Stat = (props: StatProps) => {
  const merged = mergeProps({ tone: 'success', padding: 'sm' } satisfies Partial<StatProps>, props);
  const [local, rest] = splitProps(merged, [
    'label',
    'value',
    'delta',
    'tone',
    'hint',
    'accent',
    'spark',
    'padding',
    'class',
  ]);
  const translate = useTranslate();
  return (
    <Card
      {...rest}
      padding={local.padding}
      tone={local.accent}
      accent={!!local.accent}
      class={cx(styles.stat, local.class)}
      bodyClass={styles.cardBody}
    >
      <Text as="div" variant="body-sm" tone="secondary" class="vui-stat__label">
        {local.label}
      </Text>
      <div class={styles.statPartRow}>
        <Text as="span" variant="h2" tabular class="vui-stat__value">
          {local.value}
        </Text>
        <Show when={local.delta}>
          {(delta) => (
            <Badge size="sm" tone={local.tone} style={{ color: DELTA_COLOR[local.tone] }}>
              {delta()}
            </Badge>
          )}
        </Show>
      </div>
      <Show when={local.spark}>
        {(data) => (
          <Sparkline
            data={data()}
            height={SPARK_HEIGHT}
            color={local.accent ? 'var(--tone)' : 'var(--dv-1)'}
            label={typeof local.label === 'string' ? local.label : translate('velvet.data.stat.trendLabel')}
            class={styles.statPartSpark}
          />
        )}
      </Show>
      <Show when={local.hint}>
        {(hint) => (
          <Text as="div" variant="caption" tone="tertiary" class="vui-stat__hint">
            {hint()}
          </Text>
        )}
      </Show>
    </Card>
  );
};
