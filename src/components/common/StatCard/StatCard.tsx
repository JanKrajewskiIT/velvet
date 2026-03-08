import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '../../../models/Props';
import styles from './StatCard.module.css';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: JSX.Element;
  colorClass?: string;
}

const StatCard = (props: Props<StatCardProps>) => {
  return (
    <div
      class={`${styles.card} ${props.colorClass ? (styles[props.colorClass] ?? '') : ''} ${props.class ?? ''}`}
    >
      <Show when={props.icon}>
        <div class={styles.icon}>{props.icon}</div>
      </Show>
      <div class={styles.content}>
        <span class={styles.value}>{props.value}</span>
        <span class={styles.label}>{props.label}</span>
      </div>
    </div>
  );
};

export default StatCard;
