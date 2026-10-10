import { createMemo, createSignal, For, type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { CopyButton } from '../actions/CopyButton';
import { Badge } from '../display/Badge';
import { ProgressRing } from '../feedback/ProgressRing';
import { Glyph } from '../primitives/Glyph';
import { Meter } from '../primitives/Meter';
import { SectionLabel } from '../primitives/SectionLabel';
import type { AiFeedback } from './AiResultPanel';
import {
  type AtsResult,
  clampScore,
  MAX_SCORE,
  type ScoreBand,
  scoreBand,
  SEVERITY,
  SEVERITY_ORDER,
} from './atsAnalysis';
import { AtsKeywordList } from './AtsKeywordList';
import { AtsRecommendationList } from './AtsRecommendationList';
import { plainText } from './plainText';

export interface AtsResultViewProps {
  result: AtsResult;
  title: string;
  bands: readonly ScoreBand[];
  disclaimer?: JSX.Element;
  /** Panel header (badge, subject → target, provenance). */
  header: JSX.Element;
  onExport?: () => void;
  onRerun?: () => void;
  onFeedback?: (value: AiFeedback) => void;
  class?: string;
}

const RING_SIZE = 112;
const RING_STROKE = 9;

/** The finished-analysis body of AtsAnalysisPanel: score hero, breakdown, keywords, strengths / gaps, recommendations and footer tools. */
export const AtsResultView = (props: AtsResultViewProps) => {
  const translate = useTranslate();
  const [vote, setVote] = createSignal<AiFeedback>(null);
  const band = createMemo(() => scoreBand(props.result.score, props.bands));
  const rounded = () => Math.round(clampScore(props.result.score));
  const categories = createMemo(() =>
    (props.result.categories ?? []).map((category) => ({ ...category, score: clampScore(category.score) })),
  );
  const recommendations = createMemo(() =>
    [...(props.result.recommendations ?? [])].sort(
      (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity),
    ),
  );
  const tally = createMemo(() =>
    SEVERITY_ORDER.map((severity) => ({
      severity,
      count: recommendations().filter((r) => r.severity === severity).length,
    })).filter((entry) => entry.count > 0),
  );
  const matched = () => props.result.keywords?.matched ?? [];
  const partial = () => props.result.keywords?.partial ?? [];
  const missing = () => props.result.keywords?.missing ?? [];
  const hasKeywords = () => matched().length + partial().length + missing().length > 0;
  const strengths = () => props.result.strengths ?? [];
  const gaps = () => props.result.gaps ?? [];
  const plain = () =>
    [
      translate('velvet.patterns.atsResultView.summary', {
        title: props.title,
        score: rounded(),
        max: MAX_SCORE,
        band: band().label,
      }),
      plainText(props.result.verdict),
      plainText(props.result.summary),
      categories()
        .map((c) => `${c.label}: ${c.score}`)
        .join('\n'),
      strengths()
        .map((s) => `+ ${plainText(s)}`)
        .join('\n'),
      gaps()
        .map((s) => `− ${plainText(s)}`)
        .join('\n'),
      recommendations()
        .map(
          (r) =>
            `[${translate(SEVERITY[r.severity].labelKey)}] ${plainText(r.title)}${r.message ? ` — ${plainText(r.message)}` : ''}`,
        )
        .join('\n'),
    ]
      .filter(Boolean)
      .join('\n\n');
  const toggleVote = (value: 'up' | 'down') => {
    const next = vote() === value ? null : value;
    setVote(next);
    props.onFeedback?.(next);
  };

  return (
    <article class={cx('vui-ats', props.class)} data-band={band().tone}>
      {props.header}
      <div class="vui-ats__body">
        <div class="vui-ats__hero">
          <ProgressRing
            value={clampScore(props.result.score)}
            size={RING_SIZE}
            stroke={RING_STROKE}
            tone={band().tone}
            role="img"
            label={translate('velvet.patterns.atsResultView.scoreLabel', { score: rounded(), max: MAX_SCORE })}
            class="vui-ats__ring"
          >
            <span class="vui-ats__score" aria-hidden="true">
              {rounded()}
              <small>/{MAX_SCORE}</small>
            </span>
          </ProgressRing>
          <div class="vui-ats__verdict">
            <Badge tone={band().tone} class="vui-ats__band">
              {band().label}
            </Badge>
            <Show when={props.result.verdict}>
              <h3 class="vui-ats__vh">{props.result.verdict}</h3>
            </Show>
            <Show when={props.result.summary}>
              <p class="vui-ats__sum">{props.result.summary}</p>
            </Show>
            <Show when={tally().length > 0}>
              <div class="vui-ats__tally">
                <For each={tally()}>
                  {(entry) => (
                    <span class={`vui-ats__tchip vui-ats__tchip--${SEVERITY[entry.severity].tone}`}>
                      <Glyph name={SEVERITY[entry.severity].icon} />
                      {translate(SEVERITY[entry.severity].tallyKey, { count: entry.count })}
                    </span>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
        <Show when={categories().length > 0}>
          <section class="vui-ats__sec">
            <SectionLabel as="h4" class="vui-ats__h">
              {translate('velvet.patterns.atsResultView.breakdown')}
            </SectionLabel>
            <ul class="vui-ats__cats">
              <For each={categories()}>
                {(category) => {
                  const categoryBand = () => scoreBand(category.score, props.bands);
                  return (
                    <li class="vui-ats__cat">
                      <div class="vui-ats__cath">
                        <span class="vui-ats__catl">
                          {category.label}
                          <Show when={category.weight != null}>
                            <small>×{category.weight}</small>
                          </Show>
                        </span>
                        <span class={`vui-ats__catv vui-ats__catv--${categoryBand().tone}`}>
                          {Math.round(category.score)}
                        </span>
                      </div>
                      <Meter
                        value={category.score}
                        tone={categoryBand().tone === 'brand' ? undefined : categoryBand().tone}
                        label={category.label}
                        class="vui-ats__bar"
                      />
                      <Show when={category.note}>
                        <span class="vui-ats__catn">{category.note}</span>
                      </Show>
                    </li>
                  );
                }}
              </For>
            </ul>
          </section>
        </Show>
        <Show when={hasKeywords()}>
          <AtsKeywordList matched={matched()} partial={partial()} missing={missing()} />
        </Show>
        <Show when={strengths().length > 0 || gaps().length > 0}>
          <div class="vui-ats__sg">
            <Show when={strengths().length > 0}>
              <section class="vui-ats__sgcol vui-ats__sgcol--pos">
                <SectionLabel as="h4" class="vui-ats__h" icon="thumbs-up">
                  {translate('velvet.patterns.atsResultView.strengths')}
                </SectionLabel>
                <ul>
                  <For each={strengths()}>{(item) => <li>{item}</li>}</For>
                </ul>
              </section>
            </Show>
            <Show when={gaps().length > 0}>
              <section class="vui-ats__sgcol vui-ats__sgcol--neg">
                <SectionLabel as="h4" class="vui-ats__h" icon="target">
                  {translate('velvet.patterns.atsResultView.gaps')}
                </SectionLabel>
                <ul>
                  <For each={gaps()}>{(item) => <li>{item}</li>}</For>
                </ul>
              </section>
            </Show>
          </div>
        </Show>
        <Show when={recommendations().length > 0}>
          <AtsRecommendationList recommendations={recommendations()} />
        </Show>
        <Show when={props.disclaimer}>
          <p class="vui-ai__disclaimer">{props.disclaimer}</p>
        </Show>
      </div>
      <footer class="vui-ai__foot">
        <CopyButton value={plain} variant="ghost" size="sm" />
        <Show when={props.onExport}>
          <Button variant="ghost" size="sm" iconLeft="download" onClick={() => props.onExport?.()}>
            {translate('velvet.patterns.atsResultView.export')}
          </Button>
        </Show>
        <Show when={props.onRerun}>
          <Button variant="ghost" size="sm" iconLeft="refresh" onClick={() => props.onRerun?.()}>
            {translate('velvet.patterns.atsResultView.rerun')}
          </Button>
        </Show>
        <Show when={props.onFeedback}>
          <span class="vui-ai__fb" role="group" aria-label={translate('velvet.patterns.atsResultView.feedbackLabel')}>
            <span>{translate('velvet.patterns.atsResultView.accurate')}</span>
            <Button variant="ghost" size="sm" aria-pressed={vote() === 'up'} onClick={() => toggleVote('up')}>
              {translate('velvet.common.yes')}
            </Button>
            <Button variant="ghost" size="sm" aria-pressed={vote() === 'down'} onClick={() => toggleVote('down')}>
              {translate('velvet.common.no')}
            </Button>
          </span>
        </Show>
      </footer>
    </article>
  );
};
