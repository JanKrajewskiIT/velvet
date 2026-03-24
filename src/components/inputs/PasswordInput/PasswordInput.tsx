import { IoEye, IoEyeOutline } from 'solid-icons/io';
import { createSignal, type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import type { ButtonSize } from '../../buttons/Button/Button';
import IconButton from '../../buttons/IconButton/IconButton';
import AffixInput from '../AffixInput/AffixInput';
import type { InputSize } from '../Input/Input';
import styles from './PasswordInput.module.css';

interface PasswordInputMessages {
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

interface PasswordInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showToggle?: boolean;
  visibilityLabel?: string;
  size?: InputSize;
  messages?: PasswordInputMessages;
}

const PasswordInput = (props: Props<PasswordInputProps>) => {
  const [local, rest] = splitProps(props, ['class', 'showToggle', 'visibilityLabel', 'size', 'messages']);
  const [visible, setVisible] = createSignal(false);
  const toggleButtonSize = (): ButtonSize => {
    if (local.size === 'sm') return 'sm';
    if (local.size === 'lg') return 'md';
    return 'sm';
  };

  const toggle = () => setVisible(!visible());
  const icon = () => (visible() ? <IoEye /> : <IoEyeOutline />);
  const visibilityButtonLabel = () => {
    if (local.visibilityLabel) return local.visibilityLabel;
    return visible()
      ? (local.messages?.hidePasswordLabel ?? 'Hide password')
      : (local.messages?.showPasswordLabel ?? 'Show password');
  };

  const suffix = () => {
    if (local.showToggle === false) return undefined;

    return (
      <IconButton
        icon={icon()}
        title={visibilityButtonLabel()}
        onClick={toggle}
        aria-pressed={visible()}
        disabled={rest.disabled}
        variant="subtle"
        size={toggleButtonSize()}
      />
    );
  };

  return (
    <AffixInput
      {...rest}
      type={visible() ? 'text' : 'password'}
      size={local.size}
      suffix={suffix()}
      inputClass={styles.input}
      class={local.class}
    />
  );
};

export default PasswordInput;
