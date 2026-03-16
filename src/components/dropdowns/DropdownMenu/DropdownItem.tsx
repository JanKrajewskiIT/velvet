import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownOption from '../DropdownBase/DropdownOption';
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
    <DropdownOption
      role="menuitem"
      class={classNames(styles.item, styles[props.variant ?? 'default'], props.class)}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <Show when={props.icon}>
        <span class={styles.itemIcon}>{props.icon}</span>
      </Show>
      <span>{props.label}</span>
    </DropdownOption>
  );
};

export default DropdownItem;
