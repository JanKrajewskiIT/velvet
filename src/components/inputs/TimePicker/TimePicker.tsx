import { FiClock } from 'solid-icons/fi';
import { createMemo, createSignal, createUniqueId, For, Show } from 'solid-js';

import type Props from '~/models/Props';

import useClickOutside from '../../../hooks/useClickOutside';
import useEscapeKey from '../../../hooks/useEscapeKey';
import styles from './TimePicker.module.css';

interface TimePickerMessages {
  placeholder?: string;
  openPickerLabel?: string;
  optionsLabel?: string;
}

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  step?: number;
  label?: string;
  openPickerLabel?: string;
  optionsLabel?: string;
  messages?: TimePickerMessages;
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
  const dropdownId = createUniqueId();
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
  const placeholder = () => props.messages?.placeholder ?? props.placeholder ?? 'HH:MM';
  const openPickerLabel = () => props.messages?.openPickerLabel ?? props.openPickerLabel ?? 'Open time picker';
  const optionsLabel = () => props.messages?.optionsLabel ?? props.optionsLabel ?? 'Time options';

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
          placeholder={placeholder()}
          readOnly
          disabled={props.disabled}
        />
        <button
          type="button"
          class={styles.iconBtn}
          onClick={toggle}
          disabled={props.disabled}
          aria-label={openPickerLabel()}
          aria-haspopup="listbox"
          aria-expanded={isOpen()}
          aria-controls={isOpen() ? dropdownId : undefined}
        >
          <FiClock />
        </button>
      </div>
      <Show when={isOpen()}>
        <div ref={dropdownRef} id={dropdownId} class={styles.dropdown} role="listbox" aria-label={optionsLabel()}>
          <For each={timeOptions()}>
            {(time) => (
              <button
                type="button"
                class={optionClass(time)}
                onClick={() => select(time)}
                role="option"
                aria-selected={time === props.value}
              >
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
