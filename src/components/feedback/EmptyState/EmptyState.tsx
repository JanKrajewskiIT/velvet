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
  children?: JSX.Element;
}

const EmptyState = (props: Props<EmptyStateProps>) => {
  return (
    <div class={classNames(styles.empty, props.class)}>
      <Show when={props.icon}>
        <div class={styles.icon}>{props.icon}</div>
      </Show>
      <Heading as="p" level={4} variant="titleMd" tone="secondary" class={styles.message}>
        {props.message}
      </Heading>
      <Show when={props.hint}>
        <Text as="p" variant="caption" tone="tertiary" class={styles.hint}>
          {props.hint}
        </Text>
      </Show>
      <Show when={props.children}>
        <div class={styles.content}>{props.children}</div>
      </Show>
    </div>
  );
};

export default EmptyState;
