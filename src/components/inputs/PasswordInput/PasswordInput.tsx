import { IoEye, IoEyeOutline } from 'solid-icons/io';
import { createSignal, splitProps } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { ComponentSize, InputCoreNativeProps } from '~/models/Props';

import IconButton from '../../buttons/IconButton/IconButton';
import AffixInput from '../AffixInput/AffixInput';
import styles from './PasswordInput.module.css';

interface PasswordInputMessages {
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

interface PasswordInputProps extends Omit<InputCoreNativeProps, 'type'> {
  showToggle?: boolean;
  visibilityLabel?: string;
  size?: ComponentSize;
  messages?: PasswordInputMessages;
}

const PasswordInput = (props: Props<PasswordInputProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, ['class', 'showToggle', 'visibilityLabel', 'size', 'messages']);
  const [visible, setVisible] = createSignal(false);
  const toggleButtonSize = (): ComponentSize => {
    if (local.size === 'sm') return 'sm';
    if (local.size === 'lg') return 'md';
    return 'sm';
  };

  const toggle = () => setVisible(!visible());
  const icon = () => (visible() ? IoEye : IoEyeOutline);
  const visibilityButtonLabel = () => {
    if (local.visibilityLabel) return local.visibilityLabel;
    return visible()
      ? (local.messages?.hidePasswordLabel ?? t('password.hide'))
      : (local.messages?.showPasswordLabel ?? t('password.show'));
  };

  const suffix = () => {
    if (local.showToggle === false) return undefined;

    return (
      <IconButton
        icon={icon()}
        label={visibilityButtonLabel()}
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
