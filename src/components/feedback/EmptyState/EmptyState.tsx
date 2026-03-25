import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: JSX.Element;
  message: string;
  hint?: string;
  action?: JSX.Element;
  children?: never;
}

const EmptyState = (props: Props<EmptyStateProps>) => {
  return (
    <div class={classNames(styles.empty, props.class)}>
      <Show when={props.icon}>
        <div class={styles.icon}>{props.icon}</div>
      </Show>
      <Heading as="p" level={4} variant="titleMd" tone="secondary">
        {props.message}
      </Heading>
      <Show when={props.hint}>
        {(hint) => (
          <Text as="p" variant="caption" tone="tertiary">
            {hint()}
          </Text>
        )}
      </Show>
      <Show when={props.action}>
        <div class={styles.content}>{props.action}</div>
      </Show>
    </div>
  );
};

export default EmptyState;
