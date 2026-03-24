import { createMemo } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Input from '~/components/inputs/Input/Input';
import TextArea from '~/components/inputs/TextArea/TextArea';
import type Props from '~/models/Props';

import DateTimePicker from '../DateTimePicker/DateTimePicker';
import styles from './Scheduler.module.css';

interface SchedulerEventFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  date: string;
  time: string;
  onDateTimeChange: (date: string, time: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
  cancelLabel: string;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (event: SubmitEvent) => void;
  titleRef?: (element: HTMLInputElement) => void;
}

const SchedulerEventForm = (props: Props<SchedulerEventFormProps>) => {
  const dateTimeValue = createMemo(() => (props.time ? `${props.date}T${props.time}` : props.date));

  const handleDateTimeChange = (value: string) => {
    const [date = '', time = ''] = value.split('T');
    props.onDateTimeChange(date, time);
  };

  return (
    <form class={styles.createForm} onSubmit={(event) => props.onSubmit(event)}>
      <Input
        ref={(element) => props.titleRef?.(element)}
        type="text"
        placeholder={props.titlePlaceholder}
        value={props.title}
        onInput={(event) => props.onTitleChange(event.currentTarget.value)}
        required
      />
      <div class={styles.createRowSingle}>
        <DateTimePicker value={dateTimeValue()} onChange={handleDateTimeChange} />
      </div>
      <TextArea
        placeholder={props.descriptionPlaceholder}
        value={props.description}
        onInput={(event) => props.onDescriptionChange(event.currentTarget.value)}
      />
      <div class={styles.createActions}>
        <Button size="sm" variant="ghost" onClick={props.onCancel}>
          {props.cancelLabel}
        </Button>
        <Button size="sm" variant="primary" type="submit">
          {props.submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default SchedulerEventForm;
