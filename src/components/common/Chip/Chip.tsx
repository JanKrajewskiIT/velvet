import type { JSX } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Chip.module.css';

interface ChipProps {
  variant?:
    | 'info'
    | 'warning'
    | 'success'
    | 'error'
    | 'primary'
    | 'primaryOutline'
    | 'subtle';
  size?: 'sm' | 'md';
  selected?: boolean;
  filled?: boolean;
  onClick?: (e: MouseEvent) => void;
  children: JSX.Element;
}

const Chip = (props: Props<ChipProps>) => {
  const isInteractive = () => !!props.onClick;

  return (
    <button
      type="button"
      class={`${styles.chip} ${styles[props.variant ?? 'primary']} ${props.size === 'sm' ? styles.sm : ''} ${props.selected ? styles.selected : ''} ${props.filled ? styles.filled : ''} ${isInteractive() ? styles.interactive : ''} ${props.class ?? ''}`}
      onClick={(e) => props.onClick?.(e)}
    >
      {props.children}
    </button>
  );
};

export default Chip;
