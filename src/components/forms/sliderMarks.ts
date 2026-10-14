import type { JSX } from 'solid-js';

import { decimalPlaces } from '../../utils/decimalValue';
import { clamp } from '../../utils/math';

export interface SliderMark {
  value: number;
  label?: JSX.Element;
}

/** `true` = a labelled mark on every step; numbers = unlabelled dots; objects = labelled thresholds. */
export type SliderMarks = boolean | ReadonlyArray<number | SliderMark>;

const MAX_MARKS = 1000;

export const resolveMarks = (marks: SliderMarks | undefined, min: number, max: number, step: number): SliderMark[] => {
  if (marks === true) {
    const count = Math.floor((max - min) / step) + 1;
    if (!Number.isSafeInteger(count) || count > MAX_MARKS)
      throw new RangeError(
        `Slider supports at most ${MAX_MARKS} generated marks; supply explicit marks for a finer step.`,
      );
    return Array.from({ length: count }, (_, index) => ({ value: min + index * step }));
  }
  if (!marks) return [];
  const unique = new Map<number, SliderMark>();
  marks.forEach((mark) => {
    const item = typeof mark === 'number' ? { value: mark } : mark;
    if (Number.isFinite(item.value) && item.value >= min && item.value <= max) unique.set(item.value, item);
  });
  return [...unique.values()].sort((a, b) => a.value - b.value);
};

export interface SnapRange {
  min: number;
  max: number;
  step: number;
}

/** The step-aligned value nearest to `value`, clamped to the range. */
export const snapToStep = (value: number, { min, max, step }: SnapRange): number => {
  const snapped = Math.round((value - min) / step) * step + min;
  const places = Math.max(decimalPlaces(min), decimalPlaces(step));
  return clamp(
    Number.isFinite(snapped) ? (places <= 100 ? Number(snapped.toFixed(places)) : snapped) : value,
    min,
    max,
  );
};

/** The mark value nearest to `value`; `undefined` without marks. */
export const nearestMark = (marks: readonly SliderMark[], value: number): number | undefined =>
  marks.reduce<number | undefined>(
    (best, mark) => (best === undefined || Math.abs(mark.value - value) < Math.abs(best - value) ? mark.value : best),
    undefined,
  );

/** The next mark value beyond `from` in `direction`; stays on the end mark when there is none. */
export const adjacentMark = (marks: readonly SliderMark[], from: number, direction: 1 | -1): number => {
  const sorted = marks.map((mark) => mark.value).sort((a, b) => a - b);
  const ahead =
    direction > 0 ? sorted.find((value) => value > from) : [...sorted].reverse().find((value) => value < from);
  return ahead ?? (direction > 0 ? sorted.at(-1) : sorted[0]) ?? from;
};
