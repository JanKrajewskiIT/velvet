import { createEffect, createSignal, type JSX, mergeProps, onCleanup, splitProps, untrack } from 'solid-js';

import { assignRef } from '../../utils/assignRef';
import { callHandler } from '../../utils/callHandler';
import { columnWidthBounds, constrainColumnWidth } from '../../utils/columnWidth';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './ColumnResize.module.css';

export interface ColumnResizeProps extends HtmlProps<HTMLSpanElement, 'onResize'> {
  /** Accessible name, e.g. "Resize Name". */
  label: string;
  /** Current width in px (falls back to the measured cell). */
  width?: number;
  /** @default 64 */
  min?: number;
  max?: number;
  /** Keyboard step in px. @default 16 */
  step?: number;
  onResize?: (width: number) => void;
  /** Double-click — usually clears the custom width. */
  onReset?: () => void;
}

/** Column-width handle for a header cell's right edge: drag, ←/→, double-click to reset. Place inside a `position: relative` header cell. */
export const ColumnResize = (props: ColumnResizeProps) => {
  const merged = mergeProps({ step: 16 } satisfies Partial<ColumnResizeProps>, props);
  const [local, rest] = splitProps(merged, [
    'label',
    'width',
    'min',
    'max',
    'step',
    'onResize',
    'onReset',
    'class',
    'ref',
    'onPointerDown',
    'onKeyDown',
    'onDblClick',
    'onClick',
  ]);
  const [active, setActive] = createSignal(false);
  const [handle, setHandle] = createSignal<HTMLSpanElement>();
  const [measured, setMeasured] = createSignal<number>();
  let stopDrag: (() => void) | undefined;
  onCleanup(() => stopDrag?.());

  const bounds = () => columnWidthBounds(local.min, local.max);
  const cellWidth = () =>
    constrainColumnWidth(
      local.width ?? handle()?.parentElement?.getBoundingClientRect().width ?? bounds().min,
      bounds(),
    );
  const value = () => constrainColumnWidth(local.width ?? measured() ?? bounds().min, bounds());
  createEffect(() => {
    const initialCell = handle()?.parentElement;
    if (!initialCell) return;
    const measure = () => setMeasured(initialCell.getBoundingClientRect().width);
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(initialCell);
    onCleanup(() => observer?.disconnect());
  });
  const resize = (width: number) => {
    if (Number.isFinite(width)) local.onResize?.(constrainColumnWidth(width, bounds()));
  };

  const onPointerDown: JSX.EventHandler<HTMLSpanElement, PointerEvent> = (e) => {
    callHandler(local.onPointerDown, e);
    if (e.defaultPrevented || e.button !== 0 || !e.isPrimary) return;
    stopDrag?.();
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const pointerId = e.pointerId;
    const startWidth = untrack(cellWidth);
    const move = (ev: PointerEvent) => {
      if (ev.pointerId === pointerId) resize(startWidth + ev.clientX - startX);
    };
    const stop = (event?: PointerEvent) => {
      if (event && event.pointerId !== pointerId) return;
      setActive(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
      stopDrag = undefined;
    };
    setActive(true);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    stopDrag = stop;
  };

  const onKeyDown: JSX.EventHandler<HTMLSpanElement, KeyboardEvent> = (e) => {
    callHandler(local.onKeyDown, e);
    if (e.defaultPrevented || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    e.preventDefault();
    e.stopPropagation();
    resize(cellWidth() + (e.key === 'ArrowRight' ? local.step : -local.step));
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- focusable window-splitter separator handled with pointer and arrow keys
    <span
      {...rest}
      ref={(element) => {
        setHandle(element);
        assignRef(local.ref, element);
      }}
      role="separator"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a splitter separator with aria-valuenow is a focusable widget
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={local.label}
      aria-valuenow={Math.round(value())}
      aria-valuemin={bounds().min}
      aria-valuemax={Number.isFinite(bounds().max) ? bounds().max : undefined}
      class={cx(styles.colResize, active() && styles.colResizeVariantActive, local.class)}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      onDblClick={(event) => {
        callHandler(local.onDblClick, event);
        if (!event.defaultPrevented) local.onReset?.();
      }}
      onClick={(event) => {
        event.stopPropagation();
        callHandler(local.onClick, event);
      }}
    />
  );
};
