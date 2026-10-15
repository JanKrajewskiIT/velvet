import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import type { GanttFormat } from './createGanttFormat';
import type { GanttTimeline } from './createGanttTimeline';
import styles from './GanttHeader.module.css';

export interface GanttHeaderProps {
  timeline: GanttTimeline;
  format: GanttFormat;
}

export const GanttHeader = (props: GanttHeaderProps) => {
  const translate = useTranslate();
  return (
    <div class={styles.ganttPartHead} data-scale={props.timeline.scale()}>
      <Text as="div" variant="section" tone="inherit" class={styles.ganttPartCorner}>
        {translate('velvet.charts.gantt.taskHeader')}
      </Text>
      <div class={styles.ganttPartScale} style={{ width: `${props.timeline.canvasWidth()}px` }}>
        <div class={styles.ganttPartMonths}>
          <For each={props.timeline.monthSpans()}>
            {(m, i) => (
              <Text
                as="span"
                variant="label"
                tone="inherit"
                class={styles.ganttPartMonth}
                style={{ left: `${m.index * props.timeline.px()}px`, width: `${m.width}px` }}
              >
                {props.format.monthLabel(m.date, i())}
              </Text>
            )}
          </For>
        </div>
        <Show when={props.timeline.scale() !== 'month'}>
          <div class={styles.ganttPartUnits}>
            <For each={props.timeline.units()}>
              {(u) => (
                <Text
                  as="span"
                  variant="overline"
                  tone="inherit"
                  class={cx(
                    styles.ganttPartUnit,
                    props.timeline.scale() === 'day' && u.weekend && styles.ganttPartUnitVariantWe,
                    props.timeline.scale() === 'day' && u.today && styles.ganttPartUnitVariantToday,
                  )}
                  style={{ left: `${u.k * props.timeline.px()}px`, width: `${u.width}px` }}
                >
                  {props.timeline.scale() === 'week' ? props.format.dateLabel(u.date) : u.date.getDate()}
                </Text>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
};
