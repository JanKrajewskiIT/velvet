import { FiClock } from 'solid-icons/fi';
import { createMemo, createSignal, For, Show } from 'solid-js';

import type Props from '~/models/Props';

import useClickOutside from '../../../hooks/useClickOutside';
import useEscapeKey from '../../../hooks/useEscapeKey';
import styles from './TimePicker.module.css';

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  step?: number;
  label?: string;
}

const pad = (n: number): string => String(n).padStart(2, '0');

const generateTimeOptions = (step: number): string[] => {
  const options: string[] = [];
  for (let m = 0; m < 1440; m += step) {
    options.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  }
  return options;
};

const TimePicker = (props: Props<TimePickerProps>) => {
  const [isOpen, setIsOpen] = createSignal(false);
  let wrapperRef: HTMLDivElement | undefined;
  let dropdownRef: HTMLDivElement | undefined;

  const close = () => setIsOpen(false);

  useClickOutside(
    () => wrapperRef,
    () => isOpen(),
    close
  );
  useEscapeKey(() => isOpen(), close);

  const timeOptions = createMemo(() => generateTimeOptions(props.step ?? 30));

  const scrollToSelected = () => {
    if (!dropdownRef || !props.value) return;
    const idx = timeOptions().indexOf(props.value);
    if (idx < 0) return;
    const child = dropdownRef.children[idx] as HTMLElement | undefined;
    if (child) child.scrollIntoView({ block: 'center' });
  };

  const toggle = () => {
    if (props.disabled) return;
    const opening = !isOpen();
    setIsOpen(opening);
    if (opening) requestAnimationFrame(scrollToSelected);
  };

  const select = (time: string) => {
    props.onChange(time);
    close();
  };

  const optionClass = (time: string): string => `${styles.option} ${time === props.value ? styles.optionSelected : ''}`;

  return (
    <div ref={wrapperRef} class={`${styles.wrapper} ${props.class ?? ''}`}>
      <Show when={props.label}>
        <span class={styles.label}>{props.label}</span>
      </Show>
      <div class={`${styles.inputRow} ${props.disabled ? styles.inputRowDisabled : ''}`}>
        <input
          type="text"
          class={styles.input}
          value={props.value ?? ''}
          placeholder={props.placeholder ?? 'HH:MM'}
          readOnly
          disabled={props.disabled}
        />
        <button type="button" class={styles.iconBtn} onClick={toggle} disabled={props.disabled}>
          <FiClock />
        </button>
      </div>
      <Show when={isOpen()}>
        <div ref={dropdownRef} class={styles.dropdown}>
          <For each={timeOptions()}>
            {(time) => (
              <button type="button" class={optionClass(time)} onClick={() => select(time)}>
                {time}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default TimePicker;
