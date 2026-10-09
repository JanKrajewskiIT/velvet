import { createUniqueId, For } from 'solid-js';

import { createGanttDependencies } from './createGanttDependencies';
import type { GanttTimeline } from './createGanttTimeline';

export interface GanttDependenciesProps {
  timeline: GanttTimeline;
  enabled: boolean;
}

export const GanttDependencies = (props: GanttDependenciesProps) => {
  const arrowId = createUniqueId();
  const dependencies = createGanttDependencies(
    () => props.timeline,
    () => props.enabled,
  );
  return (
    <svg
      class="vui-gantt__deps"
      width={props.timeline.canvasWidth()}
      height={props.timeline.canvasHeight()}
      aria-hidden="true"
    >
      <defs>
        <marker id={arrowId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0L8,4L0,8z" class="vui-gantt__arrow" />
        </marker>
      </defs>
      <For each={dependencies()}>
        {(dep) => <path d={dep.d} class="vui-gantt__dep" marker-end={`url(#${arrowId})`} />}
      </For>
    </svg>
  );
};
