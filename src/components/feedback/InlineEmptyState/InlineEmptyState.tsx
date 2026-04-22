import { splitProps } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './InlineEmptyState.module.css';

interface InlineEmptyStateProps {
  message: string;
  children?: never;
}

const InlineEmptyState = (props: Props<InlineEmptyStateProps>) => {
  const [local, rest] = splitProps(props, ['class', 'message']);

  return (
    <div {...rest} class={classNames(styles.root, local.class)}>
      <Text as="p" variant="bodySm" tone="muted" class={styles.message}>
        {local.message}
      </Text>
    </div>
  );
};

export default InlineEmptyState;
