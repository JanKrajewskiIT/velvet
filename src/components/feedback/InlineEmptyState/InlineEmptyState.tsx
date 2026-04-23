import { type JSX, Show, splitProps } from 'solid-js';

import Stack from '~/components/surfaces/Stack/Stack';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './InlineEmptyState.module.css';

interface InlineEmptyStateProps {
  message: string;
  action?: JSX.Element;
  children?: never;
}

const InlineEmptyState = (props: Props<InlineEmptyStateProps>) => {
  const [local, rest] = splitProps(props, ['class', 'message', 'action']);

  return (
    <Stack {...rest} align="center" gap="sm" class={classNames(styles.root, local.class)}>
      <Text as="p" variant="bodySm" tone="muted" class={styles.message}>
        {local.message}
      </Text>
      <Show when={local.action}>
        <div class={styles.actions}>{local.action}</div>
      </Show>
    </Stack>
  );
};

export default InlineEmptyState;
