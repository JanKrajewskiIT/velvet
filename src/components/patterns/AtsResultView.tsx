import { createMemo, createSignal, For, type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { CopyButton } from '../actions/CopyButton';
import { Badge } from '../display/Badge';
import { ProgressRing } from '../feedback/ProgressRing';
import { Glyph } from '../primitives/Glyph';
import { Heading } from '../primitives/Heading';
import { Meter } from '../primitives/Meter';
import { SectionLabel } from '../primitives/SectionLabel';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
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
import styles from './AtsResultView.module.css';
import { plainText } from './plainText';

const ATS_PART_TCHIP_CLASSES = {
  danger: styles.atsPartTchipVariantDanger,
  warning: styles.atsPartTchipVariantWarning,
  info: styles.atsPartTchipVariantInfo,
} as const;

const ATS_PART_CATV_CLASSES = {
  success: styles.atsPartCatvVariantSuccess,
  brand: styles.atsPartCatvVariantBrand,
  warning: styles.atsPartCatvVariantWarning,
  danger: styles.atsPartCatvVariantDanger,
} as const;

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
    <article class={cx(typographyClass('body'), styles.ats, props.class)} data-band={band().tone}>
      {props.header}
      <div class={styles.atsPartBody}>
        <div class={styles.atsPartHero}>
          <ProgressRing
            value={clampScore(props.result.score)}
            size={RING_SIZE}
            stroke={RING_STROKE}
            tone={band().tone}
            role="img"
            label={translate('velvet.patterns.atsResultView.scoreLabel', { score: rounded(), max: MAX_SCORE })}
            class={styles.atsPartRing}
          >
            <Text as="span" variant="kpi" tone="inherit" class={styles.atsPartScore} aria-hidden="true">
              {rounded()}
              <Text as="small" variant="label-sm" tone="inherit">
                /{MAX_SCORE}
              </Text>
            </Text>
          </ProgressRing>
          <div class={styles.atsPartVerdict}>
            <Badge tone={band().tone} class="vui-ats__band">
              {band().label}
            </Badge>
            <Show when={props.result.verdict}>
              <Heading level={3} variant="title-lg" class={styles.atsPartVh}>
                {props.result.verdict}
              </Heading>
            </Show>
            <Show when={props.result.summary}>
              <Text as="p" variant="body-sm" tone="secondary" class={styles.atsPartSum}>
                {props.result.summary}
              </Text>
            </Show>
            <Show when={tally().length > 0}>
              <div class={styles.atsPartTally}>
                <For each={tally()}>
                  {(entry) => (
                    <Text
                      as="span"
                      variant="caption"
                      tone="secondary"
                      class={cx(
                        styles.atsPartTchip,
                        variantClass(ATS_PART_TCHIP_CLASSES, SEVERITY[entry.severity].tone),
                      )}
                    >
                      <Glyph name={SEVERITY[entry.severity].icon} />
                      {translate(SEVERITY[entry.severity].tallyKey, { count: entry.count })}
                    </Text>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
        <Show when={categories().length > 0}>
          <section class={styles.atsPartSec}>
            <SectionLabel as="h4" class={styles.atsPartH}>
              {translate('velvet.patterns.atsResultView.breakdown')}
            </SectionLabel>
            <ul class={styles.atsPartCats}>
              <For each={categories()}>
                {(category) => {
                  const categoryBand = () => scoreBand(category.score, props.bands);
                  return (
                    <li class={styles.atsPartCat}>
                      <div class={styles.atsPartCath}>
                        <Text as="span" variant="label" tone="inherit" class={styles.atsPartCatl}>
                          {category.label}
                          <Show when={category.weight != null}>
                            <Text as="small" variant="micro" tone="inherit">
                              ×{category.weight}
                            </Text>
                          </Show>
                        </Text>
                        <Text
                          as="span"
                          variant="label"
                          mono
                          tabular
                          tone="inherit"
                          class={cx(styles.atsPartCatv, variantClass(ATS_PART_CATV_CLASSES, categoryBand().tone))}
                        >
                          {Math.round(category.score)}
                        </Text>
                      </div>
                      <Meter
                        value={category.score}
                        tone={categoryBand().tone === 'brand' ? undefined : categoryBand().tone}
                        label={category.label}
                        class={styles.atsPartBar}
                      />
                      <Show when={category.note}>
                        <Text as="span" variant="caption" tone="inherit" class={styles.atsPartCatn}>
                          {category.note}
                        </Text>
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
          <div class={styles.atsPartSg}>
            <Show when={strengths().length > 0}>
              <section class={cx(styles.atsPartSgcol, styles.atsPartSgcolVariantPos)}>
                <SectionLabel as="h4" class={styles.atsPartH} icon="thumbs-up">
                  {translate('velvet.patterns.atsResultView.strengths')}
                </SectionLabel>
                <ul>
                  <For each={strengths()}>
                    {(item) => (
                      <Text as="li" variant="body-sm" tone="inherit">
                        {item}
                      </Text>
                    )}
                  </For>
                </ul>
              </section>
            </Show>
            <Show when={gaps().length > 0}>
              <section class={cx(styles.atsPartSgcol, styles.atsPartSgcolVariantNeg)}>
                <SectionLabel as="h4" class={styles.atsPartH} icon="target">
                  {translate('velvet.patterns.atsResultView.gaps')}
                </SectionLabel>
                <ul>
                  <For each={gaps()}>
                    {(item) => (
                      <Text as="li" variant="body-sm" tone="inherit">
                        {item}
                      </Text>
                    )}
                  </For>
                </ul>
              </section>
            </Show>
          </div>
        </Show>
        <Show when={recommendations().length > 0}>
          <AtsRecommendationList recommendations={recommendations()} />
        </Show>
        <Show when={props.disclaimer}>
          <Text as="p" variant="overline" tone="inherit" class={styles.aiPartDisclaimer}>
            {props.disclaimer}
          </Text>
        </Show>
      </div>
      <footer class={styles.aiPartFoot}>
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
          <Text
            as="span"
            variant="caption"
            tone="tertiary"
            class={styles.aiPartFb}
            role="group"
            aria-label={translate('velvet.patterns.atsResultView.feedbackLabel')}
          >
            <Text as="span" variant="button-sm" tone="inherit">
              {translate('velvet.patterns.atsResultView.accurate')}
            </Text>
            <Button variant="ghost" size="sm" aria-pressed={vote() === 'up'} onClick={() => toggleVote('up')}>
              {translate('velvet.common.yes')}
            </Button>
            <Button variant="ghost" size="sm" aria-pressed={vote() === 'down'} onClick={() => toggleVote('down')}>
              {translate('velvet.common.no')}
            </Button>
          </Text>
        </Show>
      </footer>
    </article>
  );
};
