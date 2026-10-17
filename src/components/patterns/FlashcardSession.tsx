import { batch, createEffect, createMemo, createSignal, mergeProps, on, onCleanup, onMount, Show } from 'solid-js';

import { ownsLayerEvent } from '../../hooks/createLayer';
import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { isInteractiveTarget } from '../../utils/interactiveTarget';
import { Button } from '../actions/Button';
import { FlipCard } from '../data/FlipCard';
import { CloseButton } from '../primitives/CloseButton';
import { Kbd } from '../primitives/Kbd';
import { Meter } from '../primitives/Meter';
import { Text } from '../primitives/Text';
import type { Flashcard, FlashResult } from './flashcard';
import { FlashcardFace } from './FlashcardFace';
import { flashcardHeight } from './flashcardPresentation';
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
const SESSION_SELECTOR = '[data-vui-flashcard-session]';

/** One-card-at-a-time practice: flip (Space), then "Didn’t know" (1 / ←) or "Knew it" (2 / →); the card slides out, progress bar and tally update. */
export const FlashcardSession = (props: FlashcardSessionProps) => {
  const p = mergeProps({ reverse: false } satisfies Partial<FlashcardSessionProps>, props);
  const translate = useTranslate();
  const [index, setIndex] = createSignal(0);
  const [flipped, setFlipped] = createSignal(false);
  const [results, setResults] = createSignal<FlashResult[]>([]);
  const [leaving, setLeaving] = createSignal<'left' | 'right' | null>(null);
  let leaveTimer: ReturnType<typeof setTimeout> | undefined;
  let root: HTMLDivElement | undefined;

  const card = () => p.cards[index()];
  const front = () => (p.reverse ? card()?.back : card()?.front);
  const back = () => (p.reverse ? card()?.front : card()?.back);
  const known = createMemo(() => results().filter((result) => result.known).length);
  const leavingClass = () => {
    const direction = leaving();
    return direction ? variantClass(FC_SESSION_PART_CARD_CLASSES, direction) : undefined;
  };

  createEffect(
    on(
      () => p.cards,
      () => {
        clearTimeout(leaveTimer);
        leaveTimer = undefined;
        batch(() => {
          setIndex(0);
          setFlipped(false);
          setResults([]);
          setLeaving(null);
        });
      },
      { defer: true },
    ),
  );

  const answer = (isKnown: boolean) => {
    const current = card();
    if (!current || leaving()) return;
    if (!flipped()) {
      setFlipped(true);
      return;
    }
    const cards = p.cards;
    const position = index();
    setLeaving(isKnown ? 'right' : 'left');
    leaveTimer = setTimeout(() => {
      leaveTimer = undefined;
      if (p.cards !== cards || card() !== current || index() !== position) {
        setLeaving(null);
        return;
      }
      const next = [...results(), { id: current.id ?? position, known: isKnown }];
      const finished = position + 1 >= cards.length;
      batch(() => {
        setResults(next);
        setLeaving(null);
        setFlipped(false);
        setIndex(position + 1);
      });
      if (finished) p.onFinish?.(next);
    }, LEAVE_MS);
  };

  onMount(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat || e.altKey || e.ctrlKey || e.metaKey || leaving() || !card()) return;
      if (!root || !ownsLayerEvent(root)) return;
      const targetSession = e.target instanceof Element ? e.target.closest(SESSION_SELECTOR) : null;
      if (targetSession && targetSession !== root) return;
      if (!targetSession && root.ownerDocument.querySelectorAll(SESSION_SELECTOR).length !== 1) return;
      if (e.target instanceof Element && e.target.closest('[data-vui-flip] [role="region"]')) return;
      if (isInteractiveTarget(e.target) && e.target !== root.querySelector('[data-vui-flip]')) return;
      if (e.key === ' ') {
        e.preventDefault();
        setFlipped(!flipped());
      } else if (e.key === '1' || e.key === 'ArrowLeft') {
        e.preventDefault();
        answer(false);
      } else if (e.key === '2' || e.key === 'ArrowRight') {
        e.preventDefault();
        answer(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    onCleanup(() => window.removeEventListener('keydown', onKeyDown));
  });
  onCleanup(() => clearTimeout(leaveTimer));

  return (
    <Show when={card()}>
      {(current) => (
        <div
          ref={(element) => {
            root = element;
          }}
          data-vui-flashcard-session
          class={cx(styles.fcSession, p.class)}
        >
          <div class={styles.fcSessionPartTop}>
            <Show when={p.onExit}>
              <CloseButton
                label={translate('velvet.patterns.flashcardSession.endSession')}
                onClick={() => {
                  clearTimeout(leaveTimer);
                  leaveTimer = undefined;
                  setLeaving(null);
                  p.onExit?.();
                }}
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
                  height={flashcardHeight(front(), back())}
                  bodyClass={styles.faceBody}
                  flipped={flipped()}
                  onFlip={(next) => {
                    if (!leaving()) setFlipped(next);
                  }}
                  label={translate('velvet.patterns.flashcardSession.card', { position })}
                  front={
                    <FlashcardFace
                      side="front"
                      content={front()}
                      hint={
                        current().hint ||
                        translate(
                          p.reverse
                            ? 'velvet.patterns.flashcardSession.definition'
                            : 'velvet.patterns.flashcardSession.term',
                        )
                      }
                    />
                  }
                  back={
                    <FlashcardFace
                      side="back"
                      content={back()}
                      example={current().example}
                      hint={translate(
                        p.reverse
                          ? 'velvet.patterns.flashcardSession.term'
                          : 'velvet.patterns.flashcardSession.definition',
                      )}
                    />
                  }
                />
              </div>
            )}
          </Show>
          <div class={styles.fcSessionPartActions}>
            <Button
              variant="secondary"
              size="lg"
              iconLeft="x"
              onClick={() => answer(false)}
              disabled={!flipped() || !!leaving()}
            >
              {translate('velvet.patterns.flashcardSession.unknown')}
              <Kbd size="sm" class={styles.shortcut}>
                1
              </Kbd>
            </Button>
            <Button size="lg" iconLeft="check" onClick={() => answer(true)} disabled={!flipped() || !!leaving()}>
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
