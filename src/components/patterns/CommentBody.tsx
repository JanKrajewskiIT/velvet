import { For, Show } from 'solid-js';

import { Mark } from '../primitives/Mark';
import { Text } from '../primitives/Text';
import styles from './CommentBody.module.css';

const MENTION = /(@[\p{L}][\p{L}\d._-]*)/u;

export interface CommentBodyProps {
  text: string;
}

/** Plain-text comment body; `@mentions` are highlighted. */
export const CommentBody = (props: CommentBodyProps) => {
  const parts = () => props.text.split(MENTION);
  return (
    <Text as="div" variant="body-sm" tone="inherit" class={styles.cmtPartBody}>
      <For each={parts()}>
        {(part, index) => (
          <Show when={index() % 2} fallback={part}>
            <Mark variant="mention">{part}</Mark>
          </Show>
        )}
      </For>
    </Text>
  );
};
