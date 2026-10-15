import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import type { GanttFormat } from './createGanttFormat';
import type { GanttTimeline } from './createGanttTimeline';
import styles from './GanttCanvas.module.css';
import { GanttDependencies } from './GanttDependencies';
import { type GanttTask, isWeekend } from './ganttLayout';
import { GanttTaskButton } from './GanttTaskButton';

export interface GanttCanvasProps {
  timeline: GanttTimeline;
  format: GanttFormat;
  showDependencies: boolean;
  onTaskClick?: (task: GanttTask) => void;
}

export const GanttCanvas = (props: GanttCanvasProps) => {
  const translate = useTranslate();
  return (
    <div
      class={styles.ganttPartCanvas}
      style={{ width: `${props.timeline.canvasWidth()}px`, height: `${props.timeline.canvasHeight()}px` }}
    >
      <For each={props.timeline.rows()}>
        {(row, k) => (
          <Show when={row.kind === 'group'}>
            <span
              class={styles.ganttPartGrp}
              style={{
                top: `${k() * props.timeline.rowHeight()}px`,
                height: `${props.timeline.rowHeight()}px`,
              }}
            />
          </Show>
        )}
      </For>
      <Show when={props.timeline.scale() === 'day'}>
        <For each={props.timeline.days()}>
          {(d, k) => (
            <Show when={isWeekend(d)}>
              <span
                class={styles.ganttPartWe}
                style={{ left: `${k() * props.timeline.px()}px`, width: `${props.timeline.px()}px` }}
              />
            </Show>
          )}
        </For>
      </Show>
      <For each={props.timeline.months().slice(1)}>
        {(m) => <span class={styles.ganttPartMline} style={{ left: `${m.index * props.timeline.px()}px` }} />}
      </For>
      <Show when={props.timeline.todayX()}>
        {(at) => (
          <span class={styles.ganttPartToday} style={{ left: `${at()}px` }} title={translate('velvet.common.today')} />
        )}
      </Show>
      <GanttDependencies timeline={props.timeline} enabled={props.showDependencies} />
      <For each={props.timeline.placed()}>
        {(p) => (
          <GanttTaskButton placed={p} timeline={props.timeline} format={props.format} onClick={props.onTaskClick} />
        )}
      </For>
    </div>
  );
};
