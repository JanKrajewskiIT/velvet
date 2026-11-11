import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import type { PracticeCollection } from './flashcard';
import styles from './PracticeCollectionOption.module.css';

export interface PracticeCollectionOptionProps {
  deck: PracticeCollection;
  selected: boolean;
  name: string;
  onSelect: (id: string) => void;
}

export const PracticeCollectionOption = (props: PracticeCollectionOptionProps) => {
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
