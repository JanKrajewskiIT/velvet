import { createSignal } from 'solid-js';

import { createLayer } from '../../hooks/createLayer';
import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import { Textarea } from '../forms/Textarea';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import styles from './OrganizerEventForm.module.css';
import type { EventDraft } from './organizerEvents';

export interface OrganizerEventFormProps {
  draft: EventDraft;
  /** Accent colour of the event being edited. */
  color?: string | undefined;
  onChange: (patch: Partial<EventDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
}

/** Inline editor for one event in the day panel: title, start and end date, time, description. Enter saves, Esc cancels. */
export const OrganizerEventForm = (props: OrganizerEventFormProps) => {
  const translate = useTranslate();
  const [root, setRoot] = createSignal<HTMLLIElement>();
  createLayer(
    () => true,
    () => props.onCancel(),
    { root },
  );

  return (
    <li ref={setRoot} class={styles.organizerPartForm} style={{ '--ec': props.color ?? 'var(--dv-1)' }}>
      <Control size="sm">
        <ControlInput
          value={props.draft.title}
          onInput={(e) => props.onChange({ title: e.currentTarget.value })}
          onKeyDown={(e) => e.key === 'Enter' && props.onSave()}
          aria-label={translate('velvet.patterns.calendarOrganizer.titleLabel')}
        />
      </Control>
      <div class={styles.organizerPartAddrow}>
        <Control size="sm">
          <ControlInput
            type="date"
            value={props.draft.date}
            onInput={(e) => props.onChange({ date: e.currentTarget.value })}
            aria-label={translate('velvet.common.date')}
          />
        </Control>
        <Control size="sm">
          <ControlInput
            type="date"
            value={props.draft.endDate}
            min={props.draft.date}
            onInput={(e) => props.onChange({ endDate: e.currentTarget.value })}
            aria-label={translate('velvet.patterns.calendarOrganizer.endDateLabel')}
          />
        </Control>
      </div>
      <Control size="sm" style={{ width: '6rem' }}>
        <ControlInput
          placeholder="09:30"
          value={props.draft.time}
          onInput={(e) => props.onChange({ time: e.currentTarget.value })}
          aria-label={translate('velvet.patterns.calendarOrganizer.timeLabel')}
        />
      </Control>
      <Textarea
        size="sm"
        rows={2}
        value={props.draft.description}
        onInput={(e) => props.onChange({ description: e.currentTarget.value })}
        aria-label={translate('velvet.patterns.calendarOrganizer.descriptionLabel')}
      />
      <div class={styles.organizerPartAddrow}>
        <Button variant="secondary" size="sm" onClick={() => props.onCancel()}>
          {translate('velvet.common.cancel')}
        </Button>
        <Button size="sm" disabled={!props.draft.title.trim()} onClick={() => props.onSave()}>
          {translate('velvet.common.save')}
        </Button>
      </div>
    </li>
  );
};
