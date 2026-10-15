import { createMemo, createSignal, mergeProps, onCleanup, onMount, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { FlipCard } from '../data/FlipCard';
import { CloseButton } from '../primitives/CloseButton';
import { Kbd } from '../primitives/Kbd';
import { Meter } from '../primitives/Meter';
import { Text } from '../primitives/Text';
import type { Flashcard, FlashResult } from './flashcard';
import styles from './FlashcardSession.module.css';

const FC_SESSION_PART_CARD_CLASSES = {
  right: styles.fcSessionPartCardVariantRight,
  left: styles.fcSessionPartCardVariantLeft,
} as const;

export interface FlashcardSessionProps {
  cards: Flashcard[];
  onFinish?: (results: FlashResult[]) => void;
  onExit?: () => void;
  /** Show back first */
  reverse?: boolean;
  class?: string;
}

const LEAVE_MS = 220;

/** One-card-at-a-time practice: flip (Space), then "Didn’t know" (1 / ←) or "Knew it" (2 / →); the card slides out, progress bar and tally update. */
export const FlashcardSession = (props: FlashcardSessionProps) => {
  const p = mergeProps({ reverse: false } satisfies Partial<FlashcardSessionProps>, props);
  const translate = useTranslate();
  const [index, setIndex] = createSignal(0);
  const [flipped, setFlipped] = createSignal(false);
  const [results, setResults] = createSignal<FlashResult[]>([]);
  const [leaving, setLeaving] = createSignal<'left' | 'right' | null>(null);
  let leaveTimer: ReturnType<typeof setTimeout> | undefined;

  const card = () => p.cards[index()];
  const known = createMemo(() => results().filter((result) => result.known).length);
  const leavingClass = () => {
    const direction = leaving();
    return direction ? variantClass(FC_SESSION_PART_CARD_CLASSES, direction) : undefined;
  };

  const answer = (isKnown: boolean) => {
    const current = card();
    if (!current || leaving()) return;
    if (!flipped()) {
      setFlipped(true);
      return;
    }
    setLeaving(isKnown ? 'right' : 'left');
    leaveTimer = setTimeout(() => {
      const next = [...results(), { id: current.id ?? index(), known: isKnown }];
      setResults(next);
      setLeaving(null);
      setFlipped(false);
      if (index() + 1 >= p.cards.length) p.onFinish?.(next);
      else setIndex(index() + 1);
    }, LEAVE_MS);
  };

  onMount(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.closest('input,textarea')) return;
      if (e.key === ' ') {
        e.preventDefault();
        setFlipped(!flipped());
      } else if (e.key === '1' || e.key === 'ArrowLeft') answer(false);
      else if (e.key === '2' || e.key === 'ArrowRight') answer(true);
    };
    window.addEventListener('keydown', onKeyDown);
    onCleanup(() => window.removeEventListener('keydown', onKeyDown));
  });
  onCleanup(() => clearTimeout(leaveTimer));

  return (
    <Show when={card()}>
      {(current) => (
        <div class={cx(styles.fcSession, p.class)}>
          <div class={styles.fcSessionPartTop}>
            <Show when={p.onExit}>
              <CloseButton
                label={translate('velvet.patterns.flashcardSession.endSession')}
                onClick={() => p.onExit?.()}
              />
            </Show>
            <Meter
              value={index()}
              max={p.cards.length}
              label={translate('velvet.patterns.flashcardSession.progress')}
              role="progressbar"
            />
            <Text as="span" variant="kbd" tone="inherit" class={styles.fcSessionPartCount}>
              {index() + 1} / {p.cards.length}
            </Text>
          </div>
          {/* Keyed on the card position so each card remounts and replays its entrance. */}
          <Show when={index() + 1} keyed>
            {(position) => (
              <div class={cx(styles.fcSessionPartCard, leavingClass())}>
                <FlipCard
                  height={240}
                  flipped={flipped()}
                  onFlip={setFlipped}
                  label={translate('velvet.patterns.flashcardSession.card', { position })}
                  front={
                    <>
                      <Text as="span" variant="overline" tone="inherit" class={styles.fcHint}>
                        {current().hint ||
                          translate(
                            p.reverse
                              ? 'velvet.patterns.flashcardSession.definition'
                              : 'velvet.patterns.flashcardSession.term',
                          )}
                      </Text>
                      <Text as="span" variant="h2" tone="inherit" class="vui-fc-term">
                        {p.reverse ? current().back : current().front}
                      </Text>
                      <Text as="span" variant="caption" tone="inherit" class={styles.fcTap}>
                        {translate('velvet.patterns.flashcardSession.flipHint')}
                      </Text>
                    </>
                  }
                  back={
                    <>
                      <Text
                        as="span"
                        variant="overline"
                        tone="inherit"
                        class={styles.fcHint}
                        style={{ color: 'var(--on-color-muted)' }}
                      >
                        {translate(
                          p.reverse
                            ? 'velvet.patterns.flashcardSession.term'
                            : 'velvet.patterns.flashcardSession.definition',
                        )}
                      </Text>
                      <Text as="span" variant="h2" tone="inherit" class="vui-fc-term">
                        {p.reverse ? current().front : current().back}
                      </Text>
                      <Show when={current().example}>
                        <Text as="span" variant="body-sm" tone="inherit" class={styles.fcEx}>
                          {current().example}
                        </Text>
                      </Show>
                    </>
                  }
                />
              </div>
            )}
          </Show>
          <div class={styles.fcSessionPartActions}>
            <Button variant="secondary" size="lg" iconLeft="x" onClick={() => answer(false)} disabled={!flipped()}>
              {translate('velvet.patterns.flashcardSession.unknown')}
              <Kbd size="sm" class={styles.shortcut}>
                1
              </Kbd>
            </Button>
            <Button size="lg" iconLeft="check" onClick={() => answer(true)} disabled={!flipped()}>
              {translate('velvet.patterns.flashcardSession.known')}
              <Kbd size="sm" class={cx(styles.shortcut, styles.shortcutOnColor)}>
                2
              </Kbd>
            </Button>
          </div>
          <Text as="div" variant="caption" tone="tertiary" class={styles.fcSessionPartTally} aria-live="polite">
            {translate('velvet.patterns.flashcardSession.tally', {
              known: known(),
              review: results().length - known(),
            })}
          </Text>
        </div>
      )}
    </Show>
  );
};
