import { IoAdd, IoRemove } from 'solid-icons/io';
import { createMemo, type JSX, onCleanup, splitProps } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { AriaFieldProps, ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import AffixInput from '../AffixInput/AffixInput';
import styles from './NumberInput.module.css';

interface NumberInputOwnProps extends AriaFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  size?: ComponentSize;
}

const NumberInput = (props: Props<NumberInputOwnProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, [
    'value',
    'onChange',
    'min',
    'max',
    'step',
    'id',
    'name',
    'disabled',
    'readOnly',
    'required',
    'invalid',
    'size',
    'class',
  ]);

  const min = createMemo(() => local.min ?? -Infinity);
  const max = createMemo(() => local.max ?? Infinity);
  const step = createMemo(() => local.step ?? 1);
  const size = createMemo(() => local.size ?? 'md');
  const controlSize = createMemo<ComponentSize>(() => {
    const current = size();
    if (current === 'sm') return 'sm';
    if (current === 'lg') return 'md';
    return 'sm';
  });
  const clamp = (value: number) => Math.min(max(), Math.max(min(), value));

  const increment = () => {
    if (local.disabled || local.readOnly) return;
    local.onChange(clamp(local.value + step()));
  };

  const decrement = () => {
    if (local.disabled || local.readOnly) return;
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
    if (local.readOnly) return;
    const raw = e.currentTarget.value.trim();
    if (raw.length === 0) return;
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) {
      local.onChange(clamp(parsed));
    }
  };

  return (
    <AffixInput
      {...rest}
      id={local.id}
      name={local.name}
      type="number"
      size={size()}
      class={classNames(styles.controls, local.class)}
      inputClass={styles.input}
      value={local.value}
      disabled={local.disabled}
      readOnly={local.readOnly}
      required={local.required}
      invalid={local.invalid}
      onKeyDown={handleKeyDown}
      onChange={handleInputChange}
      prefix={
        <IconButton
          icon={IoRemove}
          label={ts('number.decrease')}
          disabled={local.disabled || local.readOnly}
          onClick={decrement}
          onMouseDown={() => startRepeat(decrement)}
          onMouseUp={stopRepeat}
          onMouseLeave={stopRepeat}
          size={controlSize()}
          variant="subtle"
        />
      }
      suffix={
        <IconButton
          icon={IoAdd}
          label={ts('number.increase')}
          disabled={local.disabled || local.readOnly}
          onClick={increment}
          onMouseDown={() => startRepeat(increment)}
          onMouseUp={stopRepeat}
          onMouseLeave={stopRepeat}
          size={controlSize()}
          variant="subtle"
        />
      }
    />
  );
};

export default NumberInput;
