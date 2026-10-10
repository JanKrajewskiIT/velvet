import { createUniqueId, For, Index, type JSX, mergeProps, onCleanup, Show, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { FieldLabel } from '../primitives/FieldLabel';
import { adjacentMark, nearestMark, resolveMarks, type SliderMarks, snapToStep } from './sliderMarks';

const PERCENT = 100;
const PAGE_FRACTION = 10;
const MARK_EPSILON = 0.01;
const NO_THUMB = -1;

export type SliderValue = number | [number, number];

export interface SliderProps {
  label?: JSX.Element;
  /** A number is one thumb, `[low, high]` is two — thumbs can never cross. */
  value?: SliderValue;
  defaultValue?: SliderValue;
  onValueChange?: (value: SliderValue) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** Display and `aria-valuetext` — e.g. `(v) => v + '%'`. @default String */
  format?: (value: number) => string;
  /** Live value right of the label. @default true */
  showValue?: boolean;
  /** Min / max captions under the track. */
  showBounds?: boolean;
  /** Thresholds on the track. `true` = a labelled mark on every step; numbers = dots; `{ value, label }` = labelled thresholds. */
  marks?: SliderMarks;
  /** The value can only land on a mark; arrows jump mark to mark. @default false */
  snapToMarks?: boolean;
  /** Accessible names of the two thumbs of a range. @default localized "Minimum", "Maximum" */
  thumbLabels?: readonly [string, string];
  disabled?: boolean;
  id?: string;
  class?: string;
}

const asList = (value: SliderValue): number[] => (typeof value === 'number' ? [value] : value);

/** Range control with filled track. Drag, click the track, or use ←→ ↑↓ PageUp/PageDown Home/End. */
export const Slider = (props: SliderProps) => {
  const p = mergeProps(
    { min: 0, max: 100, step: 1, format: String, showValue: true, snapToMarks: false } satisfies SliderProps,
    props,
  );
  const translate = useTranslate();
  const thumbLabel = (index: number) =>
    p.thumbLabels?.[index] ??
    translate(index === 0 ? 'velvet.forms.slider.thumbMinimum' : 'velvet.forms.slider.thumbMaximum');
  const autoId = createUniqueId();
  const id = () => p.id ?? autoId;
  const [current, setCurrent] = createControllable<SliderValue>({
    value: () => p.value,
    defaultValue: untrack(() => p.defaultValue ?? (Array.isArray(p.value) ? p.value : p.min)),
    onChange: (next) => p.onValueChange?.(next),
  });

  const isRange = () => typeof current() !== 'number';
  const values = () => asList(current());
  const low = () => values()[0] ?? p.min;
  const high = () => values().at(-1) ?? low();
  const percent = (value: number) => ((value - p.min) / (p.max - p.min)) * PERCENT;
  const fillStart = () => (isRange() ? percent(low()) : 0);
  const fillEnd = () => percent(high());
  const markList = () => resolveMarks(p.marks, p.min, p.max, p.step);
  const snapsToMarks = () => p.snapToMarks && markList().length > 0;
  const labelled = () => p.marks === true || markList().some((mark) => mark.label != null);

  const snap = (value: number) => (snapsToMarks() ? (nearestMark(markList(), value) ?? value) : snapToStep(value, p));
  const moveThumb = (index: number, raw: number) => {
    const snapped = snap(raw);
    const next: SliderValue = !isRange()
      ? snapped
      : index === 0
        ? [Math.min(snapped, high()), high()]
        : [low(), Math.max(snapped, low())];
    if (asList(next)[index] !== values()[index]) setCurrent(next);
  };

  let track!: HTMLDivElement;
  let dragging = NO_THUMB;
  let pendingX: number | undefined;
  let frame = 0;
  const valueAt = (x: number) => {
    const box = track.getBoundingClientRect();
    return p.min + ((x - box.left) / box.width) * (p.max - p.min);
  };
  const nearestThumb = (value: number) => {
    if (!isRange()) return 0;
    const toLow = Math.abs(value - low());
    const toHigh = Math.abs(value - high());
    if (toLow === toHigh) return value < low() ? 0 : 1;
    return toLow < toHigh ? 0 : 1;
  };
  /** Applies the newest pointer position; pointer moves arrive faster than frames, so only the last one per frame is used. */
  const flushPointer = () => {
    frame = 0;
    if (pendingX !== undefined && dragging !== NO_THUMB) moveThumb(dragging, valueAt(pendingX));
    pendingX = undefined;
  };
  onCleanup(() => cancelAnimationFrame(frame));

  const onPointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
    if (p.disabled || e.button !== 0) return;
    const value = valueAt(e.clientX);
    dragging = nearestThumb(value);
    moveThumb(dragging, value);
    track.setPointerCapture(e.pointerId);
    track.querySelectorAll<HTMLElement>('[role="slider"]')[dragging]?.focus();
  };
  const onPointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
    if (dragging === NO_THUMB) return;
    pendingX = e.clientX;
    frame ||= requestAnimationFrame(flushPointer);
  };
  const endDrag = () => {
    cancelAnimationFrame(frame);
    flushPointer();
    dragging = NO_THUMB;
  };

  const onKeyDown = (index: number, e: KeyboardEvent) => {
    const value = values()[index] ?? p.min;
    const page = Math.max(p.step, (p.max - p.min) / PAGE_FRACTION);
    const deltas: Record<string, number | undefined> = {
      ArrowRight: p.step,
      ArrowUp: p.step,
      ArrowLeft: -p.step,
      ArrowDown: -p.step,
      PageUp: page,
      PageDown: -page,
    };
    const delta = deltas[e.key];
    if (delta !== undefined) {
      e.preventDefault();
      moveThumb(index, snapsToMarks() ? adjacentMark(markList(), value, delta > 0 ? 1 : -1) : value + delta);
    } else if (e.key === 'Home') {
      e.preventDefault();
      moveThumb(index, p.min);
    } else if (e.key === 'End') {
      e.preventDefault();
      moveThumb(index, p.max);
    }
  };

  const valueText = () => (isRange() ? `${p.format(low())} – ${p.format(high())}` : p.format(low()));

  return (
    <div
      class={cx(
        'vui-field',
        'vui-slider',
        p.disabled && 'vui-slider--disabled',
        labelled() && 'vui-slider--labelled',
        p.class,
      )}
    >
      <Show when={p.label || p.showValue}>
        <div class="vui-slider__head">
          <Show when={p.label}>
            <FieldLabel id={`${id()}-label`}>{p.label}</FieldLabel>
          </Show>
          <Show when={p.showValue}>
            <span class="vui-slider__value">{valueText()}</span>
          </Show>
        </div>
      </Show>
      <div
        ref={(element) => {
          track = element;
        }}
        class="vui-slider__track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <span class="vui-slider__fill" style={{ left: `${fillStart()}%`, width: `${fillEnd() - fillStart()}%` }} />
        <For each={markList()}>
          {(mark) => {
            const at = () => percent(mark.value);
            const inside = () => at() >= fillStart() - MARK_EPSILON && at() <= fillEnd() + MARK_EPSILON;
            return (
              <span
                class={cx(
                  'vui-slider__mark',
                  inside() && 'vui-slider__mark--in',
                  values().includes(mark.value) && 'vui-slider__mark--on',
                )}
                style={{ left: `${at()}%` }}
                aria-hidden="true"
              >
                <Show when={mark.label != null || p.marks === true}>
                  <span class="vui-slider__mark-label">{mark.label ?? p.format(mark.value)}</span>
                </Show>
              </span>
            );
          }}
        </For>
        <Index each={values()}>
          {(value, index) => (
            <span
              role="slider"
              tabIndex={p.disabled ? -1 : 0}
              class="vui-slider__thumb"
              style={{ left: `${percent(value())}%` }}
              aria-labelledby={p.label ? `${id()}-label` : undefined}
              aria-label={isRange() ? thumbLabel(index) : undefined}
              aria-valuemin={isRange() && index === 1 ? low() : p.min}
              aria-valuemax={isRange() && index === 0 ? high() : p.max}
              aria-valuenow={value()}
              aria-valuetext={p.format(value())}
              aria-disabled={p.disabled || undefined}
              onKeyDown={(e) => onKeyDown(index, e)}
            />
          )}
        </Index>
      </div>
      <Show when={p.showBounds}>
        <div class="vui-slider__bounds">
          <span>{p.format(p.min)}</span>
          <span>{p.format(p.max)}</span>
        </div>
      </Show>
    </div>
  );
};
