import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, createSignal, For, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { seriesColor } from './chartScale';
import { createChartFormat } from './createChartFormat';
import styles from './FunnelChart.module.css';

const MAX_STEP_FADE = 14;
const TOTAL_FADE = 56;
const DECIMAL_BELOW = 10;

export interface FunnelDatum {
  label: string;
  value: number;
  /** Overrides the funnel colour for this step. */
  color?: string;
}

export interface FunnelChartProps {
  data: FunnelDatum[];
  /** @default compact numbers in the active locale (1.2K) */
  format?: (v: number) => string;
  /** Lightens step by step. @default 'var(--dv-1)' */
  color?: string;
  /** @default true */
  showConversion?: boolean;
  /** Conversion % against the previous step or the first. @default 'previous' */
  relativeTo?: 'previous' | 'first';
  /** Accessible name. @default localized "Funnel" */
  label?: string;
  class?: string;
}

/** Conversion funnel — centred bars that narrow step by step, value + share of the first step, and a conversion / drop-off line between steps. The hatched ghost marks where the previous step was. Tab through steps; each step reads its numbers to screen readers. */
export const FunnelChart = (props: FunnelChartProps) => {
  const merged = mergeProps(
    { color: seriesColor(0), showConversion: true, relativeTo: 'previous' } satisfies Partial<FunnelChartProps>,
    props,
  );
  const i18n = useI18n();
  const translate = useTranslate();
  const format = createChartFormat(() => merged.format);
  const [highlighted, setHighlighted] = createSignal(-1);

  const label = () => merged.label ?? translate('velvet.charts.funnelChart.label');
  const percent = (x: number): string =>
    `${x < DECIMAL_BELOW ? i18n.formatNumber(x, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : i18n.formatNumber(Math.round(x))}%`;

  const max = () => Math.max(1, ...merged.data.map((d) => d.value || 0));
  const fade = () => Math.min(MAX_STEP_FADE, TOTAL_FADE / Math.max(1, merged.data.length - 1));

  const steps = createMemo(() => {
    const first = merged.data[0];
    const firstValue = first?.value || 0;
    return merged.data.map((d, i) => {
      const value = d.value || 0;
      const previous = merged.data[i - 1];
      const previousValue = previous ? previous.value || 0 : null;
      const base = merged.relativeTo === 'first' ? firstValue : previousValue;
      const conversion = i && base ? (value / base) * 100 : null;
      const ofFirst = firstValue ? (value / firstValue) * 100 : 0;
      const baseLabel = merged.relativeTo === 'first' ? first?.label : previous?.label;
      return { datum: d, index: i, value, previousValue, conversion, ofFirst, baseLabel };
    });
  });

  const stepLabel = (step: ReturnType<typeof steps>[number]): string => {
    const first = merged.data[0];
    const params = { step: step.datum.label, value: format(step.value) };
    if (!step.index || !first) return translate('velvet.charts.funnelChart.stepLabel', params);
    const ofFirst = { ...params, percent: percent(step.ofFirst), first: first.label };
    if (step.conversion === null) return translate('velvet.charts.funnelChart.stepLabelOfFirst', ofFirst);
    return translate('velvet.charts.funnelChart.stepLabelFromBase', {
      ...ofFirst,
      conversion: percent(step.conversion),
      base: step.baseLabel ?? '',
    });
  };

  return (
    <div class={cx(typographyClass('body'), styles.funnel, merged.class)} role="list" aria-label={label()}>
      <For each={steps()}>
        {(step) => (
          <>
            <Show when={merged.showConversion && step.index > 0}>
              <div class={styles.funnelPartConv} aria-hidden="true">
                <span>
                  <Text as="b" variant="label-sm" tone="inherit">
                    <Glyph name="arrow-down" />
                    {percent(step.conversion ?? 0)}
                  </Text>
                  <Text as="small" variant="caption" tone="inherit">
                    {translate('velvet.charts.funnelChart.dropOff', {
                      value: format(Math.max(0, (step.previousValue ?? 0) - step.value)),
                    })}
                  </Text>
                </span>
              </div>
            </Show>
            <div
              role="listitem"
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- each step is focusable so keyboard users get the same highlight and spoken label as hover
              tabindex={0}
              class={cx(
                styles.funnelPartRow,
                highlighted() >= 0 && highlighted() !== step.index && styles.funnelPartRowVariantDim,
              )}
              aria-label={stepLabel(step)}
              onMouseEnter={() => setHighlighted(step.index)}
              onMouseLeave={() => setHighlighted(-1)}
              onFocus={() => setHighlighted(step.index)}
              onBlur={() => setHighlighted(-1)}
            >
              <Text as="span" variant="label" class={styles.funnelPartLabel}>
                {step.datum.label}
              </Text>
              <span class={styles.funnelPartTrack}>
                <Show when={step.previousValue !== null}>
                  <span
                    class={styles.funnelPartGhost}
                    style={{ width: `${((step.previousValue ?? 0) / max()) * 100}%` }}
                  />
                </Show>
                <span
                  class={styles.funnelPartBar}
                  style={{
                    width: `${Math.max(0.5, (step.value / max()) * 100)}%`,
                    background: `color-mix(in oklab, ${step.datum.color ?? merged.color} ${100 - step.index * fade()}%, var(--bg-raised))`,
                    'animation-delay': `${step.index * 60}ms`,
                  }}
                />
              </span>
              <Text as="span" variant="body" class={styles.funnelPartVal}>
                <Text as="b" variant="title" tone="inherit" tabular>
                  {format(step.value)}
                </Text>
                <Text as="small" variant="caption" tone="inherit">
                  {step.index ? percent(step.ofFirst) : '100%'}
                </Text>
              </Text>
            </div>
          </>
        )}
      </For>
    </div>
  );
};
