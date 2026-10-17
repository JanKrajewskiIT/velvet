import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import type { FlashDeck } from './flashcard';
import styles from './FlashcardDeckOption.module.css';

export interface FlashcardDeckOptionProps {
  deck: FlashDeck;
  selected: boolean;
  name: string;
  onSelect: (id: string) => void;
}

export const FlashcardDeckOption = (props: FlashcardDeckOptionProps) => {
  const translate = useTranslate();
  return (
    <label class={cx(styles.deck, props.deck.pinned && styles.big, props.selected && styles.selected)}>
      <input
        type="radio"
        class={styles.input}
        name={props.name}
        value={props.deck.id}
        checked={props.selected}
        onChange={() => props.onSelect(props.deck.id)}
      />
      <Text as="span" variant={props.deck.pinned ? 'body' : 'body-sm'} tone="inherit" class={styles.name} truncate>
        {props.deck.name}
      </Text>
      <Text as="span" variant="caption" tone="tertiary">
        {translate('velvet.patterns.flashcardSetup.cards', { count: props.deck.total })}
        <Show when={props.deck.due}>
          {' · '}
          <Text as="b" variant="label-sm" tone="brand">
            {translate('velvet.patterns.flashcardSetup.due', { count: props.deck.due })}
          </Text>
        </Show>
      </Text>
    </label>
  );
};
