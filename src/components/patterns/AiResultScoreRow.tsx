import { type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { ProgressRing } from '../feedback/ProgressRing';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';
import { resolveScoreTone, RING_SIZE } from './aiResultFormat';
import styles from './AiResultScoreRow.module.css';
import type { AiScoreTone } from './aiResultTypes';

const RING_STROKE = 6;

export interface AiResultScoreRowProps {
  score?: number;
  max: number;
  tone?: AiScoreTone;
  headline?: JSX.Element;
  subline?: JSX.Element;
}

/** Score ring beside the headline and subline. */
export const AiResultScoreRow = (props: AiResultScoreRowProps) => {
  const translate = useTranslate();
  const hasScore = () => props.score != null;
  const score = () => props.score ?? 0;
  const tone = () => resolveScoreTone(props.tone, score(), props.max);

  return (
    <Show when={hasScore() || props.headline}>
      <div class={styles.aiPartScoreRow}>
        <Show when={hasScore()}>
          <ProgressRing
            value={score()}
            max={props.max}
            size={RING_SIZE}
            stroke={RING_STROKE}
            tone={tone()}
            role="img"
            label={translate('velvet.patterns.aiResultPanel.scoreLabel', { score: score(), max: props.max })}
          >
            <Text as="span" variant="h4" tone="inherit" class={styles.ringPartValue} aria-hidden="true">
              {score()}
            </Text>
          </ProgressRing>
        </Show>
        <div style={{ 'min-width': 0 }}>
          <Show when={props.headline}>
            <Heading level={3} variant="title" class={styles.aiPartHeadline}>
              {props.headline}
            </Heading>
          </Show>
          <Show when={props.subline}>
            <Text as="div" variant="body-sm" tone="secondary" class={styles.aiPartSubline}>
              {props.subline}
            </Text>
          </Show>
        </div>
      </div>
    </Show>
  );
};
