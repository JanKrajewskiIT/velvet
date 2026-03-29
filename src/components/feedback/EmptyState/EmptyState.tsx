import { createMemo, type JSX, Show, splitProps } from 'solid-js';

import Stack from '~/components/surfaces/Stack/Stack';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: JSX.Element;
  message?: string;
  label?: string;
  hint?: string;
  action?: JSX.Element;
  children?: never;
}

const EmptyState = (props: Props<EmptyStateProps>) => {
  const [local, rest] = splitProps(props, ['class', 'icon', 'message', 'label', 'hint', 'action']);
  const resolvedMessage = createMemo(() => local.message || local.label);

  return (
    <Stack {...rest} align="center" gap="md" class={classNames(styles.empty, local.class)}>
      <Show when={local.icon}>
        <div class={styles.icon}>{local.icon}</div>
      </Show>
      <Stack gap="xs" class={styles.copy}>
        <Show when={resolvedMessage()}>
          <Heading as="p" level={4} variant="titleMd" tone="inherit" class={styles.message}>
            {resolvedMessage()}
          </Heading>
        </Show>
        <Show when={local.hint}>
          {(hint) => (
            <Text as="p" variant="bodySm" tone="muted" class={styles.hint}>
              {hint()}
            </Text>
          )}
        </Show>
      </Stack>
      <Show when={local.action}>
        <div class={styles.actions}>{local.action}</div>
      </Show>
    </Stack>
  );
};

export default EmptyState;
