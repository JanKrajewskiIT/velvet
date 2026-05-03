import { createMemo } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Input from '~/components/inputs/Input/Input';
import TextArea from '~/components/inputs/TextArea/TextArea';
import { useI18n } from '~/i18n';
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
  cancelLabel: string;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (event: SubmitEvent) => void;
  titleRef?: (element: HTMLInputElement) => void;
}

const SchedulerEventForm = (props: Props<SchedulerEventFormProps>) => {
  const { ts } = useI18n();
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

  const handleTitleRef = (element: HTMLInputElement) => {
    props.titleRef?.(element);
  };

  return (
    <form class={styles.createForm} onSubmit={(event) => props.onSubmit(event)}>
      <Input
        ref={handleTitleRef}
        type="text"
        placeholder={ts('scheduler.eventTitle')}
        value={props.title}
        onInput={handleTitleInput}
        required
      />
      <DateTimePicker value={dateTimeValue()} onChange={handleDateTimeChange} />
      <TextArea
        placeholder={ts('scheduler.descriptionOptional')}
        value={props.description}
        onInput={handleDescriptionInput}
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
