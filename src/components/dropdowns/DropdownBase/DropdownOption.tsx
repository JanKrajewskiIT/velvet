import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import styles from './DropdownBase.module.css';

interface DropdownOptionOwnProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

const DropdownOption = (props: Props<DropdownOptionOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'selected', 'type']);

  return (
    <Button
      {...rest}
      variant="subtle"
      size="sm"
      type={local.type ?? 'button'}
      class={classNames(styles.item, local.selected && styles.itemSelected, local.class)}
    />
  );
};

export default DropdownOption;
