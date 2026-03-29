import { createMemo, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Stack from '../../surfaces/Stack/Stack';
import Heading from '../../typography/Heading/Heading';
import Text from '../../typography/Text/Text';
import styles from './StatCard.module.css';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: JSX.Element;
  colorClass?: 'info' | 'warning' | 'success' | 'error';
}

const StatCard = (props: Props<StatCardProps>) => {
  const [local, rest] = splitProps(props, ['class', 'value', 'label', 'icon', 'colorClass']);
  const cardClass = createMemo(() =>
    classNames(styles.card, local.colorClass && styles[local.colorClass], local.class)
  );

  return (
    <Stack {...rest} direction="horizontal" align="center" gap="md" class={cardClass()}>
      <Show when={local.icon}>
        <div class={styles.icon}>{local.icon}</div>
      </Show>
      <Stack gap="2xs" class={styles.content}>
        <Heading as="span" level={3} variant="h2">
          {local.value}
        </Heading>
        <Text as="span" variant="bodySm" tone="muted">
          {local.label}
        </Text>
      </Stack>
    </Stack>
  );
};

export default StatCard;
