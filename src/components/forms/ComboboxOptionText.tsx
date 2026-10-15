import { type JSX, Show } from 'solid-js';

import { Text } from '../primitives/Text';
import styles from './ComboboxOptionText.module.css';

export interface ComboboxOptionTextProps {
  label: JSX.Element;
  description?: JSX.Element;
}

export const ComboboxOptionText = (props: ComboboxOptionTextProps) => (
  <Text as="span" variant="body" tone="inherit" class={styles.selectPartLabel}>
    {props.label}
    <Show when={props.description}>
      <Text as="span" variant="caption" tone="inherit" class={styles.selectPartDesc}>
        {props.description}
      </Text>
    </Show>
  </Text>
);
