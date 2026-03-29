import type { JSX } from 'solid-js';
import { createEffect, createMemo, createSignal, on, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import EmptyState from '~/components/feedback/EmptyState/EmptyState';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import FlashcardQuizCard from '../FlashcardQuizCard/FlashcardQuizCard';
import styles from './FlashcardQuizSession.module.css';

export interface FlashcardQuizResult<T> {
  id: string;
  item: T;
  known: boolean;
}

interface FlashcardQuizSessionProps<T> {
  items: readonly T[];
  getId: (item: T) => string;
  renderFront: (item: T) => JSX.Element;
  renderBack: (item: T) => JSX.Element;
  getBadgeLabel?: (item: T) => string | undefined;
  onFinish: (results: FlashcardQuizResult<T>[]) => void;
  onQuit?: () => void;
  emptyMessage: string;
  knowLabel: string;
  dontKnowLabel: string;
  quitLabel?: string;
  revealHintLabel?: string;
  answerLabel?: string;
  height?: string;
}

const FlashcardQuizSession = <T,>(props: Props<FlashcardQuizSessionProps<T>>) => {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [flipped, setFlipped] = createSignal(false);
  const [results, setResults] = createSignal<FlashcardQuizResult<T>[]>([]);

  createEffect(
    on(
      () => props.items,
      () => {
        setCurrentIndex(0);
        setFlipped(false);
        setResults([]);
      }
    )
  );

  const total = createMemo(() => props.items.length);
  const currentItem = createMemo(() => props.items[currentIndex()]);
  const isLast = createMemo(() => currentIndex() === Math.max(total() - 1, 0));
  const progressPercent = createMemo(() => (total() > 0 ? ((currentIndex() + 1) / total()) * 100 : 0));
  const knownCount = createMemo(() => results().filter((result) => result.known).length);
  const unknownCount = createMemo(() => results().filter((result) => !result.known).length);

  const handleRate = (known: boolean) => {
    const item = currentItem();
    if (!item) return;

    const nextResult: FlashcardQuizResult<T> = {
      id: props.getId(item),
      item,
      known,
    };
    const nextResults = [...results(), nextResult];

    setResults(nextResults);
    setFlipped(false);

    if (isLast()) {
      props.onFinish(nextResults);
      return;
    }

    setCurrentIndex((value) => value + 1);
  };

  return (
    <Show when={total() > 0} fallback={<EmptyState class={props.class} message={props.emptyMessage} />}>
      <div class={classNames(styles.session, props.class)}>
        <div class={styles.header}>
          <Text as="span" variant="bodySm" class={styles.progress}>
            {currentIndex() + 1} / {total()}
          </Text>
          <div class={styles.score}>
            <Text as="span" variant="bodySm" class={styles.known}>
              {knownCount()}
            </Text>
            <Text as="span" variant="bodySm" class={styles.unknown}>
              {unknownCount()}
            </Text>
          </div>
          <Show when={props.onQuit && props.quitLabel}>
            <Button variant="ghost" label={props.quitLabel ?? ''} onClick={() => props.onQuit?.()} />
          </Show>
        </div>

        <div
          class={styles.progressTrack}
          role="progressbar"
          aria-valuenow={currentIndex() + 1}
          aria-valuemin={1}
          aria-valuemax={total()}
        >
          <div class={styles.progressFill} style={{ width: `${progressPercent()}%` }} />
        </div>

        <Show when={currentItem()}>
          {(item) => (
            <FlashcardQuizCard
              height={props.height}
              front={props.renderFront(item())}
              back={props.renderBack(item())}
              badgeLabel={props.getBadgeLabel?.(item())}
              flipped={flipped()}
              revealHintLabel={props.revealHintLabel}
              answerLabel={props.answerLabel}
              onFlip={setFlipped}
            />
          )}
        </Show>

        <Show when={flipped()}>
          <div class={styles.actions}>
            <Button variant="danger" label={props.dontKnowLabel} onClick={() => handleRate(false)} />
            <Button label={props.knowLabel} onClick={() => handleRate(true)} />
          </div>
        </Show>
      </div>
    </Show>
  );
};

export type { FlashcardQuizSessionProps };
export default FlashcardQuizSession;
