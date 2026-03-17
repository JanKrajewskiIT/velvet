import { FiClock } from 'solid-icons/fi';
import { createMemo, createSignal, createUniqueId, For, Show } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import DropdownOption from '~/components/dropdowns/DropdownOption/DropdownOption';
import DropdownSurface from '~/components/dropdowns/DropdownSurface/DropdownSurface';
import AffixInput from '~/components/inputs/AffixInput/AffixInput';
import type { InputSize } from '~/components/inputs/Input/Input';
import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './TimePicker.module.css';

export interface TimePickerMessages {
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
  size?: InputSize;
  openPickerLabel?: string;
  optionsLabel?: string;
  messages?: TimePickerMessages;
}

const pad = (n: number): string => String(n).padStart(2, '0');

const generateTimeOptions = (step: number): string[] => {
  const options: string[] = [];
  const safeStep = Number.isFinite(step) && step > 0 ? Math.max(1, Math.floor(step)) : 30;
  for (let m = 0; m < 1440; m += safeStep) {
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

  const optionClass = (): string => styles.option ?? '';

  return (
    <div ref={wrapperRef} class={classNames(styles.wrapper, props.class)}>
      <Show when={props.label}>
        <span class={styles.label}>{props.label}</span>
      </Show>
      <AffixInput
        type="text"
        size={props.size}
        inputClass={styles.input}
        value={props.value ?? ''}
        placeholder={placeholder()}
        readOnly
        disabled={props.disabled}
        class={props.disabled ? styles.inputRowDisabled : undefined}
        suffix={
          <IconButton
            icon={<FiClock />}
            title={openPickerLabel()}
            class={styles.iconBtn}
            onClick={toggle}
            disabled={props.disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen()}
            aria-controls={isOpen() ? dropdownId : undefined}
            size="sm"
            variant="subtle"
          />
        }
      />
      <Show when={isOpen()}>
        <DropdownSurface
          ref={dropdownRef}
          id={dropdownId}
          class={styles.dropdown}
          align="right"
          origin="top"
          role="listbox"
          aria-label={optionsLabel()}
        >
          <For each={timeOptions()}>
            {(time) => (
              <DropdownOption
                class={optionClass()}
                selected={time === props.value}
                label={time}
                onClick={() => select(time)}
                role="option"
                aria-selected={time === props.value}
              />
            )}
          </For>
        </DropdownSurface>
      </Show>
    </div>
  );
};

export default TimePicker;
