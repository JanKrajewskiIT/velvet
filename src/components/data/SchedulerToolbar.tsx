import type { I18nKey } from '@jankrajewskiit/i18n';
import { For } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { addDays, startOfDay } from '../../utils/date';
import { Button } from '../actions/Button';
import { ButtonGroup } from '../actions/ButtonGroup';
import { IconButton } from '../actions/IconButton';
import type { SchedulerController } from './schedulerController';
import type { SchedulerView } from './schedulerTypes';

const VIEWS: { value: SchedulerView; labelKey: I18nKey }[] = [
  { value: 'day', labelKey: 'velvet.data.scheduler.viewDay' },
  { value: 'week', labelKey: 'velvet.data.scheduler.viewWeek' },
];

export interface SchedulerToolbarProps {
  scheduler: SchedulerController;
}

export const SchedulerToolbar = (props: SchedulerToolbarProps) => {
  const translate = useTranslate();
  const calendar = () => props.scheduler.calendar;
  return (
    <div class="vui-sched__bar">
      <Button variant="secondary" size="sm" onClick={() => calendar().setDate(startOfDay(new Date()))}>
        {translate('velvet.common.today')}
      </Button>
      <ButtonGroup label={translate('velvet.data.scheduler.navigateLabel')}>
        <IconButton
          icon="chevron-left"
          label={translate(
            calendar().view() === 'day' ? 'velvet.data.scheduler.previousDay' : 'velvet.data.scheduler.previousWeek',
          )}
          variant="secondary"
          size="sm"
          onClick={() => calendar().setDate(addDays(calendar().date(), -calendar().step()))}
        />
        <IconButton
          icon="chevron-right"
          label={translate(
            calendar().view() === 'day' ? 'velvet.data.scheduler.nextDay' : 'velvet.data.scheduler.nextWeek',
          )}
          variant="secondary"
          size="sm"
          onClick={() => calendar().setDate(addDays(calendar().date(), calendar().step()))}
        />
      </ButtonGroup>
      <h3 class="vui-sched__range" aria-live="polite">
        {calendar().range()}
      </h3>
      <ButtonGroup label={translate('velvet.data.scheduler.viewLabel')}>
        <For each={VIEWS}>
          {(option) => (
            <Button
              variant="secondary"
              size="sm"
              aria-pressed={calendar().view() === option.value}
              onClick={() => calendar().setView(option.value)}
            >
              {translate(option.labelKey)}
            </Button>
          )}
        </For>
      </ButtonGroup>
    </div>
  );
};
