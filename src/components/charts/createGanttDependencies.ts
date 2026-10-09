import { type Accessor, createMemo } from 'solid-js';

import type { GanttTimeline } from './createGanttTimeline';
import { asArray, dependencyPath } from './ganttLayout';

const MILESTONE_HALF_PX = 7;

export const createGanttDependencies = (timeline: Accessor<GanttTimeline>, enabled: () => boolean) =>
  createMemo(() => {
    if (!enabled()) return [];
    const { px, x, placed, rowCentre, rowHeight } = timeline();
    return placed().flatMap((t) =>
      asArray(t.task.dependsOn).flatMap((id) => {
        const predecessor = placed().find((q) => q.key === id);
        if (!predecessor) return [];
        const x1 = x(predecessor.end) + (predecessor.task.milestone ? px() / 2 + MILESTONE_HALF_PX : px());
        const x2 = x(t.start) + (t.task.milestone ? px() / 2 - MILESTONE_HALF_PX - 1 : 0);
        return [
          {
            id: `${predecessor.key}-${t.key}`,
            d: dependencyPath(x1, rowCentre(predecessor.key), x2, rowCentre(t.key), rowHeight()),
          },
        ];
      }),
    );
  });
