import { FiClock } from 'solid-icons/fi';
import { createMemo, createSignal, createUniqueId, Show } from 'solid-js';

import DropdownFieldTrigger from '~/components/dropdowns/DropdownFieldTrigger/DropdownFieldTrigger';
import type { InputSize } from '~/components/inputs/Input/Input';
import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { AriaFieldProps } from '~/models/Props';
import { resolveAriaInvalid } from '~/utils/aria';

import DateTimeFieldTrigger from '../DateTimeFieldTrigger/DateTimeFieldTrigger';
import TimePanel from '../TimePanel/TimePanel';
import styles from './TimePicker.module.css';

export interface TimePickerMessages {
  placeholder?: string;
  openPickerLabel?: string;
  optionsLabel?: string;
}

interface TimePickerProps extends AriaFieldProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  step?: number;
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
  const { t } = useI18n();
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
  const placeholder = () => props.messages?.placeholder ?? props.placeholder ?? t('time.hhmm');
  const openPickerLabel = () =>
    props.messages?.openPickerLabel ?? props.openPickerLabel ?? t('datetime.openTimePicker');
  const optionsLabel = () => props.messages?.optionsLabel ?? props.optionsLabel ?? t('datetime.timeOptions');

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

  return (
    <DateTimeFieldTrigger
      ref={wrapperRef}
      class={props.class}
      open={isOpen()}
      trigger={(triggerClass) => (
        <DropdownFieldTrigger
          size={props.size}
          label={props.value || placeholder()}
          labelTone={props.value ? 'default' : 'muted'}
          class={triggerClass}
          disabled={props.disabled}
          onClick={toggle}
          aria-label={openPickerLabel()}
          aria-haspopup="listbox"
          aria-expanded={isOpen()}
          aria-controls={isOpen() ? dropdownId : undefined}
          aria-invalid={resolveAriaInvalid(undefined, props['aria-invalid'])}
          aria-errormessage={props['aria-errormessage']}
        >
          <FiClock />
        </DropdownFieldTrigger>
      )}
    >
      <Show when={isOpen()}>
        <TimePanel
          surfaceRef={(element) => {
            dropdownRef = element;
          }}
          id={dropdownId}
          ariaLabel={optionsLabel()}
          options={timeOptions()}
          value={props.value}
          onSelect={select}
          panelClass={styles.dropdown}
        />
      </Show>
    </DateTimeFieldTrigger>
  );
};

export default TimePicker;
