import { Show } from 'solid-js';

import type Props from '~/models/Props';

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
              class={`${styles.vertical} ${variant() === 'dashed' ? styles.dashed : ''} ${props.class ?? ''}`}
            />
          }
        >
          <hr class={`${styles.horizontalPlain} ${variant() === 'dashed' ? styles.dashed : ''} ${props.class ?? ''}`} />
        </Show>
      }
    >
      <div
        role="separator"
        class={`${styles.divider} ${styles.horizontal} ${variant() === 'dashed' ? styles.dashed : ''} ${props.class ?? ''}`}
      >
        <span class={styles.label}>{props.label}</span>
      </div>
    </Show>
  );
};

export default Divider;
