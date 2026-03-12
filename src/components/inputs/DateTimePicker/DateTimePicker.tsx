import { createMemo } from 'solid-js';

import type Props from '~/models/Props';

import DatePicker from '../DatePicker/DatePicker';
import TimePicker from '../TimePicker/TimePicker';
import styles from './DateTimePicker.module.css';

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  step?: number;
  dateLabel?: string;
  timeLabel?: string;
  datePlaceholder?: string;
  timePlaceholder?: string;
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
    <div class={`${styles.wrapper} ${props.class ?? ''}`}>
      <DatePicker
        value={parts().date}
        onChange={handleDateChange}
        disabled={props.disabled}
        min={props.minDate}
        max={props.maxDate}
        label={props.dateLabel}
        placeholder={props.datePlaceholder}
      />
      <TimePicker
        value={parts().time}
        onChange={handleTimeChange}
        disabled={props.disabled || !parts().date}
        step={props.step}
        label={props.timeLabel}
        placeholder={props.timePlaceholder}
      />
    </div>
  );
};

export default DateTimePicker;
