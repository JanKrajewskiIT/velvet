import { createMemo, type JSX, Match, mergeProps, Show, Switch } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { Skeleton } from '../feedback/Skeleton';
import { SkeletonText } from '../feedback/SkeletonText';
import { Glyph } from '../primitives/Glyph';
import { IconTile } from '../primitives/IconTile';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import type { AiFeedback } from './AiResultPanel';
import { AnalysisSteps } from './AnalysisSteps';
import { type AtsResult, localizeScoreBands, type ScoreBand } from './atsAnalysis';
import styles from './AtsAnalysisPanel.module.css';
import { AtsResultView } from './AtsResultView';

export interface AtsAnalysisPanelProps {
  /** @default 'done' */
  status?: 'empty' | 'loading' | 'done' | 'error';
  result?: AtsResult | null;
  /** e.g. candidate name */
  subject?: JSX.Element;
  /** e.g. role title */
  target?: JSX.Element;
  /** @default localized "Match analysis" */
  title?: string;
  model?: string;
  generatedAt?: string;
  /** Loading progress labels + current index */
  steps?: string[];
  step?: number;
  /** @default localized "The analysis didn’t finish. Your inputs are kept — try again." */
  error?: JSX.Element;
  onRetry?: () => void;
  onRerun?: () => void;
  onExport?: () => void;
  onFeedback?: (value: AiFeedback) => void;
  /** Override thresholds / labels. @default localized SCORE_BANDS */
  bands?: readonly ScoreBand[];
  /** @default localized "AI-generated assessment — use it to support, not replace, your judgement." */
  disclaimer?: JSX.Element;
  class?: string;
}

const HERO_SKELETON_SIZE = 112;

/** Result of a candidate ↔ role (or CV ↔ ATS) analysis: score ring and band, weighted categories, keyword coverage, strengths vs gaps and ranked recommendations. */
export const AtsAnalysisPanel = (props: AtsAnalysisPanelProps) => {
  const p = mergeProps({ status: 'done', steps: [] as string[], step: 0 } satisfies AtsAnalysisPanelProps, props);
  const translate = useTranslate();
  const title = () => p.title ?? translate('velvet.patterns.atsAnalysisPanel.title');
  const error = () => p.error ?? translate('velvet.patterns.atsAnalysisPanel.error');
  const bands = createMemo(() => p.bands ?? localizeScoreBands(translate));
  const disclaimer = () => p.disclaimer ?? translate('velvet.patterns.atsAnalysisPanel.disclaimer');

  const header = () => (
    <header class={styles.atsPartHead}>
      <Badge tone="brand" class="vui-ai__chip" dot={p.status === 'loading'} pulse icon="sparkles">
        {p.status === 'loading' ? translate('velvet.patterns.atsAnalysisPanel.analysing') : title()}
      </Badge>
      <Show when={p.subject || p.target}>
        <Text as="span" variant="body-sm" tone="secondary" class={styles.atsPartPair}>
          <Show when={p.subject}>
            <Text as="b" variant="label" tone="inherit">
              {p.subject}
            </Text>
          </Show>
          <Show when={p.subject && p.target}>
            <Glyph name="arrow-right" />
          </Show>
          <Show when={p.target}>
            <Text as="span" variant="body-sm" tone="inherit">
              {p.target}
            </Text>
          </Show>
        </Text>
      </Show>
      <Show when={p.model || p.generatedAt}>
        <Text as="span" variant="kbd" tone="inherit" class={styles.aiPartProv}>
          {[p.model, p.generatedAt].filter(Boolean).join(' · ')}
        </Text>
      </Show>
    </header>
  );

  return (
    <Switch>
      <Match when={p.status === 'error'}>
        <article class={cx(typographyClass('body'), styles.ats, p.class)}>
          {header()}
          <div class={styles.atsPartState} role="alert">
            <IconTile size="xl" shape="circle" tone="danger" icon="alert-circle" />
            <div>
              <Text as="b" variant="label" tone="inherit">
                {translate('velvet.patterns.atsAnalysisPanel.failed')}
              </Text>
              <Text as="p" variant="body-sm" tone="inherit">
                {error()}
              </Text>
            </div>
            <Show when={p.onRetry}>
              <Button variant="secondary" size="sm" iconLeft="refresh" onClick={() => p.onRetry?.()}>
                {translate('velvet.patterns.atsAnalysisPanel.retry')}
              </Button>
            </Show>
          </div>
        </article>
      </Match>
      <Match when={p.status === 'loading'}>
        <article class={cx(typographyClass('body'), styles.ats, p.class)} aria-busy="true">
          {header()}
          <div class={styles.atsPartBody}>
            <div class={styles.atsPartHero}>
              <Skeleton circle height={HERO_SKELETON_SIZE} />
              <div style={{ flex: 1, display: 'grid', gap: 'var(--space-2)' }}>
                <Skeleton width="40%" height={18} />
                <Skeleton width="80%" height={12} />
                <Skeleton width="65%" height={12} />
              </div>
            </div>
            <Show when={p.steps.length > 0} fallback={<SkeletonText lines={4} />}>
              <AnalysisSteps steps={p.steps} step={p.step} />
            </Show>
          </div>
        </article>
      </Match>
      <Match when={p.status === 'empty' || !p.result}>
        <article class={cx(typographyClass('body'), styles.ats, p.class)}>
          {header()}
          <div class={styles.atsPartState}>
            <IconTile size="xl" shape="circle" tone="brand" icon="target" />
            <div>
              <Text as="b" variant="label" tone="inherit">
                {translate('velvet.patterns.atsAnalysisPanel.emptyTitle')}
              </Text>
              <Text as="p" variant="body-sm" tone="inherit">
                {translate('velvet.patterns.atsAnalysisPanel.emptyDescription')}
              </Text>
            </div>
          </div>
        </article>
      </Match>
      <Match when={p.result}>
        {(result) => (
          <AtsResultView
            result={result()}
            title={title()}
            bands={bands()}
            disclaimer={disclaimer()}
            header={header()}
            onExport={p.onExport}
            onRerun={p.onRerun}
            onFeedback={p.onFeedback}
            class={p.class}
          />
        )}
      </Match>
    </Switch>
  );
};
