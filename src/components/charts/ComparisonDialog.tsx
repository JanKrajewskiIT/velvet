import { children, For, Index, type JSX, Match, mergeProps, Show, Switch } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Avatar } from '../data/Avatar';
import { Dialog, type DialogProps } from '../feedback/Dialog';
import { Spinner } from '../feedback/Spinner';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import { seriesColor } from './chartScale';
import { bestIndexes, type ComparisonItem, type ComparisonRow } from './comparison';
import styles from './ComparisonDialog.module.css';
import { type RadarAxis, RadarChart, type RadarSeries } from './RadarChart';

const MIN_RADAR_AXES = 3;
const RADAR_MAX = 100;
const RADAR_SIZE = 300;

export interface ComparisonDialogProps {
  open: boolean;
  onClose?: () => void;
  /** @default localized "Comparison" */
  title?: JSX.Element;
  description?: JSX.Element;
  items: ComparisonItem[];
  axes?: RadarAxis[];
  rows?: ComparisonRow[];
  /** Rendered insights (e.g. Markdown) — replaces the generate prompt. */
  insights?: JSX.Element;
  onGenerateInsights?: () => void;
  /** @default 'idle' */
  insightsStatus?: 'idle' | 'loading';
  /** @default localized "Generate AI insights" */
  insightsLabel?: string;
  /** @default 'done' */
  status?: 'loading' | 'done' | 'error';
  /** @default localized "Couldn’t build the comparison. Try again." */
  error?: JSX.Element;
  onRetry?: () => void;
  /** @default 'lg' */
  size?: DialogProps['size'];
  /** @default a Close button */
  footer?: JSX.Element;
}

