import { createMemo, createSignal, mergeProps, onCleanup, onMount, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { FlipCard } from '../data/FlipCard';
import { CloseButton } from '../primitives/CloseButton';
import { Kbd } from '../primitives/Kbd';
import { Meter } from '../primitives/Meter';
import type { Flashcard, FlashResult } from './flashcard';

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
        <div class={cx('vui-fc-session', p.class)}>
          <div class="vui-fc-session__top">
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
            <span class="vui-fc-session__count">
              {index() + 1} / {p.cards.length}
            </span>
          </div>
          {/* Keyed on the card position so each card remounts and replays its entrance. */}
          <Show when={index() + 1} keyed>
            {(position) => (
              <div class={cx('vui-fc-session__card', leaving() && `vui-fc-session__card--${leaving()}`)}>
                <FlipCard
                  height={240}
                  flipped={flipped()}
                  onFlip={setFlipped}
                  label={translate('velvet.patterns.flashcardSession.card', { position })}
                  front={
                    <>
                      <span class="vui-fc-hint">
                        {current().hint ||
                          translate(
                            p.reverse
                              ? 'velvet.patterns.flashcardSession.definition'
                              : 'velvet.patterns.flashcardSession.term',
                          )}
                      </span>
                      <span class="vui-fc-term">{p.reverse ? current().back : current().front}</span>
                      <span class="vui-fc-tap">{translate('velvet.patterns.flashcardSession.flipHint')}</span>
                    </>
                  }
                  back={
                    <>
                      <span class="vui-fc-hint" style={{ color: 'var(--on-color-muted)' }}>
                        {translate(
                          p.reverse
                            ? 'velvet.patterns.flashcardSession.term'
                            : 'velvet.patterns.flashcardSession.definition',
                        )}
                      </span>
                      <span class="vui-fc-term">{p.reverse ? current().front : current().back}</span>
                      <Show when={current().example}>
                        <span class="vui-fc-ex">{current().example}</span>
                      </Show>
                    </>
                  }
                />
              </div>
            )}
          </Show>
          <div class="vui-fc-session__actions">
            <Button
              variant="secondary"
              size="lg"
              iconLeft="x"
              class="vui-fc-btn"
              onClick={() => answer(false)}
              disabled={!flipped()}
            >
              {translate('velvet.patterns.flashcardSession.unknown')}
              <Kbd size="sm">1</Kbd>
            </Button>
            <Button size="lg" iconLeft="check" class="vui-fc-btn" onClick={() => answer(true)} disabled={!flipped()}>
              {translate('velvet.patterns.flashcardSession.known')}
              <Kbd size="sm">2</Kbd>
            </Button>
          </div>
          <div class="vui-fc-session__tally" aria-live="polite">
            {translate('velvet.patterns.flashcardSession.tally', {
              known: known(),
              review: results().length - known(),
            })}
          </div>
        </div>
      )}
    </Show>
  );
};
