import { FiClock } from 'solid-icons/fi';
import { createMemo, createSignal, createUniqueId, Show } from 'solid-js';

import DropdownFieldTrigger from '~/components/dropdowns/Dropdown/DropdownFieldTrigger/DropdownFieldTrigger';
import Icon from '~/components/media/Icon/Icon';
import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { AriaFieldProps, ComponentSize } from '~/models/Props';
import { joinAriaIds, resolveAriaInvalid } from '~/utils/aria';
import { buildTimeOptions } from '~/utils/datetime';

import DateTimeFieldTrigger from '../DateTimeFieldTrigger/DateTimeFieldTrigger';
import TimePanel from './TimePanel/TimePanel';
import styles from './TimePicker.module.css';

export interface TimePickerMessages {
  placeholder?: string;
  openPickerLabel?: string;
  optionsLabel?: string;
}

export interface TimePickerProps extends AriaFieldProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  step?: number;
  size?: ComponentSize;
  openPickerLabel?: string;
  optionsLabel?: string;
  messages?: TimePickerMessages;
}

const TimePicker = (props: Props<TimePickerProps>) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = createSignal(false);
  const dropdownId = createUniqueId();
  const triggerLabelId = createUniqueId();
  let wrapperRef: HTMLDivElement | undefined;
  let dropdownRef: HTMLDivElement | undefined;

  const close = () => setIsOpen(false);

  useClickOutside(
    () => wrapperRef,
    () => isOpen(),
    close
  );
  useEscapeKey(() => isOpen(), close);

  const timeOptions = createMemo(() => buildTimeOptions(props.step ?? 30));
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
          id={props.id}
          label={props.value || placeholder()}
          labelId={triggerLabelId}
          labelTone={props.value ? 'default' : 'muted'}
          class={triggerClass}
          disabled={props.disabled}
          onClick={toggle}
          title={openPickerLabel()}
          aria-haspopup="listbox"
          aria-expanded={isOpen()}
          aria-controls={isOpen() ? dropdownId : undefined}
          aria-labelledby={joinAriaIds(props['aria-labelledby'], triggerLabelId)}
          aria-describedby={props['aria-describedby']}
          aria-invalid={resolveAriaInvalid(undefined, props['aria-invalid'])}
          aria-errormessage={props['aria-errormessage']}
        >
          <Icon icon={FiClock} />
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
