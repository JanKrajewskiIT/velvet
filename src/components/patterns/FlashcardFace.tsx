import { type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import styles from './FlashcardFace.module.css';
import { isLongFlashcardContent } from './flashcardPresentation';

export interface FlashcardFaceProps {
  content: JSX.Element;
  hint: string;
  side: 'front' | 'back';
  example?: JSX.Element;
}

export const FlashcardFace = (props: FlashcardFaceProps) => {
  const translate = useTranslate();
  const long = () => isLongFlashcardContent(props.content);
  return (
    <div
      class={styles.content}
      role="region"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the labelled scroll region must take focus so keyboard users can scroll long card content
      tabIndex={0}
      aria-label={props.hint}
    >
      <Text
        as="span"
        variant="overline"
        tone="inherit"
        class={cx(styles.hint, props.side === 'back' && styles.backHint)}
      >
        {props.hint}
      </Text>
      <Text
        as="span"
        variant={long() ? 'body-lg' : 'h2'}
        tone="inherit"
        class={cx(styles.term, long() && styles.longTerm)}
      >
        {props.content}
      </Text>
      <Show when={props.side === 'front'}>
        <Text as="span" variant="caption" tone="tertiary">
          {translate('velvet.patterns.flashcardSession.flipHint')}
        </Text>
      </Show>
      <Show when={props.side === 'back' && props.example}>
        <Text as="span" variant="body-sm" tone="inherit" class={styles.example}>
          {props.example}
        </Text>
      </Show>
    </div>
  );
};
