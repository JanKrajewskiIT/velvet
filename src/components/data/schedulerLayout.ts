export interface TimedEvent {
  start: Date;
  end: Date;
}

export interface LaidOutEvent<E extends TimedEvent> {
  event: E;
  /** Zero-based column inside its overlap cluster. */
  lane: number;
  /** Number of columns in the overlap cluster. */
  lanes: number;
}

/** Splits overlapping events into side-by-side lanes; events that do not overlap share the full width. */
export const layoutEvents = <E extends TimedEvent>(events: E[]): LaidOutEvent<E>[] => {
  const sorted = [...events].sort((a, b) => +a.start - +b.start || +b.end - +a.end);
  const out: LaidOutEvent<E>[] = [];
  let cluster: E[] = [];
  let clusterEnd = -Infinity;

  const flush = () => {
    const laneEnds: number[] = [];
    const placed = cluster.map((event) => {
      let lane = laneEnds.findIndex((end) => end <= +event.start);
      if (lane < 0) lane = laneEnds.length;
      laneEnds[lane] = +event.end;
      return { event, lane };
    });
    placed.forEach((p) => out.push({ ...p, lanes: laneEnds.length }));
    cluster = [];
  };

  sorted.forEach((event) => {
    if (+event.start >= clusterEnd && cluster.length) flush();
    cluster.push(event);
    clusterEnd = Math.max(clusterEnd, +event.end);
  });
  if (cluster.length) flush();
  return out;
};
