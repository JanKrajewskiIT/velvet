import { IoCheckmark, IoCopy } from 'solid-icons/io';
import { batch, createMemo, createSignal, onCleanup, Show, splitProps } from 'solid-js';

import Icon from '~/components/media/Icon/Icon';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import AffixButton from '../AffixButton/AffixButton';
import styles from './CopyButton.module.css';

interface CopyButtonProps {
  text: string;
  variant?: 'ghost' | 'outline';
  size?: ComponentSize;
}

const CopyButton = (props: Props<CopyButtonProps>) => {
  const { ts } = useI18n();
  const [local] = splitProps(props, ['class', 'text', 'variant', 'size']);
  const [copied, setCopied] = createSignal(false);
  const [failed, setFailed] = createSignal(false);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const buttonText = createMemo(() => {
    if (copied()) return ts('common.copied');
    if (failed()) return ts('common.copyFailed');
    return ts('common.copy');
  });
  const buttonClass = createMemo(() => classNames(copied() && styles.copied, failed() && styles.failed, local.class));

  const handleClick = () => {
    const timeout = 2000;
    const text = local.text;
    void navigator.clipboard
      .writeText(text)
      .then(() => {
        batch(() => {
          setFailed(false);
          setCopied(true);
        });
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setCopied(false), timeout);
      })
      .catch(() => {
        batch(() => {
          setCopied(false);
          setFailed(true);
        });
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setFailed(false), timeout);
      });
  };

  onCleanup(() => clearTimeout(timeoutId));

  return (
    <AffixButton
      class={buttonClass()}
      type="button"
      variant={local.variant ?? 'ghost'}
      size={local.size}
      prefix={
        <span class={styles.icon}>
          <Show when={copied()} fallback={<Icon icon={IoCopy} />}>
            <Icon icon={IoCheckmark} />
          </Show>
        </span>
      }
      onClick={handleClick}
      text={buttonText()}
    />
  );
};

export default CopyButton;
