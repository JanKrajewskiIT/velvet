import { IoCheckmark, IoCopy } from 'solid-icons/io';
import { createSignal, onCleanup, Show } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import AffixButton from '../AffixButton/AffixButton';
import type { ButtonSize } from '../Button/Button';
import styles from './CopyButton.module.css';

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  errorLabel?: string;
  timeout?: number;
  variant?: 'ghost' | 'outline';
  size?: ButtonSize;
}

const CopyButton = (props: Props<CopyButtonProps>) => {
  const { t } = useI18n();
  const [copied, setCopied] = createSignal(false);
  const [failed, setFailed] = createSignal(false);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const handleClick = () => {
    const timeout = props.timeout ?? 2000;
    const text = props.text;
    void navigator.clipboard
      .writeText(text)
      .then(() => {
        setFailed(false);
        setCopied(true);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setCopied(false), timeout);
      })
      .catch(() => {
        setCopied(false);
        setFailed(true);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setFailed(false), timeout);
      });
  };

  onCleanup(() => clearTimeout(timeoutId));

  return (
    <AffixButton
      class={classNames(copied() && styles.copied, failed() && styles.failed, props.class)}
      type="button"
      variant={props.variant ?? 'ghost'}
      size={props.size}
      prefix={
        <span class={styles.icon}>
          <Show when={copied()} fallback={<IoCopy />}>
            <IoCheckmark />
          </Show>
        </span>
      }
      onClick={handleClick}
      text={
        copied()
          ? (props.copiedLabel ?? t('common.copied'))
          : failed()
            ? (props.errorLabel ?? t('common.copyFailed'))
            : (props.label ?? t('common.copy'))
      }
    />
  );
};

export default CopyButton;
