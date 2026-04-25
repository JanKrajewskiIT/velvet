import type { JSX } from 'solid-js';
import { batch, createEffect, createMemo, createSignal, on, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import EmptyState from '~/components/feedback/EmptyState/EmptyState';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import FlashcardPracticeCard from '../FlashcardPracticeCard/FlashcardPracticeCard';
import styles from './FlashcardPracticeSession.module.css';

export interface FlashcardPracticeResult<T> {
  id: string;
  item: T;
  known: boolean;
}

interface FlashcardPracticeSessionProps<T> {
  items: readonly T[];
  getId: (item: T) => string;
  renderFront: (item: T) => JSX.Element;
  renderBack: (item: T) => JSX.Element;
  getBadgeLabel?: (item: T) => string | undefined;
  onFinish: (results: FlashcardPracticeResult<T>[]) => void;
  onQuit?: () => void;
  emptyMessage: string;
  height?: string;
}

const FlashcardPracticeSession = <T,>(props: Props<FlashcardPracticeSessionProps<T>>) => {
  const { ts } = useI18n();
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [flipped, setFlipped] = createSignal(false);
  const [results, setResults] = createSignal<FlashcardPracticeResult<T>[]>([]);

  createEffect(
    on(
      () => props.items,
      () => {
        batch(() => {
          setCurrentIndex(0);
          setFlipped(false);
          setResults([]);
        });
      },
      { defer: true },
    ),
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

    const nextResult: FlashcardPracticeResult<T> = {
      id: props.getId(item),
      item,
      known,
    };
    const nextResults = [...results(), nextResult];

    batch(() => {
      setResults(nextResults);
      setFlipped(false);

      if (isLast()) {
        props.onFinish(nextResults);
        return;
      }

      setCurrentIndex((value) => value + 1);
    });
  };

  const markUnknown = () => handleRate(false);
  const markKnown = () => handleRate(true);
  const progressFillStyle = createMemo<JSX.CSSProperties>(() => ({
    '--flashcard-progress': `${progressPercent()}%`,
  }));

  return (
    <Show when={total() > 0} fallback={<EmptyState class={props.class} message={props.emptyMessage} />}>
      <div class={classNames(styles.session, props.class)}>
        <div class={styles.header}>
          <Text as="span" variant="bodySm" tone="muted" class={styles.progress}>
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
          <Show when={props.onQuit}>
            <Button variant="ghost" label={ts('flashcard.quit')} onClick={() => props.onQuit?.()} />
          </Show>
        </div>

        <div
          class={styles.progressTrack}
          role="progressbar"
          aria-valuenow={currentIndex() + 1}
          aria-valuemin={1}
          aria-valuemax={total()}
        >
          <div class={styles.progressFill} style={progressFillStyle()} />
        </div>

        <Show when={currentItem()}>
          {(item) => (
            <FlashcardPracticeCard
              height={props.height}
              front={props.renderFront(item())}
              back={props.renderBack(item())}
              badgeLabel={props.getBadgeLabel?.(item())}
              flipped={flipped()}
              onFlip={setFlipped}
            />
          )}
        </Show>

        <Show when={flipped()}>
          <div class={styles.actions}>
            <Button variant="danger" label={ts('flashcard.iDontKnow')} onClick={markUnknown} />
            <Button label={ts('flashcard.iKnow')} onClick={markKnown} />
          </div>
        </Show>
      </div>
    </Show>
  );
};

export type { FlashcardPracticeSessionProps };
export default FlashcardPracticeSession;
