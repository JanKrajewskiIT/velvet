import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Polymorphic } from '../../utils/polymorphic';
import { Text } from '../primitives/Text';
import type { SchedulerController } from './schedulerController';
import styles from './SchedulerEventBlock.module.css';
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
      data-vui-scheduler-event
      data-tone={props.event.tone ?? 'brand'}
      class={cx(styles.schedPartEvt, geometry().short && styles.schedPartEvtVariantShort)}
      style={geometry().style}
      onClick={config().onEventClick ? () => config().onEventClick?.(props.originalEvent ?? props.event) : undefined}
      aria-label={translate('velvet.data.scheduler.eventLabel', {
        title: props.event.title,
        start: formatTime(props.event.start),
        end: formatTime(props.event.end),
      })}
    >
      <Text as="span" variant="label-sm" tone="inherit" class={styles.schedPartEt}>
        {props.event.title}
      </Text>
      <Text as="span" variant="overline" tone="inherit" class={styles.schedPartEm}>
        {`${formatTime(props.event.start)} – ${formatTime(props.event.end)}`}
        {props.event.meta && !geometry().short ? ` · ${props.event.meta}` : ''}
      </Text>
    </Polymorphic>
  );
};
