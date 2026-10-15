import {
  createEffect,
  createMemo,
  createUniqueId,
  For,
  Index,
  type JSX,
  mergeProps,
  onCleanup,
  Show,
  untrack,
} from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { numberRange } from '../../utils/decimalValue';
import { clamp } from '../../utils/math';
import { FieldLabel } from '../primitives/FieldLabel';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { createFormValidation } from './createFormValidation';
import type { FormControlProps } from './formControl';
import { FormValue } from './FormValue';
import styles from './Slider.module.css';
import { adjacentMark, nearestMark, resolveMarks, type SliderMarks, snapToStep } from './sliderMarks';

const PERCENT = 100;
const PAGE_FRACTION = 10;
const MARK_EPSILON = 0.01;
const NO_THUMB = -1;

export type SliderValue = number | [number, number];

export interface SliderProps extends FormControlProps {
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
  const bounds = createMemo(() => {
    const result = numberRange(p.min, p.max, p.step);
    if (!Number.isFinite(result.min) || !Number.isFinite(result.max))
      throw new RangeError('Slider bounds must be finite.');
    return result;
  });
  const values = () =>
    asList(current())
      .map((value) => clamp(Number.isFinite(value) ? value : bounds().min, bounds().min, bounds().max))
      .sort((a, b) => a - b);
  const validation = createFormValidation();
  const invalidValue = () =>
    asList(current()).some((value) => !Number.isFinite(value) || value < bounds().min || value > bounds().max) ||
    (isRange() && (asList(current())[0] ?? 0) > (asList(current())[1] ?? 0));
  const low = () => values()[0] ?? p.min;
  const high = () => values().at(-1) ?? low();
  const percent = (value: number) =>
    bounds().max === bounds().min ? 0 : ((value - bounds().min) / (bounds().max - bounds().min)) * PERCENT;
  const fillStart = () => (isRange() ? percent(low()) : 0);
  const fillEnd = () => percent(high());
  const markList = createMemo(() => resolveMarks(p.marks, bounds().min, bounds().max, bounds().step));
  const snapsToMarks = () => p.snapToMarks && markList().length > 0;
  const labelled = () => p.marks === true || markList().some((mark) => mark.label != null);

  const snap = (value: number) => (snapsToMarks() ? (nearestMark(markList(), value) ?? value) : snapToStep(value, p));
  const moveThumb = (index: number, raw: number) => {
    if (p.disabled || !Number.isFinite(raw)) return;
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
  let pointerId: number | undefined;
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
    pointerId = e.pointerId;
    moveThumb(dragging, value);
    track.setPointerCapture(e.pointerId);
    track.querySelectorAll<HTMLElement>('[role="slider"]')[dragging]?.focus();
  };
  const onPointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
    if (p.disabled || dragging === NO_THUMB) return;
    pendingX = e.clientX;
    frame ||= requestAnimationFrame(flushPointer);
  };
  const endDrag = () => {
    cancelAnimationFrame(frame);
    flushPointer();
    dragging = NO_THUMB;
    const captured = pointerId;
    pointerId = undefined;
    if (captured !== undefined && track.hasPointerCapture(captured)) track.releasePointerCapture(captured);
  };

  const onKeyDown = (index: number, e: KeyboardEvent) => {
    if (p.disabled || e.defaultPrevented) return;
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
  createEffect(() => {
    if (p.disabled) endDrag();
  });

  return (
    <div
      class={cx(
        styles.field,
        styles.slider,
        p.disabled && styles.sliderVariantDisabled,
        labelled() && styles.sliderVariantLabelled,
        p.class,
      )}
    >
      <Show when={p.label || p.showValue}>
        <div class={styles.sliderPartHead}>
          <Show when={p.label}>
            <FieldLabel id={`${id()}-label`}>{p.label}</FieldLabel>
          </Show>
          <Show when={p.showValue}>
            <Text as="span" variant="code" tone="inherit" class={styles.sliderPartValue}>
              {valueText()}
            </Text>
          </Show>
        </div>
      </Show>
      <div
        ref={(element) => {
          track = element;
        }}
        class={styles.sliderPartTrack}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        <span class={styles.sliderPartFill} style={{ left: `${fillStart()}%`, width: `${fillEnd() - fillStart()}%` }} />
        <For each={markList()}>
          {(mark) => {
            const at = () => percent(mark.value);
            const inside = () => at() >= fillStart() - MARK_EPSILON && at() <= fillEnd() + MARK_EPSILON;
            return (
              <span
                class={cx(
                  styles.sliderPartMark,
                  inside() && styles.sliderPartMarkVariantIn,
                  values().includes(mark.value) && styles.sliderPartMarkVariantOn,
                )}
                style={{ left: `${at()}%` }}
                aria-hidden="true"
              >
                <Show when={mark.label != null || p.marks === true}>
                  <Text as="span" variant="kbd" tone="inherit" class={styles.sliderPartMarkLabel}>
                    {mark.label ?? p.format(mark.value)}
                  </Text>
                </Show>
              </span>
            );
          }}
        </For>
        <Index each={values()}>
          {(value, index) => (
            <>
              <Show when={isRange()}>
                <Text
                  as="span"
                  variant="caption"
                  tone="inherit"
                  id={`${id()}-thumb-${index}-label`}
                  class={styles.srOnly}
                >
                  {thumbLabel(index)}
                </Text>
              </Show>
              <span
                role="slider"
                tabIndex={p.disabled ? -1 : 0}
                class={styles.sliderPartThumb}
                style={{ left: `${percent(value())}%` }}
                aria-labelledby={
                  isRange()
                    ? `${p['aria-labelledby'] ?? (p.label ? `${id()}-label` : '')} ${id()}-thumb-${index}-label`.trim()
                    : (p['aria-labelledby'] ?? (p.label ? `${id()}-label` : undefined))
                }
                aria-label={
                  isRange()
                    ? undefined
                    : (p['aria-label'] ?? (p.label ? undefined : translate('velvet.forms.slider.valueLabel')))
                }
                aria-describedby={validation.describedBy(undefined)}
                aria-invalid={validation.invalid() || undefined}
                aria-valuemin={isRange() && index === 1 ? low() : p.min}
                aria-valuemax={isRange() && index === 0 ? high() : p.max}
                aria-valuenow={value()}
                aria-valuetext={p.format(value())}
                aria-disabled={p.disabled || undefined}
                onKeyDown={(e) => onKeyDown(index, e)}
              />
            </>
          )}
        </Index>
      </div>
      <Show when={p.showBounds}>
        <div class={cx(styles.sliderPartBounds, typographyClass('kbd'))}>
          <Text as="span" variant="caption" tone="inherit">
            {p.format(p.min)}
          </Text>
          <Text as="span" variant="caption" tone="inherit">
            {p.format(p.max)}
          </Text>
        </div>
      </Show>
      <FormValue
        name={p.name}
        form={p.form}
        required={p.required}
        disabled={p.disabled}
        value={values().map(String)}
        validation={validation}
        invalidMessage={invalidValue() ? translate('velvet.forms.numberInput.invalidNumber') : undefined}
        focusInvalid={() => track.querySelector<HTMLElement>('[role="slider"]')?.focus()}
        onReset={() => {
          endDrag();
          setCurrent(p.defaultValue ?? (isRange() ? [p.min, p.max] : p.min));
        }}
      />
    </div>
  );
};
