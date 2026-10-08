import { useI18n } from '@jankrajewskiit/i18n';
import { createSignal, For, type JSX, mergeProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { cellText, clamp, rowValue } from './rowData';

export interface VirtualColumn<T extends object = object> {
  key: string;
  label: JSX.Element;
  /** Fixed px. */
  width?: number;
  /** Share of remaining space. @default 1 */
  flex?: number;
  align?: 'left' | 'right';
  render?: (row: T, index: number) => JSX.Element;
}

export interface VirtualTableProps<T extends object = object> {
  columns: VirtualColumn<T>[];
  rows: T[];
  /** px. @default 40 */
  rowHeight?: number;
  /** Viewport px. @default 400 */
  height?: number;
  /** @default 8 */
  overscan?: number;
  onRowClick?: (row: T) => void;
  class?: string;
}

/** Windowed table for 10k–1M rows: only visible rows (+ overscan) are in the DOM. Fixed row height. ↑↓ PageUp/Down Home End keep the focused row in view. Footer reports the visible range. */
export const VirtualTable = <T extends object>(props: VirtualTableProps<T>): JSX.Element => {
  const p = mergeProps({ rowHeight: 40, height: 400, overscan: 8 } satisfies Partial<VirtualTableProps<T>>, props);
  const translate = useTranslate();
  const i18n = useI18n();
  const [scrollTop, setScrollTop] = createSignal(0);
  const [focus, setFocus] = createSignal(-1);
  let body!: HTMLDivElement;

  const count = () => p.rows.length;
  const firstVisible = () => Math.floor(scrollTop() / p.rowHeight);
  const start = () => Math.max(0, firstVisible() - p.overscan);
  const end = () => Math.min(count(), Math.ceil((scrollTop() + p.height) / p.rowHeight) + p.overscan);
  const indices = () => {
    const first = start();
    return Array.from({ length: Math.max(0, end() - first) }, (_, k) => first + k);
  };
  const template = () => p.columns.map((c) => (c.width ? `${c.width}px` : `minmax(0,${c.flex ?? 1}fr)`)).join(' ');

  const goTo = (index: number) => {
    const target = clamp(index, 0, count() - 1);
    setFocus(target);
    const bottom = target * p.rowHeight + p.rowHeight;
    if (bottom - p.rowHeight < body.scrollTop + p.rowHeight) body.scrollTop = bottom - p.rowHeight * 2;
    else if (bottom > body.scrollTop + p.height) body.scrollTop = bottom - p.height;
    requestAnimationFrame(() =>
      body.querySelector<HTMLElement>(`[data-vi="${target}"]`)?.focus({ preventScroll: true }),
    );
  };

  const onKey: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    const page = Math.floor(p.height / p.rowHeight) - 1;
    const steps: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, PageDown: page, PageUp: -page };
    const step = steps[e.key];
    const row = p.rows[focus()];
    if (step !== undefined) {
      e.preventDefault();
      goTo((focus() < 0 ? 0 : focus()) + step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(count() - 1);
    } else if (e.key === 'Enter' && row) {
      p.onRowClick?.(row);
    }
  };

  const cellClass = (c: VirtualColumn<T>) => cx('vui-vtable__cell', c.align === 'right' && 'vui-table__num');
  const visibleRange = () =>
    `${i18n.formatNumber(count() ? firstVisible() + 1 : 0)}–${i18n.formatNumber(Math.min(count(), Math.ceil((scrollTop() + p.height) / p.rowHeight)))}`;

  return (
    <div class={cx('vui-vtable', p.class)} role="table" aria-rowcount={count() + 1}>
      <div role="row" class="vui-vtable__row vui-vtable__row--head" style={{ 'grid-template-columns': template() }}>
        <For each={p.columns}>
          {(c) => (
            <div role="columnheader" class={cellClass(c)}>
              {c.label}
            </div>
          )}
        </For>
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- scroll body owns keyboard navigation for the virtualised rows (roving tabindex) */}
      <div
        ref={body}
        class="vui-vtable__body"
        style={{ height: `${p.height}px` }}
        tabIndex={focus() < 0 ? 0 : -1}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        onKeyDown={onKey}
        onFocus={(e) => {
          if (e.target === e.currentTarget && focus() < 0) goTo(firstVisible());
        }}
      >
        <div style={{ height: `${count() * p.rowHeight}px`, position: 'relative' }}>
          <For each={indices()}>
            {(i) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- row keyboard handling (Enter) lives on the scroll body's onKeyDown
              <div
                data-vi={i}
                role="row"
                aria-rowindex={i + 2}
                tabIndex={i === focus() ? 0 : -1}
                class={cx(
                  'vui-vtable__row',
                  i === focus() && 'vui-vtable__row--focus',
                  p.onRowClick && 'vui-vtable__row--click',
                )}
                style={{
                  'grid-template-columns': template(),
                  height: `${p.rowHeight}px`,
                  transform: `translateY(${i * p.rowHeight}px)`,
                }}
                onClick={() => {
                  const row = p.rows[i];
                  setFocus(i);
                  if (row) p.onRowClick?.(row);
                }}
              >
                <For each={p.columns}>
                  {(c) => (
                    <div role="cell" class={cellClass(c)}>
                      {c.render ? c.render(p.rows[i] as T, i) : cellText(rowValue(p.rows[i] as T, c.key))}
                    </div>
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>
      <div class="vui-vtable__foot">
        <span>{translate('velvet.data.virtualTable.rowsCount', { count: count() })}</span>
        <span>
          {translate('velvet.data.virtualTable.rendering', {
            count: Math.max(0, end() - start()),
            range: visibleRange(),
          })}
        </span>
      </div>
    </div>
  );
};
