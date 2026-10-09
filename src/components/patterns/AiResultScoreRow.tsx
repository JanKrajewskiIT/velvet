import { type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { ProgressRing } from '../feedback/ProgressRing';
import { resolveScoreTone, RING_SIZE } from './aiResultFormat';
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
      <div class="vui-ai__score-row">
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
            <span class="vui-ring__value vui-ai__score" aria-hidden="true">
              {score()}
            </span>
          </ProgressRing>
        </Show>
        <div style={{ 'min-width': 0 }}>
          <Show when={props.headline}>
            <h3 class="vui-ai__headline">{props.headline}</h3>
          </Show>
          <Show when={props.subline}>
            <div class="vui-ai__subline">{props.subline}</div>
          </Show>
        </div>
      </div>
    </Show>
  );
};
