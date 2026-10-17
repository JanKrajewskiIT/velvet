import { createMemo, createSignal, createUniqueId, For, mergeProps, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { OptionSwitcher } from '../forms/OptionSwitcher';
import { SearchInput } from '../forms/SearchInput';
import { Slider } from '../forms/Slider';
import { FieldLabel } from '../primitives/FieldLabel';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';
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
import { FlashcardDeckOption } from './FlashcardDeckOption';
import styles from './FlashcardSetup.module.css';
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
  const [query, setQuery] = createSignal('');
  const groupName = createUniqueId();

  const deck = createMemo(() => p.decks.find((candidate) => candidate.id === deckId()) ?? p.decks[0]);
  const pinned = createMemo(() => p.decks.filter((candidate) => candidate.pinned));
  const categories = createMemo(() => p.decks.filter((candidate) => !candidate.pinned));
  const shown = createMemo(() =>
    categories().filter((candidate) => candidate.name.toLowerCase().includes(query().toLowerCase())),
  );
  const cap = () => Math.max(0, Math.min(p.maxCards, deck()?.total ?? 0));
  const count = () => Math.min(wanted(), cap());

  const start = () => {
    const current = deck();
    if (current && count() > 0) {
      p.onStart?.({ deck: current.id, count: count(), order: order(), direction: direction() });
    }
  };

  return (
    <div class={cx(styles.surface, styles.fcSetup, p.class)}>
      <div class={styles.layout}>
        <fieldset class={styles.pick} aria-label={translate('velvet.patterns.flashcardSetup.deck')}>
          <Heading level={3} variant="title-lg">
            {translate('velvet.patterns.flashcardSetup.title')}
          </Heading>
          <Show when={pinned().length > 0}>
            <div class={styles.pinned}>
              <For each={pinned()}>
                {(candidate) => (
                  <FlashcardDeckOption
                    deck={candidate}
                    selected={deck()?.id === candidate.id}
                    name={groupName}
                    onSelect={setDeckId}
                  />
                )}
              </For>
            </div>
          </Show>
          <Show when={categories().length > 0}>
            <div class={styles.categories}>
              <div class={styles.row}>
                <Text as="span" variant="label">
                  {translate('velvet.patterns.flashcardSetup.categories')}
                </Text>
                <Show when={categories().length > 8}>
                  <SearchInput
                    size="sm"
                    class={styles.find}
                    placeholder={translate('velvet.patterns.flashcardSetup.filterPlaceholder')}
                    aria-label={translate('velvet.patterns.flashcardSetup.filterLabel')}
                    value={query()}
                    onValueChange={setQuery}
                  />
                </Show>
              </div>
              <div
                class={styles.decks}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the labelled deck list must take focus so keyboard users can scroll it
                tabIndex={0}
                role="region"
                aria-label={translate('velvet.patterns.flashcardSetup.categories')}
              >
                <For
                  each={shown()}
                  fallback={
                    <Text as="span" variant="caption" tone="tertiary">
                      {translate('velvet.patterns.flashcardSetup.noCategories')}
                    </Text>
                  }
                >
                  {(candidate) => (
                    <FlashcardDeckOption
                      deck={candidate}
                      selected={deck()?.id === candidate.id}
                      name={groupName}
                      onSelect={setDeckId}
                    />
                  )}
                </For>
              </div>
            </div>
          </Show>
        </fieldset>
        <div class={styles.options}>
          <div class={styles.selection}>
            <Text as="span" variant="caption" tone="tertiary">
              {translate('velvet.patterns.flashcardSetup.selected')}
            </Text>
            <Text as="span" variant="label" truncate>
              {deck()?.name ?? translate('velvet.patterns.flashcardSetup.noSelection')}
            </Text>
          </div>
          <Slider
            label={translate('velvet.patterns.flashcardSetup.count')}
            min={cap() > 0 ? 1 : 0}
            max={Math.max(1, cap())}
            value={count()}
            disabled={cap() === 0}
            onValueChange={(value) => {
              if (typeof value === 'number') setWanted(value);
            }}
          />
          <div class={styles.field}>
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
          <div class={styles.field}>
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
          <Button size="lg" block iconLeft="play" disabled={count() === 0} onClick={start}>
            {translate('velvet.patterns.flashcardSetup.start')}
          </Button>
        </div>
      </div>
    </div>
  );
};
