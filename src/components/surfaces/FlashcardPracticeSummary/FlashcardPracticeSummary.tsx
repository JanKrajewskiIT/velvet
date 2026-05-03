import { createMemo, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import ActionRow from '~/components/forms/ActionRow/ActionRow';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './FlashcardPracticeSummary.module.css';

interface FlashcardPracticeSummaryResult {
  known: boolean;
}

interface FlashcardPracticeSummaryProps<T extends FlashcardPracticeSummaryResult> {
  results: readonly T[];
  title: string;
  onRestart: () => void;
  onBack?: () => void;
}

const FlashcardPracticeSummary = <T extends FlashcardPracticeSummaryResult>(
  props: Props<FlashcardPracticeSummaryProps<T>>,
) => {
  const { ts } = useI18n();
  const knownCount = createMemo(() => props.results.filter((result) => result.known).length);
  const unknownCount = createMemo(() => props.results.length - knownCount());
  const percentage = createMemo(() =>
    props.results.length > 0 ? Math.round((knownCount() / props.results.length) * 100) : 0,
  );

  return (
    <div class={classNames(styles.summary, props.class)}>
      <Heading level={2} variant="h2">
        {props.title}
      </Heading>
      <Heading as="span" level={1} variant="h1" class={styles.percentage}>
        {percentage()}%
      </Heading>
      <div class={styles.stats}>
        <div class={styles.stat}>
          <Text as="span" class={classNames(styles.statValue, styles.known)}>
            {knownCount()}
          </Text>
          <Text as="span" variant="bodySm" tone="muted">
            {ts('flashcard.known')}
          </Text>
        </div>
        <div class={styles.stat}>
          <Text as="span" class={classNames(styles.statValue, styles.unknown)}>
            {unknownCount()}
          </Text>
          <Text as="span" variant="bodySm" tone="muted">
            {ts('flashcard.unknown')}
          </Text>
        </div>
        <div class={styles.stat}>
          <Text as="span" class={styles.statValue}>
            {props.results.length}
          </Text>
          <Text as="span" variant="bodySm" tone="muted">
            {ts('flashcard.total')}
          </Text>
        </div>
      </div>
      <ActionRow>
        <Show when={props.onBack}>
          <Button variant="ghost" label={ts('common.back')} onClick={() => props.onBack?.()} />
        </Show>
        <Button label={ts('flashcard.restart')} onClick={props.onRestart} />
      </ActionRow>
    </div>
  );
};

export type { FlashcardPracticeSummaryProps };
export default FlashcardPracticeSummary;
