import { IoAdd, IoRemove } from 'solid-icons/io';
import { type JSX, onCleanup, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { InputSize } from '../Input/Input';
import InputBase from '../shared/InputBase';
import styles from './NumberInput.module.css';

interface NumberInputMessages {
  decrementButtonLabel?: string;
  incrementButtonLabel?: string;
}

interface NumberInputOwnProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  size?: InputSize;
  decrementLabel?: string;
  incrementLabel?: string;
  messages?: NumberInputMessages;
}

const NumberInput = (props: Props<NumberInputOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'value',
    'onChange',
    'min',
    'max',
    'step',
    'label',
    'disabled',
    'size',
    'decrementLabel',
    'incrementLabel',
    'messages',
    'class',
  ]);

  const min = () => local.min ?? -Infinity;
  const max = () => local.max ?? Infinity;
  const step = () => local.step ?? 1;
  const size = () => local.size ?? 'md';

  const clamp = (v: number) => Math.min(max(), Math.max(min(), v));

  const increment = () => {
    if (local.disabled) return;
    local.onChange(clamp(local.value + step()));
  };

  const decrement = () => {
    if (local.disabled) return;
    local.onChange(clamp(local.value - step()));
  };

  let intervalId: number | undefined;
  let timeoutId: number | undefined;

  const stopRepeat = () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    intervalId = undefined;
    timeoutId = undefined;
  };

  const startRepeat = (action: () => void) => {
    action();
    timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(action, 80);
    }, 400);
  };

  onCleanup(stopRepeat);

  const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      increment();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      decrement();
    }
  };

  const handleInputChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
    const parsed = Number(e.currentTarget.value);
    if (!Number.isNaN(parsed)) {
      local.onChange(clamp(parsed));
    }
  };

  const sizeClass = () => {
    if (size() === 'sm') return styles.sizeSm;
    if (size() === 'lg') return styles.sizeLg;
    return styles.sizeMd;
  };

  return (
    <div class={classNames(styles.wrapper, local.disabled && styles.disabled, local.class)}>
      <Show when={local.label}>
        <label class={styles.label}>{local.label}</label>
      </Show>
      <InputBase
        class={classNames(styles.controls, sizeClass())}
        size={local.size}
        disabled={local.disabled}
        focusWithin
      >
        <button
          type="button"
          class={styles.button}
          disabled={local.disabled}
          onClick={decrement}
          onMouseDown={() => startRepeat(decrement)}
          onMouseUp={stopRepeat}
          onMouseLeave={stopRepeat}
          aria-label={local.messages?.decrementButtonLabel ?? local.decrementLabel ?? 'Decrease'}
        >
          <IoRemove />
        </button>
        <input
          {...rest}
          type="number"
          class={styles.input}
          value={local.value}
          disabled={local.disabled}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
        />
        <button
          type="button"
          class={styles.button}
          disabled={local.disabled}
          onClick={increment}
          onMouseDown={() => startRepeat(increment)}
          onMouseUp={stopRepeat}
          onMouseLeave={stopRepeat}
          aria-label={local.messages?.incrementButtonLabel ?? local.incrementLabel ?? 'Increase'}
        >
          <IoAdd />
        </button>
      </InputBase>
    </div>
  );
};

export default NumberInput;
