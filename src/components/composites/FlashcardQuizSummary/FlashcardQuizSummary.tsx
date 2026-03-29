import { createMemo, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import ActionRow from '~/components/forms/ActionRow/ActionRow';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './FlashcardQuizSummary.module.css';

interface FlashcardQuizSummaryResult {
  known: boolean;
}

interface FlashcardQuizSummaryProps<T extends FlashcardQuizSummaryResult> {
  results: readonly T[];
  title: string;
  knownLabel: string;
  unknownLabel: string;
  totalLabel: string;
  restartLabel: string;
  backLabel?: string;
  onRestart: () => void;
  onBack?: () => void;
}

const FlashcardQuizSummary = <T extends FlashcardQuizSummaryResult>(props: Props<FlashcardQuizSummaryProps<T>>) => {
  const knownCount = createMemo(() => props.results.filter((result) => result.known).length);
  const unknownCount = createMemo(() => props.results.length - knownCount());
  const percentage = createMemo(() =>
    props.results.length > 0 ? Math.round((knownCount() / props.results.length) * 100) : 0
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
            {props.knownLabel}
          </Text>
        </div>
        <div class={styles.stat}>
          <Text as="span" class={classNames(styles.statValue, styles.unknown)}>
            {unknownCount()}
          </Text>
          <Text as="span" variant="bodySm" tone="muted">
            {props.unknownLabel}
          </Text>
        </div>
        <div class={styles.stat}>
          <Text as="span" class={styles.statValue}>
            {props.results.length}
          </Text>
          <Text as="span" variant="bodySm" tone="muted">
            {props.totalLabel}
          </Text>
        </div>
      </div>
      <ActionRow>
        <Show when={props.onBack && props.backLabel}>
          <Button variant="ghost" label={props.backLabel ?? ''} onClick={() => props.onBack?.()} />
        </Show>
        <Button label={props.restartLabel} onClick={props.onRestart} />
      </ActionRow>
    </div>
  );
};

export type { FlashcardQuizSummaryProps };
export default FlashcardQuizSummary;
