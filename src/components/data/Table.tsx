import {
  children as resolveChildren,
  createEffect,
  createMemo,
  createSignal,
  For,
  Index,
  type JSX,
  mergeProps,
  onCleanup,
  Show,
} from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Skeleton } from '../feedback/Skeleton';
import { Checkbox } from '../forms/Checkbox';
import { ColumnResize } from '../primitives/ColumnResize';
import { Glyph } from '../primitives/Glyph';
import { cellText, cssLength, nextSort, rowId, type RowKey, type RowSort, rowValue, sortRows } from './rowData';

export type TableSort = RowSort;

export interface TableColumn<T extends object = object> {
  key: string;
  label: JSX.Element;
  /** Freeze the column to the left or right edge while the table scrolls horizontally. Any number may be pinned. */
  pin?: 'left' | 'right';
  /** Custom cell renderer. */
  render?: (row: T) => JSX.Element;
  /** Right-align + tabular numbers. */
  align?: 'left' | 'right';
  width?: number | string;
  /** Hide this column under 768px. */
  hideOnMobile?: boolean;
  /** Header becomes a sort button (asc → desc → off). */
  sortable?: boolean;
  /** Value used for sorting when the cell is rendered. */
  sortValue?: (row: T) => string | number;
}

export interface TableProps<T extends object = object> {
  columns: TableColumn<T>[];
  rows: T[];
  /** Unique key field. @default 'id' */
  rowKey?: string;
  selectable?: boolean;
  /** Selected row keys. */
  selected?: RowKey[];
  onSelectedChange?: (keys: RowKey[]) => void;
  /** Buttons shown in the bar that appears while rows are selected. */
  bulkActions?: JSX.Element;
  /** Controlled sort. If onSortChange is also set, rows are NOT sorted internally (server sort). */
  sort?: TableSort | null;
  defaultSort?: TableSort;
  onSortChange?: (sort: TableSort | null) => void;
  /** Show skeleton rows. */
  loading?: boolean;
  /** @default 4 */
  loadingRows?: number;
  /** Empty-state content — a string or an `<EmptyState size="sm">`. @default localized "Nothing here yet." */
  empty?: JSX.Element;
  /** Toolbar title (shows the row count next to it). */
  title?: JSX.Element;
  /** Override the count shown next to the title. */
  count?: JSX.Element;
  /** Toolbar actions, right-aligned. */
  toolbar?: JSX.Element;
  /** Drag column edges to resize (double-click resets a column; ←/→ on the handle). Adds “Reset widths” to the toolbar once changed. */
  resizable?: boolean;
  /** Adds a chevron column; renders this below the row when expanded. */
  renderExpanded?: (row: T) => JSX.Element;
  /** Scroll height for the body, e.g. 360. Enables sticky header. */
  maxHeight?: number | string;
  /** @default true when maxHeight is set */
  stickyHeader?: boolean;
  class?: string;
}

interface PinOffset {
  side: 'left' | 'right';
  offset: number;
  edge: boolean;
}

const SKELETON_WIDTHS = [72, 56, 40, 64];
const NO_SELECTION: RowKey[] = [];

const omitKey = (record: Record<string, number>, key: string): Record<string, number> =>
  Object.fromEntries(Object.entries(record).filter(([name]) => name !== key));

const ariaSort = (sort: TableSort | null, key: string): 'ascending' | 'descending' | undefined => {
  if (sort?.key !== key) return undefined;
  return sort.dir === 'asc' ? 'ascending' : 'descending';
};

