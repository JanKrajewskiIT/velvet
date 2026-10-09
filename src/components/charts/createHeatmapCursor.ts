import { createSignal } from 'solid-js';

import { clamp } from '../../utils/math';
import { DAYS_PER_WEEK } from './createHeatmapGrid';

const KEY_STEPS: Record<string, number> = {
  ArrowUp: -1,
  ArrowDown: 1,
  ArrowLeft: -DAYS_PER_WEEK,
  ArrowRight: DAYS_PER_WEEK,
};

export const createHeatmapCursor = (lastIndex: () => number) => {
  const [hover, setHover] = createSignal(-1);
  const [focusIndex, setFocusIndex] = createSignal(-1);
  const cellRefs: HTMLButtonElement[] = [];

  const tabStop = () => (focusIndex() < 0 || focusIndex() > lastIndex() ? lastIndex() : focusIndex());
  const reveal = (index: number) => {
    setFocusIndex(index);
    setHover(index);
  };
  const go = (target: number) => {
    const i = clamp(target, 0, lastIndex());
    reveal(i);
    cellRefs[i]?.focus();
  };
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const step = KEY_STEPS[e.key];
    if (step !== undefined) {
      e.preventDefault();
      go(index + step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      go(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      go(lastIndex());
    } else if (e.key === 'Escape') setHover(-1);
  };

  return { hover, setHover, cellRefs, tabStop, reveal, onKeyDown } as const;
};
