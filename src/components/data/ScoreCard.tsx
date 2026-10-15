import { For, type JSX, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Badge } from '../display/Badge';
import { Card, type CardProps } from '../display/Card';
import { Progress, type ProgressTone } from '../feedback/Progress';
import { ProgressRing } from '../feedback/ProgressRing';
import { Text } from '../primitives/Text';
import styles from './ScoreCard.module.css';

const SUCCESS_FROM = 75;
const WARNING_FROM = 50;

/** The status tones the Progress family can paint (no neutral: a score always reads as good, middling or bad). */
export type ScoreTone = Exclude<ProgressTone, 'neutral'>;

export interface ScoreCriterion {
  label: JSX.Element;
  /** 0–100 */
  value: number;
  tone?: ScoreTone;
}

export interface ScoreCardProps extends HtmlProps<HTMLElement, 'title'> {
  label: JSX.Element;
  /** 0–100 */
  score: number;
  /** Short verdict, e.g. 'Strong match'. */
  verdict?: string;
  hint?: JSX.Element;
  criteria?: ScoreCriterion[];
  /** Follows the score (≥75 success, ≥50 warning, else danger) unless set. */
  tone?: ScoreTone;
  /** Card pass-through. */
  padding?: CardProps['padding'];
  variant?: CardProps['variant'];
  accent?: CardProps['accent'];
  hoverable?: CardProps['hoverable'];
  tonal?: CardProps['tonal'];
  reveal?: CardProps['reveal'];
}

const toneOf = (score: number, tone: ScoreTone | undefined): ScoreTone =>
  tone ?? (score >= SUCCESS_FROM ? 'success' : score >= WARNING_FROM ? 'warning' : 'danger');

/** Result card for a computed score (ATS match, quiz result, health check): ring + verdict badge + per-criterion bars. For a single KPI use Stat. */
export const ScoreCard = (props: ScoreCardProps) => {
  const [local, rest] = splitProps(props, ['label', 'score', 'verdict', 'hint', 'criteria', 'tone', 'class']);
  const translate = useTranslate();
  const tone = () => toneOf(local.score, local.tone);
  return (
    <Card {...rest} tone={tone()} class={cx(styles.score, local.class)} bodyClass={styles.cardBody}>
      <div class={styles.scorePartTop}>
        <ProgressRing
          value={local.score}
          size={72}
          stroke={6}
          tone={tone()}
          label={typeof local.label === 'string' ? local.label : translate('velvet.data.scoreCard.label')}
        />
        <div class={styles.scorePartMeta}>
          <Text as="div" variant="body-sm" tone="secondary" class="vui-score__label">
            {local.label}
          </Text>
          <Show when={local.verdict}>
            {(verdict) => (
              <Badge tone={tone()} size="sm">
                {verdict()}
              </Badge>
            )}
          </Show>
          <Show when={local.hint}>
            {(hint) => (
              <Text as="div" variant="caption" tone="tertiary" class="vui-score__hint">
                {hint()}
              </Text>
            )}
          </Show>
        </div>
      </div>
      <Show when={local.criteria?.length}>
        <div class={styles.scorePartCriteria}>
          <For each={local.criteria}>
            {(criterion) => (
              <Progress
                size="sm"
                label={criterion.label}
                value={criterion.value}
                showValue
                tone={toneOf(criterion.value, criterion.tone)}
              />
            )}
          </For>
        </div>
      </Show>
    </Card>
  );
};
