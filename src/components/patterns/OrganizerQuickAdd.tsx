import { createSignal } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import styles from './OrganizerQuickAdd.module.css';

export interface OrganizerQuickAddProps {
  onAdd: (title: string, time: string) => void;
}

/** Title, time and Add button at the foot of the day panel. */
export const OrganizerQuickAdd = (props: OrganizerQuickAddProps) => {
  const translate = useTranslate();
  const [title, setTitle] = createSignal('');
  const [time, setTime] = createSignal('');

  const add = () => {
    const text = title().trim();
    if (!text) return;
    props.onAdd(text, time());
    setTitle('');
    setTime('');
  };

  return (
    <div class={styles.organizerPartAdd}>
      <Control size="sm">
        <ControlInput
          placeholder={translate('velvet.patterns.calendarOrganizer.newEventPlaceholder')}
          value={title()}
          onInput={(e) => setTitle(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          aria-label={translate('velvet.patterns.calendarOrganizer.newEventLabel')}
        />
      </Control>
      <div class={styles.organizerPartAddrow}>
        <Control size="sm" style={{ width: '6rem' }}>
          <ControlInput
            placeholder="09:30"
            value={time()}
            onInput={(e) => setTime(e.currentTarget.value)}
            aria-label={translate('velvet.patterns.calendarOrganizer.timeLabel')}
          />
        </Control>
        <Button size="sm" iconLeft="plus" style={{ flex: 1 }} disabled={!title().trim()} onClick={add}>
          {translate('velvet.common.add')}
        </Button>
      </div>
    </div>
  );
};
