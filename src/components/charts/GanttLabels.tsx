import { For, Match, Show, Switch } from 'solid-js';

import type { GanttTimeline } from './createGanttTimeline';

export interface GanttLabelsProps {
  timeline: GanttTimeline;
}

export const GanttLabels = (props: GanttLabelsProps) => (
  <div class="vui-gantt__labels">
    <For each={props.timeline.rows()}>
      {(row) => (
        <Switch>
          <Match when={row.kind === 'group' && row}>
            {(g) => <div class="vui-gantt__label vui-gantt__label--group">{g().group}</div>}
          </Match>
          <Match when={row.kind === 'task' && row}>
            {(t) => (
              <div class="vui-gantt__label">
                <i style={{ background: t().placed.color }} />
                <span title={t().placed.task.name}>{t().placed.task.name}</span>
                <Show when={t().placed.task.progress !== undefined && !t().placed.task.milestone}>
                  <small>{t().placed.task.progress}%</small>
                </Show>
              </div>
            )}
          </Match>
        </Switch>
      )}
    </For>
  </div>
);
