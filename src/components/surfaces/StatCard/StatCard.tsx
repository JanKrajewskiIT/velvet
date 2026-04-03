import type { IconTypes } from 'solid-icons';
import { createMemo, Show, splitProps } from 'solid-js';

import Icon from '~/components/media/Icon/Icon';
import type Props from '~/models/Props';
import type { ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import Heading from '../../typography/Heading/Heading';
import Text from '../../typography/Text/Text';
import Stack from '../Stack/Stack';
import styles from './StatCard.module.css';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: IconTypes;
  iconSize?: ComponentSize;
  colorClass?: 'info' | 'warning' | 'success' | 'error';
  children?: never;
}

const colorClassByValue: Record<NonNullable<StatCardProps['colorClass']>, string | undefined> = {
  info: styles.info,
  warning: styles.warning,
  success: styles.success,
  error: styles.error,
};

const StatCard = (props: Props<StatCardProps>) => {
  const [local, rest] = splitProps(props, ['class', 'value', 'label', 'icon', 'iconSize', 'colorClass']);
  const cardClass = createMemo(() =>
    classNames(styles.card, local.colorClass && colorClassByValue[local.colorClass], local.class),
  );

  return (
    <Stack {...rest} direction="horizontal" align="center" gap="md" class={cardClass()}>
      <Show when={local.icon}>
        {(icon) => (
          <div class={styles.icon}>
            <Icon icon={icon()} size={local.iconSize ?? 'md'} aria-hidden={true} />
          </div>
        )}
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
