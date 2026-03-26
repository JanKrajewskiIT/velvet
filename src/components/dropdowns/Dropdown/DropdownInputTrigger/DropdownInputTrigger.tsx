import { FiChevronDown } from 'solid-icons/fi';
import { splitProps } from 'solid-js';

import Input from '~/components/inputs/Input/Input';
import type Props from '~/models/Props';
import type { ComponentSize, DivCoreNativeProps, InputCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DropdownInputTrigger.module.css';

interface DropdownInputTriggerOwnProps extends InputCoreNativeProps {
  size?: ComponentSize;
  invalid?: boolean;
  open?: boolean;
  hideIcon?: boolean;
  role?: DivCoreNativeProps['role'];
}

const DropdownInputTrigger = (props: Props<DropdownInputTriggerOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'invalid', 'open', 'hideIcon', 'role']);

  return (
    <div class={styles.root} role={local.role || undefined}>
      <Input {...rest} size={local.size} invalid={local.invalid} class={classNames(styles.input, local.class)} />
      {!local.hideIcon && (
        <span class={classNames(styles.icon, local.open && styles.iconOpen)} aria-hidden="true">
          <FiChevronDown />
        </span>
      )}
    </div>
  );
};

export default DropdownInputTrigger;
