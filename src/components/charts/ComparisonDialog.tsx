import { children, For, Index, type JSX, Match, mergeProps, Show, Switch } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Avatar } from '../data/Avatar';
import { Dialog, type DialogProps } from '../feedback/Dialog';
import { Spinner } from '../feedback/Spinner';
import { Glyph } from '../primitives/Glyph';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import { seriesColor } from './chartScale';
import { bestIndexes, type ComparisonItem, type ComparisonRow } from './comparison';
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
      class="vui-cmpdlg"
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
          <div class="vui-cmpdlg__state" aria-busy="true">
            <Spinner size="lg" label={translate('velvet.charts.comparisonDialog.comparingLabel')} />
            <span>{translate('velvet.charts.comparisonDialog.comparing', { count: merged.items.length })}</span>
          </div>
        </Match>
        <Match when={merged.status === 'error'}>
          <div class="vui-cmpdlg__state vui-cmpdlg__state--err" role="alert">
            <Glyph name="alert-circle" />
            <span>{error()}</span>
            <Show when={merged.onRetry}>
              {(retry) => (
                <Button variant="secondary" size="sm" iconLeft="refresh" onClick={() => retry()()}>
                  {translate('velvet.charts.comparisonDialog.tryAgain')}
                </Button>
              )}
            </Show>
          </div>
        </Match>
        <Match when={merged.status === 'done'}>
          <div class="vui-cmpdlg__body">
            <div class="vui-cmpdlg__cols" style={{ '--n': merged.items.length }}>
              <For each={merged.items}>
                {(item, i) => (
                  <div class="vui-cmpdlg__col" style={{ '--c': colorAt(item, i()) }}>
                    <Avatar name={item.label} color="var(--c)" class="vui-cmpdlg__av" aria-hidden="true">
                      {item.avatar}
                    </Avatar>
                    <span class="vui-cmpdlg__ct">
                      <b>{item.label}</b>
                      <Show when={item.description}>{(description) => <small>{description()}</small>}</Show>
                    </span>
                    <Show when={item.score !== undefined}>
                      <span class="vui-cmpdlg__score">{item.score}</span>
                    </Show>
                  </div>
                )}
              </For>
            </div>
            <Show when={hasRadar()}>
              <div class="vui-cmpdlg__radar">
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
              <div class="vui-cmpdlg__tablewrap">
                <table class="vui-cmpdlg__table">
                  <thead>
                    <tr>
                      <th scope="col">
                        <VisuallyHidden>{translate('velvet.charts.comparisonDialog.criterion')}</VisuallyHidden>
                      </th>
                      <For each={merged.items}>
                        {(item, i) => (
                          <th scope="col" style={{ '--c': colorAt(item, i()) }}>
                            <span class="vui-cmpdlg__th">{item.label}</span>
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
                              {row.label}
                              <Show when={row.hint}>{(hint) => <small>{hint()}</small>}</Show>
                            </th>
                            <Index each={row.values}>
                              {(value, i) => (
                                <td class={cx(best().includes(i) && 'vui-cmpdlg__best')}>
                                  {row.format ? row.format(value()) : (value() ?? '—')}
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
              <section class="vui-cmpdlg__ins" aria-live="polite">
                <h4>
                  <Glyph name="sparkles" />
                  {translate('velvet.charts.comparisonDialog.insights')}
                </h4>
                <Switch>
                  <Match when={insights()}>
                    <div class="vui-cmpdlg__instext">{insights()}</div>
                  </Match>
                  <Match when={merged.insightsStatus === 'loading'}>
                    <div class="vui-cmpdlg__insload">
                      <span class="vui-ai__pulse" aria-hidden="true" />
                      {translate('velvet.charts.comparisonDialog.writingInsights')}
                    </div>
                  </Match>
                  <Match when={merged.onGenerateInsights}>
                    {(generate) => (
                      <div class="vui-cmpdlg__insempty">
                        <span>{translate('velvet.charts.comparisonDialog.insightsPrompt')}</span>
                        <Button variant="soft" size="sm" iconLeft="sparkles" onClick={() => generate()()}>
                          {insightsLabel()}
                        </Button>
                      </div>
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
