import { Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Divider.module.css';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  variant?: 'solid' | 'dashed';
}

const Divider = (props: Props<DividerProps>) => {
  const orientation = () => props.orientation ?? 'horizontal';
  const variant = () => props.variant ?? 'solid';
  const hasLabel = () => orientation() === 'horizontal' && !!props.label;

  return (
    <Show
      when={hasLabel()}
      fallback={
        <Show
          when={orientation() === 'horizontal'}
          fallback={
            <div
              role="separator"
              aria-orientation="vertical"
              class={classNames(styles.vertical, variant() === 'dashed' && styles.dashed, props.class)}
            />
          }
        >
          <hr class={classNames(styles.horizontalPlain, variant() === 'dashed' && styles.dashed, props.class)} />
        </Show>
      }
    >
      <div
        role="separator"
        class={classNames(styles.divider, styles.horizontal, variant() === 'dashed' && styles.dashed, props.class)}
      >
        <span class={styles.label}>{props.label}</span>
      </div>
    </Show>
  );
};

export default Divider;
