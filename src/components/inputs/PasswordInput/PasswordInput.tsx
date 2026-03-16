import { IoEye, IoEyeOutline } from 'solid-icons/io';
import { createSignal, type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import IconButton from '../../buttons/IconButton/IconButton';
import AffixInput from '../AffixInput/AffixInput';
import type { InputSize } from '../Input/Input';
import styles from './PasswordInput.module.css';

interface PasswordInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showToggle?: boolean;
  visibilityLabel: string;
  size?: InputSize;
}

const PasswordInput = (props: Props<PasswordInputProps>) => {
  const [local, rest] = splitProps(props, ['class', 'showToggle', 'visibilityLabel', 'size']);
  const [visible, setVisible] = createSignal(false);

  const toggle = () => setVisible(!visible());
  const icon = () => (visible() ? <IoEye /> : <IoEyeOutline />);
  const suffix = () => {
    if (local.showToggle === false) return undefined;

    return (
      <IconButton
        icon={icon()}
        title={local.visibilityLabel}
        class={styles.toggle}
        onClick={toggle}
        aria-pressed={visible()}
        disabled={rest.disabled}
        variant="subtle"
        size={local.size}
      />
    );
  };

  return (
    <AffixInput
      {...rest}
      type={visible() ? 'text' : 'password'}
      size={local.size}
      suffix={suffix()}
      class={local.class}
    />
  );
};

export default PasswordInput;
