import { createMemo } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Input from '~/components/inputs/Input/Input';
import TextArea from '~/components/inputs/TextArea/TextArea';
import type Props from '~/models/Props';
import { splitDateTimeValue } from '~/utils/datetime';

import DateTimePicker from '../../DateTimePicker/DateTimePicker';
import styles from './SchedulerEventForm.module.css';

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
    const { date, time } = splitDateTimeValue(value);
    props.onDateTimeChange(date, time);
  };

  const handleTitleInput = (event: InputEvent & { currentTarget: HTMLInputElement }) => {
    props.onTitleChange(event.currentTarget.value);
  };

  const handleDescriptionInput = (event: InputEvent & { currentTarget: HTMLTextAreaElement }) => {
    props.onDescriptionChange(event.currentTarget.value);
  };

  return (
    <form class={styles.createForm} onSubmit={(event) => props.onSubmit(event)}>
      <Input
        ref={(element: HTMLInputElement) => props.titleRef?.(element)}
        type="text"
        placeholder={props.titlePlaceholder}
        value={props.title}
        onInput={handleTitleInput}
        required
      />
      <div class={styles.createRowSingle}>
        <DateTimePicker value={dateTimeValue()} onChange={handleDateTimeChange} />
      </div>
      <TextArea placeholder={props.descriptionPlaceholder} value={props.description} onInput={handleDescriptionInput} />
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
