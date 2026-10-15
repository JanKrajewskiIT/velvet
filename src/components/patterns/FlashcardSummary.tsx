import type { I18nKey } from '@jankrajewskiit/i18n';
import { mergeProps, Show } from 'solid-js';

import { useTranslate, useTranslateRich } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import type { ProgressTone } from '../feedback/Progress';
import { ProgressRing } from '../feedback/ProgressRing';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';
import { FLASH_SUCCESS_PERCENT, FLASH_WARNING_PERCENT, type FlashResult } from './flashcard';
import styles from './FlashcardSummary.module.css';

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
    <div class={cx(styles.surface, styles.fcSummary, p.class)}>
      <ProgressRing value={known()} max={total()} size={112} stroke={9} tone={ringTone(percent())} />
      <Heading level={3} variant="h4" class={styles.fcSummaryPartH}>
        {translate('velvet.patterns.flashcardSummary.title')}
      </Heading>
      <Text as="p" variant="body-sm" tone="secondary" class={styles.fcSummaryPartP}>
        {translateRich('velvet.patterns.flashcardSummary.summary', {
          known: known(),
          total: p.results.length,
          verdict: translate(verdictKey(percent())),
          b: (children) => (
            <Text as="b" variant="label" tone="inherit">
              {children}
            </Text>
          ),
        })}
      </Text>
      <div class={styles.fcSummaryPartStats}>
        <div>
          <Text as="b" variant="title-lg" tone="inherit" tabular>
            {known()}
          </Text>
          <Text as="span" variant="overline" tone="tertiary">
            {translate('velvet.patterns.flashcardSummary.known')}
          </Text>
        </div>
        <div>
          <Text as="b" variant="title-lg" tone="inherit" tabular>
            {missed()}
          </Text>
          <Text as="span" variant="overline" tone="tertiary">
            {translate('velvet.patterns.flashcardSummary.toReview')}
          </Text>
        </div>
        <div>
          <Text as="b" variant="title-lg" tone="inherit" tabular>
            {percent()}%
          </Text>
          <Text as="span" variant="overline" tone="tertiary">
            {translate('velvet.patterns.flashcardSummary.accuracy')}
          </Text>
        </div>
      </div>
      <div class={styles.fcSummaryPartActions}>
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
