import { createSignal, type JSX, mergeProps, onCleanup, splitProps, untrack } from 'solid-js';

import { columnWidthBounds, constrainColumnWidth } from '../../utils/columnWidth';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';

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
  const [local, rest] = splitProps(merged, ['label', 'width', 'min', 'max', 'step', 'onResize', 'onReset', 'class']);
  const [active, setActive] = createSignal(false);
  let stopDrag: (() => void) | undefined;
  onCleanup(() => stopDrag?.());

  const cellWidth = (handle: HTMLElement) => local.width || handle.parentElement?.getBoundingClientRect().width || 0;
  const bounds = () => columnWidthBounds(local.min, local.max);
  const resize = (width: number) => {
    if (Number.isFinite(width)) local.onResize?.(constrainColumnWidth(width, bounds()));
  };

  const onPointerDown: JSX.EventHandler<HTMLSpanElement, PointerEvent> = (e) => {
    if (e.button !== 0 || !e.isPrimary) return;
    stopDrag?.();
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const pointerId = e.pointerId;
    const startWidth = untrack(() => cellWidth(e.currentTarget));
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
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    e.stopPropagation();
    resize(cellWidth(e.currentTarget) + (e.key === 'ArrowRight' ? local.step : -local.step));
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- focusable window-splitter separator handled with pointer and arrow keys
    <span
      role="separator"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a splitter separator with aria-valuenow is a focusable widget
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={local.label}
      aria-valuenow={local.width ? Math.round(local.width) : undefined}
      aria-valuemin={bounds().min}
      aria-valuemax={Number.isFinite(bounds().max) ? bounds().max : undefined}
      class={cx('vui-col-resize', active() && 'vui-col-resize--active', local.class)}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      onDblClick={() => local.onReset?.()}
      onClick={(e) => e.stopPropagation()}
      {...rest}
    />
  );
};
