import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Polymorphic } from '../../utils/polymorphic';
import type { SchedulerController } from './schedulerController';
import { eventStyle } from './schedulerLayout';
import type { SchedulerEvent } from './schedulerTypes';

export interface SchedulerEventBlockProps {
  scheduler: SchedulerController;
  event: SchedulerEvent;
  originalEvent?: SchedulerEvent;
  lane: number;
  lanes: number;
}

export const SchedulerEventBlock = (props: SchedulerEventBlockProps) => {
  const translate = useTranslate();
  const config = () => props.scheduler.config;
  const geometry = () =>
    eventStyle(props.event, props.lane, props.lanes, {
      startHour: config().startHour,
      endHour: config().endHour,
      pxPerMinute: props.scheduler.pxPerMinute(),
    });
  const formatTime = (d: Date) => props.scheduler.formatTime(d);
  return (
    <Polymorphic
      tag={config().onEventClick ? 'button' : 'div'}
      type={config().onEventClick ? 'button' : undefined}
      data-tone={props.event.tone ?? 'brand'}
      class={cx('vui-sched__evt', geometry().short && 'vui-sched__evt--short')}
      style={geometry().style}
      onClick={config().onEventClick ? () => config().onEventClick?.(props.originalEvent ?? props.event) : undefined}
      aria-label={translate('velvet.data.scheduler.eventLabel', {
        title: props.event.title,
        start: formatTime(props.event.start),
        end: formatTime(props.event.end),
      })}
    >
      <span class="vui-sched__et">{props.event.title}</span>
      <span class="vui-sched__em">
        {`${formatTime(props.event.start)} – ${formatTime(props.event.end)}`}
        {props.event.meta && !geometry().short ? ` · ${props.event.meta}` : ''}
      </span>
    </Polymorphic>
  );
};
