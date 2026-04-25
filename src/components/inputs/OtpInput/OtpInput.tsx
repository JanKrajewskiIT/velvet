import { createEffect, createMemo, For, type JSX, on, splitProps } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import Input from '../Input/Input';
import styles from './OtpInput.module.css';

interface OtpInputOwnProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  size?: ComponentSize;
}

const sizeClassByValue: Record<ComponentSize, string | undefined> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const OtpInput = (props: Props<OtpInputOwnProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['length', 'value', 'onChange', 'disabled', 'size', 'class']);
  const refs: HTMLInputElement[] = [];

  const length = createMemo(() => local.length ?? 6);
  const digits = createMemo(() => Array.from({ length: length() }, (_, i) => i));

  createEffect(
    on(
      length,
      (len) => {
        if (local.value.length !== len) {
          const normalized = local.value.slice(0, len);
          if (normalized !== local.value) {
            local.onChange(normalized);
          }
        }
      },
      { defer: true },
    ),
  );

  const focusAt = (index: number) => {
    const target = refs[index];
    if (target) target.focus();
  };

  const handleInput = (index: number, e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const input = e.currentTarget;
    const char = input.value.slice(-1);
    const valueChars = local.value.split('').slice(0, length());
    while (valueChars.length < length()) {
      valueChars.push('');
    }
    valueChars[index] = char;
    local.onChange(valueChars.join(''));
    if (char && index < length() - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
    if (e.key === 'Backspace') {
      const input = refs[index];
      if (input && !input.value && index > 0) {
        focusAt(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusAt(index - 1);
    } else if (e.key === 'ArrowRight' && index < length() - 1) {
      focusAt(index + 1);
    }
  };

  const handlePaste: JSX.EventHandlerUnion<HTMLDivElement, ClipboardEvent> = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData?.getData('text') ?? '';
    const chars = pasted.slice(0, length()).split('');
    local.onChange(chars.join(''));
    const nextIndex = Math.min(chars.length, length() - 1);
    focusAt(nextIndex);
  };
  const sizeClass = createMemo(() => sizeClassByValue[local.size ?? 'md']);

  return (
    <div
      {...rest}
      class={classNames(styles.wrapper, local.disabled && styles.disabled, local.class)}
      role="group"
      aria-label={ts('otp.group')}
      onPaste={handlePaste}
    >
      <For each={digits()}>
        {(index) => (
          <Input
            ref={(el: HTMLInputElement) => {
              refs[index] = el;
            }}
            class={classNames(styles.box, sizeClass(), local.value[index] && styles.boxFilled)}
            type="text"
            inputmode="numeric"
            maxlength={1}
            disabled={local.disabled}
            autocomplete="one-time-code"
            aria-label={ts('otp.digit', { index: String(index + 1) })}
            value={local.value[index] ?? ''}
            style={{ '--delay': `${index * 50}ms` }}
            onInput={(event) => handleInput(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
          />
        )}
      </For>
    </div>
  );
};

export default OtpInput;
