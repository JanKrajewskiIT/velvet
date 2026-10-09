import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { GanttFormat } from './createGanttFormat';
import type { GanttTimeline } from './createGanttTimeline';

export interface GanttHeaderProps {
  timeline: GanttTimeline;
  format: GanttFormat;
}

export const GanttHeader = (props: GanttHeaderProps) => {
  const translate = useTranslate();
  return (
    <div class="vui-gantt__head">
      <div class="vui-gantt__corner">{translate('velvet.charts.gantt.taskHeader')}</div>
      <div class="vui-gantt__scale" style={{ width: `${props.timeline.canvasWidth()}px` }}>
        <div class="vui-gantt__months">
          <For each={props.timeline.monthSpans()}>
            {(m, i) => (
              <span
                class="vui-gantt__month"
                style={{ left: `${m.index * props.timeline.px()}px`, width: `${m.width}px` }}
              >
                {props.format.monthLabel(m.date, i())}
              </span>
            )}
          </For>
        </div>
        <Show when={props.timeline.scale() !== 'month'}>
          <div class="vui-gantt__units">
            <For each={props.timeline.units()}>
              {(u) => (
                <span
                  class={cx(
                    'vui-gantt__unit',
                    props.timeline.scale() === 'day' && u.weekend && 'vui-gantt__unit--we',
                    props.timeline.scale() === 'day' && u.today && 'vui-gantt__unit--today',
                  )}
                  style={{ left: `${u.k * props.timeline.px()}px`, width: `${u.width}px` }}
                >
                  {props.timeline.scale() === 'week' ? props.format.dateLabel(u.date) : u.date.getDate()}
                </span>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
};
