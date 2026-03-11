import { createEffect, For } from 'solid-js';

import type Props from '~/models/Props';

import styles from './OtpInput.module.css';

interface OtpInputOwnProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const OtpInput = (props: Props<OtpInputOwnProps>) => {
  const refs: HTMLInputElement[] = [];

  const length = () => props.length ?? 6;
  const digits = () => Array.from({ length: length() }, (_, i) => i);

  createEffect(() => {
    const chars = props.value.split('');
    refs.forEach((input, i) => {
      input.value = chars[i] ?? '';
    });
  });

  const focusAt = (index: number) => {
    const target = refs[index];
    if (target) target.focus();
  };

  const updateValue = () => {
    const newValue = refs.map((input) => input.value).join('');
    props.onChange(newValue);
  };

  const handleInput = (index: number, e: InputEvent) => {
    const input = e.currentTarget as HTMLInputElement;
    const char = input.value.slice(-1);
    input.value = char;
    updateValue();
    if (char && index < length() - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
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

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData?.getData('text') ?? '';
    const chars = pasted.slice(0, length()).split('');
    chars.forEach((char, i) => {
      if (refs[i]) refs[i].value = char;
    });
    updateValue();
    const nextIndex = Math.min(chars.length, length() - 1);
    focusAt(nextIndex);
  };

  return (
    <div
      class={`${styles.wrapper} ${props.disabled ? styles.disabled : ''} ${props.class ?? ''}`}
      onPaste={handlePaste}
    >
      <For each={digits()}>
        {(index) => (
          <input
            ref={(el) => {
              refs[index] = el;
            }}
            class={styles.box}
            type="text"
            inputmode="numeric"
            maxLength={1}
            disabled={props.disabled}
            autocomplete="one-time-code"
            style={{ '--delay': `${index * 50}ms` }}
            onInput={(e) => handleInput(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        )}
      </For>
    </div>
  );
};

export default OtpInput;
