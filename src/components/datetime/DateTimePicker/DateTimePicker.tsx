import { createMemo, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { AriaFieldProps, ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import type { DatePickerMessages } from '../DatePicker/DatePicker';
import DatePicker from '../DatePicker/DatePicker';
import type { TimePickerMessages } from '../TimePicker/TimePicker';
import TimePicker from '../TimePicker/TimePicker';
import styles from './DateTimePicker.module.css';

interface DateTimePickerProps extends AriaFieldProps {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  locale?: string;
  minDate?: string;
  maxDate?: string;
  step?: number;
  datePlaceholder?: string;
  timePlaceholder?: string;
  dateMessages?: DatePickerMessages;
  timeMessages?: TimePickerMessages;
  size?: ComponentSize;
}

const DateTimePicker = (props: Props<DateTimePickerProps>) => {
  const [local, rest] = splitProps(props, [
    'id',
    'class',
    'value',
    'onChange',
    'disabled',
    'locale',
    'minDate',
    'maxDate',
    'step',
    'datePlaceholder',
    'timePlaceholder',
    'dateMessages',
    'timeMessages',
    'size',
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
    'aria-errormessage',
  ]);
  const parts = createMemo(() => {
    const value = local.value ?? '';
    const [date = '', time = ''] = value.split('T');
    return { date, time };
  });

  const handleDateChange = (date: string) => {
    const nextTime = parts().time || '00:00';
    local.onChange(`${date}T${nextTime}`);
  };

  const handleTimeChange = (time: string) => {
    const nextDate = parts().date;
    if (!nextDate) {
      local.onChange('');
      return;
    }

    local.onChange(`${nextDate}T${time}`);
  };

  return (
    <div
      {...rest}
      class={classNames(styles.wrapper, local.class)}
      role="group"
      aria-labelledby={local['aria-labelledby']}
      aria-describedby={local['aria-describedby']}
    >
      <DatePicker
        id={local.id}
        value={parts().date}
        onChange={handleDateChange}
        disabled={local.disabled}
        locale={local.locale}
        size={local.size}
        min={local.minDate}
        max={local.maxDate}
        placeholder={local.datePlaceholder}
        messages={local.dateMessages}
        aria-labelledby={local['aria-labelledby']}
        aria-describedby={local['aria-describedby']}
        aria-invalid={local['aria-invalid']}
        aria-errormessage={local['aria-errormessage']}
      />
      <TimePicker
        value={parts().time}
        onChange={handleTimeChange}
        disabled={local.disabled || !parts().date}
        size={local.size}
        step={local.step}
        placeholder={local.timePlaceholder}
        messages={local.timeMessages}
        aria-labelledby={local['aria-labelledby']}
        aria-describedby={local['aria-describedby']}
        aria-invalid={local['aria-invalid']}
        aria-errormessage={local['aria-errormessage']}
      />
    </div>
  );
};

export default DateTimePicker;
