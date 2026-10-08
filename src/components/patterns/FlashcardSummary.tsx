import type { I18nKey } from '@jankrajewskiit/i18n';
import { mergeProps, Show } from 'solid-js';

import { useTranslate, useTranslateRich } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import type { ProgressTone } from '../feedback/Progress';
import { ProgressRing } from '../feedback/ProgressRing';
import { FLASH_SUCCESS_PERCENT, FLASH_WARNING_PERCENT, type FlashResult } from './flashcard';

export interface FlashcardSummaryProps {
  results: FlashResult[];
  onRestart?: () => void;
  onReviewMissed?: () => void;
  onDone?: () => void;
  class?: string;
}

const EXCELLENT_PERCENT = 90;

const verdictKey = (percent: number): I18nKey => {
  if (percent >= EXCELLENT_PERCENT) return 'velvet.patterns.flashcardSummary.verdicts.excellent';
  if (percent >= FLASH_SUCCESS_PERCENT) return 'velvet.patterns.flashcardSummary.verdicts.solid';
  if (percent >= FLASH_WARNING_PERCENT) return 'velvet.patterns.flashcardSummary.verdicts.gettingThere';
  return 'velvet.patterns.flashcardSummary.verdicts.keepPracticing';
};

const ringTone = (percent: number): ProgressTone => {
  if (percent >= FLASH_SUCCESS_PERCENT) return 'success';
  if (percent >= FLASH_WARNING_PERCENT) return 'warning';
  return 'danger';
};

/** End-of-session result: accuracy ring, known / to-review counts, restart and review-missed actions. */
export const FlashcardSummary = (props: FlashcardSummaryProps) => {
  const p = mergeProps({ results: [] as FlashResult[] } satisfies Partial<FlashcardSummaryProps>, props);
  const translate = useTranslate();
  const translateRich = useTranslateRich();
  const known = () => p.results.filter((result) => result.known).length;
  const missed = () => p.results.length - known();
  const total = () => p.results.length || 1;
  const percent = () => Math.round((known() / total()) * 100);

  return (
    <div class={cx('vui-surface', 'vui-fc-summary', p.class)}>
      <ProgressRing value={known()} max={total()} size={112} stroke={9} tone={ringTone(percent())} />
      <div class="vui-fc-summary__h">{translate('velvet.patterns.flashcardSummary.title')}</div>
      <p class="vui-fc-summary__p">
        {translateRich('velvet.patterns.flashcardSummary.summary', {
          known: known(),
          total: p.results.length,
          verdict: translate(verdictKey(percent())),
          b: (children) => <b>{children}</b>,
        })}
      </p>
      <div class="vui-fc-summary__stats">
        <div>
          <b>{known()}</b>
          <span>{translate('velvet.patterns.flashcardSummary.known')}</span>
        </div>
        <div>
          <b>{missed()}</b>
          <span>{translate('velvet.patterns.flashcardSummary.toReview')}</span>
        </div>
        <div>
          <b>{percent()}%</b>
          <span>{translate('velvet.patterns.flashcardSummary.accuracy')}</span>
        </div>
      </div>
      <div class="vui-fc-summary__actions">
        <Show when={p.onReviewMissed && missed() > 0}>
          <Button variant="secondary" onClick={() => p.onReviewMissed?.()}>
            {translate('velvet.patterns.flashcardSummary.reviewMissed', { count: missed() })}
          </Button>
        </Show>
        <Show when={p.onRestart}>
          <Button iconLeft="rotate-ccw" onClick={() => p.onRestart?.()}>
            {translate('velvet.patterns.flashcardSummary.practiceAgain')}
          </Button>
        </Show>
        <Show when={p.onDone}>
          <Button variant="ghost" onClick={() => p.onDone?.()}>
            {translate('velvet.patterns.flashcardSummary.done')}
          </Button>
        </Show>
      </div>
    </div>
  );
};