/** Side-by-side comparison in a dialog: colour-keyed column headers, a RadarChart across axes (≥3 axes with `item.scores`), a criteria table with best-value stars, and an optional AI insights block (generate on demand). */
export const ComparisonDialog = (props: ComparisonDialogProps) => {
  const merged = mergeProps(
    { axes: [], rows: [], insightsStatus: 'idle', status: 'done', size: 'lg' } satisfies Partial<ComparisonDialogProps>,
    props,
  );
  const translate = useTranslate();
  const title = () => merged.title ?? translate('velvet.charts.comparisonDialog.title');
  const insightsLabel = () => merged.insightsLabel ?? translate('velvet.charts.comparisonDialog.insightsLabel');
  const error = () => merged.error ?? translate('velvet.charts.comparisonDialog.error');
  const radarLabel = () => {
    const heading = title();
    return typeof heading === 'string' ? heading : undefined;
  };
  const insights = children(() => merged.insights);
  const colorAt = (item: ComparisonItem, i: number) => item.color ?? seriesColor(i);

  const radarSeries = (): RadarSeries[] =>
    merged.items.map((item, i) => ({ label: item.label, values: item.scores ?? {}, color: colorAt(item, i) }));
  const hasRadar = () => merged.axes.length >= MIN_RADAR_AXES && merged.items.some((item) => item.scores);

  return (
    <Dialog
      open={merged.open}
      onClose={merged.onClose}
      title={title()}
      description={merged.description}
      size={merged.size}
      bodyClass={styles.dialogBody}
      footer={
        merged.footer ?? (
          <Button variant="secondary" onClick={() => merged.onClose?.()}>
            {translate('velvet.common.close')}
          </Button>
        )
      }
    >
      <Switch>
        <Match when={merged.status === 'loading'}>
          <Text as="div" variant="body-sm" tone="secondary" class={styles.cmpdlgPartState} aria-busy="true">
            <Spinner size="lg" label={translate('velvet.charts.comparisonDialog.comparingLabel')} />
            <Text as="span" variant="body-sm" tone="inherit">
              {translate('velvet.charts.comparisonDialog.comparing', { count: merged.items.length })}
            </Text>
          </Text>
        </Match>
        <Match when={merged.status === 'error'}>
          <Text
            as="div"
            variant="body-sm"
            tone="secondary"
            class={cx(styles.cmpdlgPartState, styles.cmpdlgPartStateVariantErr)}
            role="alert"
          >
            <Glyph name="alert-circle" />
            <Text as="span" variant="body-sm" tone="inherit">
              {error()}
            </Text>
            <Show when={merged.onRetry}>
              {(retry) => (
                <Button variant="secondary" size="sm" iconLeft="refresh" onClick={() => retry()()}>
                  {translate('velvet.charts.comparisonDialog.tryAgain')}
                </Button>
              )}
            </Show>
          </Text>
        </Match>
        <Match when={merged.status === 'done'}>
          <div class={styles.cmpdlgPartBody}>
            <div class={styles.cmpdlgPartCols} style={{ '--n': merged.items.length }}>
              <For each={merged.items}>
                {(item, i) => (
                  <div class={styles.cmpdlgPartCol} style={{ '--c': colorAt(item, i()) }}>
                    <Avatar name={item.label} color="var(--c)" class="vui-cmpdlg__av" aria-hidden="true">
                      {item.avatar}
                    </Avatar>
                    <span class={styles.cmpdlgPartCt}>
                      <Text as="b" variant="label" tone="inherit">
                        {item.label}
                      </Text>
                      <Show when={item.description}>
                        {(description) => (
                          <Text as="small" variant="caption" tone="inherit">
                            {description()}
                          </Text>
                        )}
                      </Show>
                    </span>
                    <Show when={item.score !== undefined}>
                      <Text as="span" variant="title-lg" tone="inherit" class={styles.cmpdlgPartScore}>
                        {item.score}
                      </Text>
                    </Show>
                  </div>
                )}
              </For>
            </div>
            <Show when={hasRadar()}>
              <div class={styles.cmpdlgPartRadar}>
                <RadarChart
                  axes={merged.axes}
                  series={radarSeries()}
                  max={RADAR_MAX}
                  size={RADAR_SIZE}
                  label={radarLabel()}
                />
              </div>
            </Show>
            <Show when={merged.rows.length > 0}>
              <div class={styles.cmpdlgPartTablewrap}>
                <table class={styles.cmpdlgPartTable}>
                  <thead>
                    <tr>
                      <th scope="col">
                        <VisuallyHidden>{translate('velvet.charts.comparisonDialog.criterion')}</VisuallyHidden>
                      </th>
                      <For each={merged.items}>
                        {(item, i) => (
                          <th scope="col" style={{ '--c': colorAt(item, i()) }}>
                            <Text as="span" variant="label-sm" tone="inherit" class="vui-cmpdlg__th">
                              {item.label}
                            </Text>
                          </th>
                        )}
                      </For>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={merged.rows}>
                      {(row) => {
                        const best = () => bestIndexes(row.values, row.best);
                        return (
                          <tr>
                            <th scope="row">
                              <Text as="span" variant="label" tone="inherit">
                                {row.label}
                              </Text>
                              <Show when={row.hint}>
                                {(hint) => (
                                  <Text as="small" variant="caption" tone="inherit">
                                    {hint()}
                                  </Text>
                                )}
                              </Show>
                            </th>
                            <Index each={row.values}>
                              {(value, i) => (
                                <td class={cx(best().includes(i) && styles.cmpdlgPartBest)}>
                                  <Text
                                    as="span"
                                    variant={best().includes(i) ? 'label' : 'body-sm'}
                                    tone="inherit"
                                    tabular
                                  >
                                    {row.format ? row.format(value()) : (value() ?? '—')}
                                  </Text>
                                  <Show when={best().includes(i)}>
                                    <Glyph
                                      name="star-filled"
                                      label={translate('velvet.charts.comparisonDialog.best')}
                                    />
                                  </Show>
                                </td>
                              )}
                            </Index>
                          </tr>
                        );
                      }}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
            <Show when={insights() || merged.onGenerateInsights}>
              <section class={styles.cmpdlgPartIns} aria-live="polite">
                <Text as="h4" variant="section" tone="brand">
                  <Glyph name="sparkles" />
                  {translate('velvet.charts.comparisonDialog.insights')}
                </Text>
                <Switch>
                  <Match when={insights()}>
                    <Text as="div" variant="body-sm" tone="primary">
                      {insights()}
                    </Text>
                  </Match>
                  <Match when={merged.insightsStatus === 'loading'}>
                    <Text as="div" variant="body-sm" tone="brand" class={styles.cmpdlgPartInsload}>
                      <span class="vui-ai__pulse" aria-hidden="true" />
                      {translate('velvet.charts.comparisonDialog.writingInsights')}
                    </Text>
                  </Match>
                  <Match when={merged.onGenerateInsights}>
                    {(generate) => (
                      <Text as="div" variant="body-sm" tone="secondary" class={styles.cmpdlgPartInsempty}>
                        <Text as="span" variant="body-sm" tone="inherit">
                          {translate('velvet.charts.comparisonDialog.insightsPrompt')}
                        </Text>
                        <Button variant="soft" size="sm" iconLeft="sparkles" onClick={() => generate()()}>
                          {insightsLabel()}
                        </Button>
                      </Text>
                    )}
                  </Match>
                </Switch>
              </section>
            </Show>
          </div>
        </Match>
      </Switch>
    </Dialog>
  );
};