/** Data table: toolbar (title · count · actions), sort, row selection (Shift-click selects a range) with bulk-action bar, drag-to-resize columns, expandable detail rows, sticky header, keyboard (↑↓ move · Space select · →/← expand · ⌘A all · Esc clear), skeleton loading, empty state. Framed on its own; borderless inside `<Card padding="none">`. */
export const Table = <T extends object>(props: TableProps<T>): JSX.Element => {
  const p = mergeProps(
    {
      rowKey: 'id',
      selectable: false,
      selected: NO_SELECTION,
      loading: false,
      loadingRows: 4,
      resizable: false,
    } satisfies Partial<TableProps<T>>,
    props,
  );
  const translate = useTranslate();
  const empty = () => p.empty ?? translate('velvet.data.table.empty');
  const [sort, setSort] = createControllable<TableSort | null>({
    value: () => p.sort,
    defaultValue: p.defaultSort ?? null,
    onChange: (next) => p.onSortChange?.(next),
  });
  const [widths, setWidths] = createSignal<Record<string, number>>({});
  const [expanded, setExpanded] = createSignal<RowKey[]>([]);
  const [pinOffsets, setPinOffsets] = createSignal<Record<string, PinOffset>>({});
  const [scrolled, setScrolled] = createSignal({ left: false, right: false });
  let lastIndex: number | undefined;
  let body!: HTMLTableSectionElement;
  let head!: HTMLTableSectionElement;
  let scroller!: HTMLDivElement;

  const title = resolveChildren(() => p.title);
  const toolbar = resolveChildren(() => p.toolbar);
  const bulkActions = resolveChildren(() => p.bulkActions);
  const count = resolveChildren(() => p.count);

  const hasPins = createMemo(() => p.columns.some((c) => c.pin));
  const pinSignature = createMemo(() => p.columns.map((c) => `${c.key}:${c.pin ?? ''}`).join('|'));
  const hasLeftPin = () => p.columns.some((c) => c.pin === 'left');
  const checkPinned = () => hasPins() && hasLeftPin() && p.selectable;
  const anyWidth = () => Object.keys(widths()).length > 0;

  createEffect(() => {
    pinSignature();
    widths();
    const selectable = p.selectable;
    const hasExpander = !!p.renderExpanded;
    if (!hasPins()) {
      setPinOffsets({});
      return;
    }
    const measure = () => {
      const cells = [...head.querySelectorAll('th')];
      const lead = selectable ? 1 : 0;
      const widthAt = (i: number) => cells[i]?.getBoundingClientRect().width ?? 0;
      const next: Record<string, PinOffset> = {};
      let x = selectable ? widthAt(0) : 0;
      const columns = p.columns;
      columns.forEach((c, i) => {
        if (c.pin !== 'left') return;
        next[c.key] = { side: 'left', offset: x, edge: false };
        x += widthAt(i + lead);
      });
      let y = hasExpander ? widthAt(cells.length - 1) : 0;
      for (let i = columns.length - 1; i >= 0; i--) {
        const c = columns[i];
        if (c?.pin !== 'right') continue;
        next[c.key] = { side: 'right', offset: y, edge: false };
        y += widthAt(i + lead);
      }
      const lastLeft = [...columns].reverse().find((c) => c.pin === 'left');
      const firstRight = columns.find((c) => c.pin === 'right');
      [lastLeft, firstRight].forEach((c) => {
        const entry = c && next[c.key];
        if (entry) entry.edge = true;
      });
      setPinOffsets(next);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(head);
    onCleanup(() => observer.disconnect());
  });

  const updateScrolled = () => {
    if (!hasPins()) return;
    const left = scroller.scrollLeft > 0;
    const right = scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth - 1;
    if (left !== scrolled().left || right !== scrolled().right) setScrolled({ left, right });
  };
  createEffect(() => {
    pinSignature();
    pinOffsets();
    updateScrolled();
  });

  const pinStyle = (key: string): JSX.CSSProperties => {
    const pin = pinOffsets()[key];
    if (!pin) return {};
    const offset = `${pin.offset}px`;
    return pin.side === 'left' ? { position: 'sticky', left: offset } : { position: 'sticky', right: offset };
  };
  const pinClass = (key: string) => {
    const pin = pinOffsets()[key];
    return pin && cx('vui-table__pin', `vui-table__pin--${pin.side}`, pin.edge && 'vui-table__pin--edge');
  };
  const cellClass = (c: TableColumn<T>) =>
    cx(c.align === 'right' && 'vui-table__num', c.hideOnMobile && 'vui-hide-sm', pinClass(c.key));

  const serverSorted = () => !!p.onSortChange && p.sort !== undefined;
  const sorted = createMemo(() => {
    const current = sort();
    if (!current || serverSorted()) return p.rows;
    const col = p.columns.find((c) => c.key === current.key);
    if (!col) return p.rows;
    const sortValue = col.sortValue;
    return sortRows(p.rows, sortValue ?? ((row) => rowValue(row, col.key)), current.dir);
  });

  const keyOf = (row: T, index: number) => rowId(row, p.rowKey, index);
  const allKeys = () => p.rows.map((r, i) => keyOf(r, i));
  const allOn = () => p.rows.length > 0 && allKeys().every((k) => p.selected.includes(k));
  const someOn = () => !allOn() && allKeys().some((k) => p.selected.includes(k));
  const setSelected = (keys: RowKey[]) => p.onSelectedChange?.(keys);
  const toggle = (key: RowKey) =>
    setSelected(p.selected.includes(key) ? p.selected.filter((x) => x !== key) : [...p.selected, key]);
  const toggleAll = () => setSelected(allOn() ? [] : allKeys());
  const toggleExpanded = (key: RowKey) =>
    setExpanded((x) => (x.includes(key) ? x.filter((y) => y !== key) : [...x, key]));

  const clickCheck = (e: MouseEvent, index: number, key: RowKey) => {
    if (e.shiftKey && lastIndex !== undefined) {
      const from = Math.min(lastIndex, index);
      const to = Math.max(lastIndex, index);
      const rangeKeys = sorted()
        .slice(from, to + 1)
        .map((r, i) => keyOf(r, from + i));
      const turnOn = !p.selected.includes(key);
      setSelected(
        turnOn ? [...new Set([...p.selected, ...rangeKeys])] : p.selected.filter((x) => !rangeKeys.includes(x)),
      );
    } else {
      toggle(key);
    }
    lastIndex = index;
  };

  const onRowKey = (e: KeyboardEvent & { currentTarget: HTMLTableRowElement }, key: RowKey) => {
    if (e.target !== e.currentTarget) return;
    const rows = [...body.querySelectorAll<HTMLElement>('tr[tabindex]')];
    const i = rows.indexOf(e.currentTarget);
    const moveFocus = (target: HTMLElement | undefined) => {
      if (!target) return false;
      e.preventDefault();
      target.focus();
      return true;
    };
    if (e.key === 'ArrowDown' && moveFocus(rows[i + 1])) return;
    if (e.key === 'ArrowUp' && moveFocus(rows[i - 1])) return;
    if (p.renderExpanded && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault();
      if ((e.key === 'ArrowRight') !== expanded().includes(key)) toggleExpanded(key);
    } else if (p.selectable && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      toggle(key);
    } else if (p.selectable && e.key === 'a' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setSelected(allKeys());
    } else if (p.selectable && e.key === 'Escape') {
      setSelected([]);
    }
  };

  const columnName = (c: TableColumn<T>) => (typeof c.label === 'string' ? c.label : c.key);
  const resizeHandle = (c: TableColumn<T>) => (
    <Show when={p.resizable}>
      <ColumnResize
        label={translate('velvet.data.table.resizeColumn', { name: columnName(c) })}
        width={widths()[c.key]}
        onResize={(w) => setWidths((x) => ({ ...x, [c.key]: w }))}
        onReset={() => setWidths((x) => omitKey(x, c.key))}
      />
    </Show>
  );

  const span = () => p.columns.length + (p.selectable ? 1 : 0) + (p.renderExpanded ? 1 : 0);
  const sticky = () => p.stickyHeader ?? !!p.maxHeight;
  const countNode = () => (count() != null ? count() : title() ? p.rows.length : null);
  const showHead = () => !!title() || !!toolbar() || count() != null || (p.resizable && anyWidth());
  const scrollStyle = (): JSX.CSSProperties | undefined =>
    p.maxHeight ? { 'max-height': cssLength(p.maxHeight), 'overflow-y': 'auto' } : undefined;

  return (
    <div class={cx('vui-table-wrap', p.class)}>
      <Show when={showHead()}>
        <div class="vui-table__toolbar">
          <Show when={title()}>
            <span class="vui-table__title">{title()}</span>
          </Show>
          <Show when={countNode() != null}>
            <span class="vui-table__count">{countNode()}</span>
          </Show>
          <div class="vui-table__tools">
            <Show when={p.resizable && anyWidth()}>
              <Button variant="secondary" size="sm" onClick={() => setWidths({})}>
                {translate('velvet.data.table.resetWidths')}
              </Button>
            </Show>
            {toolbar()}
          </div>
        </div>
      </Show>
      <Show when={p.selectable && bulkActions() && p.selected.length > 0}>
        <div class="vui-table__bulk" role="region" aria-label={translate('velvet.data.table.bulkActionsLabel')}>
          <span>{translate('velvet.data.table.selected', { count: p.selected.length })}</span>
          <div class="vui-table__bulk-actions">{bulkActions()}</div>
          <Button variant="ghost" size="sm" onClick={() => setSelected([])}>
            {translate('velvet.common.clear')}
          </Button>
        </div>
      </Show>
      <div
        ref={scroller}
        onScroll={updateScrolled}
        class={cx(
          'vui-table__scroll',
          scrolled().left && 'vui-table__scroll--l',
          scrolled().right && 'vui-table__scroll--r',
        )}
        style={scrollStyle()}
      >
        <table
          class={cx(
            'vui-table',
            sticky() && 'vui-table--sticky',
            anyWidth() && 'vui-table--fixed',
            hasPins() && 'vui-table--pins',
          )}
          aria-busy={p.loading || undefined}
        >
          <thead ref={head}>
            <tr>
              <Show when={p.selectable}>
                <th
                  class={cx('vui-table__check', checkPinned() && 'vui-table__pin vui-table__pin--left')}
                  style={checkPinned() ? { position: 'sticky', left: '0' } : undefined}
                >
                  <Checkbox
                    aria-label={translate('velvet.data.table.selectAll')}
                    checked={allOn()}
                    onChange={toggleAll}
                    disabled={p.loading}
                    indeterminate={someOn()}
                  />
                </th>
              </Show>
              <For each={p.columns}>
                {(c) => (
                  <th
                    class={cx(cellClass(c), c.sortable && 'vui-table__sortable')}
                    style={{ width: cssLength(widths()[c.key] ?? c.width), ...pinStyle(c.key) }}
                    aria-sort={c.sortable ? ariaSort(sort(), c.key) : undefined}
                  >
                    <Show when={c.sortable} fallback={c.label}>
                      <button type="button" class="vui-table__sort" onClick={() => setSort(nextSort(sort(), c.key))}>
                        {c.label}
                        <Glyph name="arrow-up" />
                      </button>
                    </Show>
                    {resizeHandle(c)}
                  </th>
                )}
              </For>
              <Show when={p.renderExpanded}>
                <th class="vui-table__exp" aria-label={translate('velvet.data.table.details')} />
              </Show>
            </tr>
          </thead>
          <tbody ref={body}>
            <Show when={p.loading}>
              <Index each={Array.from({ length: p.loadingRows })}>
                {(_, i) => (
                  <tr>
                    <Show when={p.selectable}>
                      <td>
                        <Skeleton width={18} height={18} />
                      </td>
                    </Show>
                    <For each={p.columns}>
                      {(c, j) => (
                        <td class={cellClass(c)}>
                          <Skeleton
                            width={`${SKELETON_WIDTHS[(i + j()) % SKELETON_WIDTHS.length]}%`}
                            style={{ 'margin-left': c.align === 'right' ? 'auto' : '0' }}
                          />
                        </td>
                      )}
                    </For>
                    <Show when={p.renderExpanded}>
                      <td />
                    </Show>
                  </tr>
                )}
              </Index>
            </Show>
            <Show when={!p.loading}>
              <For each={sorted()}>
                {(row, i) => {
                  const key = () => keyOf(row, i());
                  const on = () => p.selected.includes(key());
                  const open = () => !!p.renderExpanded && expanded().includes(key());
                  return (
                    <>
                      <tr
                        tabIndex={0}
                        aria-selected={p.selectable ? on() : undefined}
                        aria-expanded={p.renderExpanded ? open() : undefined}
                        class={cx(open() && 'vui-table__row--open')}
                        onKeyDown={(e) => onRowKey(e, key())}
                      >
                        <Show when={p.selectable}>
                          <td
                            class={checkPinned() ? 'vui-table__pin vui-table__pin--left' : undefined}
                            style={checkPinned() ? { position: 'sticky', left: '0' } : undefined}
                          >
                            <Checkbox
                              tabIndex={-1}
                              aria-label={translate('velvet.data.table.selectRow')}
                              checked={on()}
                              onClick={(e) => clickCheck(e, i(), key())}
                            />
                          </td>
                        </Show>
                        <For each={p.columns}>
                          {(c) => (
                            <td class={cellClass(c)} style={pinStyle(c.key)}>
                              {c.render ? c.render(row) : cellText(rowValue(row, c.key))}
                            </td>
                          )}
                        </For>
                        <Show when={p.renderExpanded}>
                          <td class="vui-table__exp">
                            <button
                              type="button"
                              tabIndex={-1}
                              class="vui-table__expbtn"
                              aria-label={translate(
                                open() ? 'velvet.data.table.collapseRow' : 'velvet.data.table.expandRow',
                              )}
                              aria-expanded={open()}
                              onClick={() => toggleExpanded(key())}
                            >
                              <Glyph name="chevron-down" />
                            </button>
                          </td>
                        </Show>
                      </tr>
                      <Show when={open()}>
                        <tr class="vui-table__detail">
                          <td colSpan={span()}>
                            <div class="vui-table__detail-in">{p.renderExpanded?.(row)}</div>
                          </td>
                        </tr>
                      </Show>
                    </>
                  );
                }}
              </For>
              <Show when={p.rows.length === 0}>
                <tr>
                  <td class="vui-table__empty" colSpan={span()}>
                    {empty()}
                  </td>
                </tr>
              </Show>
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
};
