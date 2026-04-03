import { createMemo, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { AriaFieldProps, ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';
import { joinDateTimeValue, splitDateTimeValue } from '~/utils/datetime';

import DatePicker from '../DatePicker/DatePicker';
import TimePicker from '../TimePicker/TimePicker';
import styles from './DateTimePicker.module.css';

export interface DateTimePickerProps extends AriaFieldProps {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  locale?: string;
  minDate?: string;
  maxDate?: string;
  step?: number;
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
    'size',
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
    'aria-errormessage',
  ]);
  const parts = createMemo(() => {
    return splitDateTimeValue(local.value);
  });

  const handleDateChange = (date: string) => {
    local.onChange(joinDateTimeValue(date, parts().time));
  };

  const handleTimeChange = (time: string) => {
    const nextDate = parts().date;
    if (!nextDate) {
      local.onChange('');
      return;
    }

    local.onChange(joinDateTimeValue(nextDate, time));
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
        aria-labelledby={local['aria-labelledby']}
        aria-describedby={local['aria-describedby']}
      />
    </div>
  );
};

export default DateTimePicker;
