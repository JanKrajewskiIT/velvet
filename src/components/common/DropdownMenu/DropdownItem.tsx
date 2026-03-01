import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '../../../models/Props';

import styles from './DropdownMenu.module.css';

interface DropdownItemProps {
  icon?: JSX.Element;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'success' | 'error';
  disabled?: boolean;
}

const DropdownItem = (props: Props<DropdownItemProps>) => {
  return (
    <button
      type="button"
      class={`${styles.item} ${styles[props.variant ?? 'default']} ${props.class ?? ''}`}
      onClick={() => props.onClick()}
      disabled={props.disabled}
    >
      <Show when={props.icon}>
        <span class={styles.itemIcon}>{props.icon}</span>
      </Show>
      <span>{props.label}</span>
    </button>
  );
};

export default DropdownItem;
