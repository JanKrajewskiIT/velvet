import { createMemo } from 'solid-js';

import type { InputSize } from '~/components/inputs/Input/Input';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { DatePickerMessages } from '../DatePicker/DatePicker';
import DatePicker from '../DatePicker/DatePicker';
import type { TimePickerMessages } from '../TimePicker/TimePicker';
import TimePicker from '../TimePicker/TimePicker';
import styles from './DateTimePicker.module.css';

interface DateTimePickerProps {
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
  size?: InputSize;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
}

const DateTimePicker = (props: Props<DateTimePickerProps>) => {
  const parts = createMemo(() => {
    const value = props.value ?? '';
    const [date = '', time = ''] = value.split('T');
    return { date, time };
  });

  const handleDateChange = (date: string) => {
    const nextTime = parts().time || '00:00';
    props.onChange(`${date}T${nextTime}`);
  };

  const handleTimeChange = (time: string) => {
    const nextDate = parts().date;
    if (!nextDate) {
      props.onChange('');
      return;
    }

    props.onChange(`${nextDate}T${time}`);
  };

  return (
    <div
      id={props.id}
      class={classNames(styles.wrapper, props.class)}
      role="group"
      aria-labelledby={props['aria-labelledby']}
      aria-describedby={props['aria-describedby']}
    >
      <DatePicker
        value={parts().date}
        onChange={handleDateChange}
        disabled={props.disabled}
        locale={props.locale}
        size={props.size}
        min={props.minDate}
        max={props.maxDate}
        placeholder={props.datePlaceholder}
        messages={props.dateMessages}
      />
      <TimePicker
        value={parts().time}
        onChange={handleTimeChange}
        disabled={props.disabled || !parts().date}
        size={props.size}
        step={props.step}
        placeholder={props.timePlaceholder}
        messages={props.timeMessages}
      />
    </div>
  );
};

export default DateTimePicker;
