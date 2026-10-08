import { createSignal } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import { Control } from '../primitives/Control';

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
    <div class="vui-organizer__add">
      <Control size="sm">
        <input
          class="vui-control__input"
          placeholder={translate('velvet.patterns.calendarOrganizer.newEventPlaceholder')}
          value={title()}
          onInput={(e) => setTitle(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          aria-label={translate('velvet.patterns.calendarOrganizer.newEventLabel')}
        />
      </Control>
      <div class="vui-organizer__addrow">
        <Control size="sm" style={{ width: '6rem' }}>
          <input
            class="vui-control__input"
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
