import { IoCheckmark, IoCopy } from 'solid-icons/io';
import { createSignal, onCleanup, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import ButtonBase from '../shared/ButtonBase';
import styles from './CopyButton.module.css';

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  timeout?: number;
  variant?: 'ghost' | 'outline';
  size?: 'sm' | 'md';
}

const CopyButton = (props: Props<CopyButtonProps>) => {
  const [copied, setCopied] = createSignal(false);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const handleClick = () => {
    const timeout = props.timeout ?? 2000;
    const text = props.text;
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setCopied(false), timeout);
    });
  };

  onCleanup(() => clearTimeout(timeoutId));

  return (
    <ButtonBase
      type="button"
      variant={props.variant ?? 'ghost'}
      size={props.size ?? 'md'}
      class={classNames(copied() && styles.copied, props.class)}
      onClick={handleClick}
    >
      <span class={styles.icon}>
        <Show when={copied()} fallback={<IoCopy />}>
          <IoCheckmark />
        </Show>
      </span>
      {copied() ? (props.copiedLabel ?? 'Copied!') : (props.label ?? 'Copy')}
    </ButtonBase>
  );
};

export default CopyButton;
