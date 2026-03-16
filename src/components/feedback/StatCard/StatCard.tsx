import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

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
  return (
    <div class={classNames(styles.card, props.colorClass && styles[props.colorClass], props.class)}>
      <Show when={props.icon}>
        <div class={styles.icon}>{props.icon}</div>
      </Show>
      <div class={styles.content}>
        <Heading as="span" level={3} variant="h2" class={styles.value}>
          {props.value}
        </Heading>
        <Text as="span" variant="bodySm" tone="muted" class={styles.label}>
          {props.label}
        </Text>
      </div>
    </div>
  );
};

export default StatCard;
