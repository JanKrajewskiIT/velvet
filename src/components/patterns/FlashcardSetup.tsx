import { createMemo, createSignal, For, mergeProps, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { OptionSwitcher } from '../forms/OptionSwitcher';
import { Slider } from '../forms/Slider';
import { FieldLabel } from '../primitives/Field';
import {
  FLASH_DIRECTION_LABEL_KEYS,
  FLASH_DIRECTIONS,
  FLASH_ORDER_LABEL_KEYS,
  FLASH_ORDERS,
  type FlashcardConfig,
  type FlashDeck,
  type FlashDirection,
  type FlashOrder,
} from './flashcard';
import { isOneOf } from './oneOf';

export interface FlashcardSetupProps {
  decks: FlashDeck[];
  onStart?: (config: FlashcardConfig) => void;
  /** @default 50 */
  maxCards?: number;
  class?: string;
}

const DEFAULT_CARD_COUNT = 20;

/** Study-session setup: deck picker (due counts), card count, order and direction. */
export const FlashcardSetup = (props: FlashcardSetupProps) => {
  const p = mergeProps({ maxCards: 50 } satisfies Partial<FlashcardSetupProps>, props);
  const translate = useTranslate();
  const orderOptions = () => FLASH_ORDERS.map((value) => ({ value, label: translate(FLASH_ORDER_LABEL_KEYS[value]) }));
  const directionOptions = () =>
    FLASH_DIRECTIONS.map((value) => ({ value, label: translate(FLASH_DIRECTION_LABEL_KEYS[value]) }));
  const [deckId, setDeckId] = createSignal(untrack(() => p.decks[0]?.id));
  const [wanted, setWanted] = createSignal(DEFAULT_CARD_COUNT);
  const [order, setOrder] = createSignal<FlashOrder>('due');
  const [direction, setDirection] = createSignal<FlashDirection>('front');

  const deck = createMemo(() => p.decks.find((candidate) => candidate.id === deckId()));
  const cap = () => Math.min(p.maxCards, deck()?.total || p.maxCards);
  const count = () => Math.min(wanted(), cap());

  const start = () => {
    const id = deckId();
    if (id !== undefined) p.onStart?.({ deck: id, count: count(), order: order(), direction: direction() });
  };

  return (
    <div class={cx('vui-surface', 'vui-fc-setup', p.class)}>
      <div class="vui-fc-setup__h">{translate('velvet.patterns.flashcardSetup.title')}</div>
      <div class="vui-fc-setup__decks" role="radiogroup" aria-label={translate('velvet.patterns.flashcardSetup.deck')}>
        <For each={p.decks}>
          {(candidate) => (
            <button
              type="button"
              role="radio"
              aria-checked={deckId() === candidate.id}
              class={cx('vui-fc-deck', deckId() === candidate.id && 'vui-fc-deck--on')}
              onClick={() => setDeckId(candidate.id)}
            >
              <span class="vui-fc-deck__name">{candidate.name}</span>
              <span class="vui-fc-deck__meta">
                {translate('velvet.patterns.flashcardSetup.cards', { count: candidate.total })}
                {candidate.due ? ' · ' : ''}
                <Show when={candidate.due}>
                  <b>{translate('velvet.patterns.flashcardSetup.dueToday', { count: candidate.due })}</b>
                </Show>
              </span>
            </button>
          )}
        </For>
      </div>
      <Slider
        label={translate('velvet.patterns.flashcardSetup.count')}
        min={1}
        max={cap()}
        value={count()}
        onValueChange={setWanted}
      />
      <div class="vui-fc-setup__row">
        <FieldLabel>{translate('velvet.patterns.flashcardSetup.order')}</FieldLabel>
        <OptionSwitcher
          size="sm"
          label={translate('velvet.patterns.flashcardSetup.order')}
          value={order()}
          options={orderOptions()}
          onValueChange={(value) => {
            if (isOneOf(FLASH_ORDERS, value)) setOrder(value);
          }}
        />
      </div>
      <div class="vui-fc-setup__row">
        <FieldLabel>{translate('velvet.patterns.flashcardSetup.direction')}</FieldLabel>
        <OptionSwitcher
          size="sm"
          label={translate('velvet.patterns.flashcardSetup.direction')}
          value={direction()}
          options={directionOptions()}
          onValueChange={(value) => {
            if (isOneOf(FLASH_DIRECTIONS, value)) setDirection(value);
          }}
        />
      </div>
      <Button size="lg" block iconLeft="play" disabled={deckId() === undefined} onClick={start}>
        {translate('velvet.patterns.flashcardSetup.start')}
      </Button>
    </div>
  );
};
