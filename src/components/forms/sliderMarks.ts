import type { JSX } from 'solid-js';

export interface SliderMark {
  value: number;
  label?: JSX.Element;
}

/** `true` = a labelled mark on every step; numbers = unlabelled dots; objects = labelled thresholds. */
export type SliderMarks = boolean | ReadonlyArray<number | SliderMark>;

const FLOAT_PRECISION = 10;

export const resolveMarks = (marks: SliderMarks | undefined, min: number, max: number, step: number): SliderMark[] => {
  if (marks === true)
    return Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, index) => ({ value: min + index * step }));
  if (!marks) return [];
  return marks.map((mark) => (typeof mark === 'number' ? { value: mark } : mark));
};

export interface SnapRange {
  min: number;
  max: number;
  step: number;
}

/** The step-aligned value nearest to `value`, clamped to the range. */
export const snapToStep = (value: number, { min, max, step }: SnapRange): number => {
  const snapped = Math.round((value - min) / step) * step + min;
  return Math.min(max, Math.max(min, Number(snapped.toFixed(FLOAT_PRECISION))));
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
