import { IoEye, IoEyeOutline } from 'solid-icons/io';
import { createMemo, createSignal, splitProps } from 'solid-js';

import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import type { ComponentSize, InputCoreNativeProps } from '~/models/Props';

import IconButton from '../../buttons/IconButton/IconButton';
import AffixInput from '../AffixInput/AffixInput';
import styles from './PasswordInput.module.css';

interface PasswordInputProps extends Omit<InputCoreNativeProps, 'type'> {
  size?: ComponentSize;
}

const PasswordInput = (props: Props<PasswordInputProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['class', 'size']);
  const [visible, setVisible] = createSignal(false);
  const toggleButtonSize = createMemo<ComponentSize>(() => {
    if (local.size === 'sm') return 'sm';
    if (local.size === 'lg') return 'md';
    return 'sm';
  });

  const toggle = () => setVisible(!visible());
  const icon = createMemo(() => (visible() ? IoEye : IoEyeOutline));

  const suffix = createMemo(() => (
    <IconButton
      icon={icon()}
      label={visible() ? ts('password.hide') : ts('password.show')}
      onClick={toggle}
      aria-pressed={visible()}
      disabled={rest.disabled}
      variant="subtle"
      size={toggleButtonSize()}
    />
  ));

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
