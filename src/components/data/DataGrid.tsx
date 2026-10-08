import { createMemo, createSignal, For, type JSX, mergeProps, Show, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate, useTranslateRich } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Popover } from '../feedback/Popover';
import { Checkbox } from '../forms/Checkbox';
import { SearchInput } from '../forms/SearchInput';
import { emptyQuery, QueryBuilder, type QueryField, type QueryGroup } from '../patterns/QueryBuilder';
import { ColumnResize } from '../primitives/ColumnResize';
import { Count } from '../primitives/Count';
import { EmptyText } from '../primitives/EmptyText';
import { Glyph } from '../primitives/Glyph';
import { applyColumns } from './applyColumns';
import { ColumnManager, type ColumnState } from './ColumnManager';
import { downloadCsv, toCsv } from './exportCsv';
import { countActiveRules, matchesQuery } from './gridFilter';
import { cellText, clamp, nextSort, rowId, type RowKey, type RowSort, rowValue, sortRows } from './rowData';

export interface GridColumn<T extends object = object> {
  key: string;
  label: JSX.Element;
  /** px, resizable by dragging the header edge. @default 160 */
  width?: number;
  /** number = right-aligned, tabular, parsed on edit. */
  type?: 'text' | 'number';
  editable?: boolean;
  /** Edit with a select. */
  options?: string[];
  format?: (value: unknown) => JSX.Element;
  render?: (row: T) => JSX.Element;
  /** Start pinned (frozen) to the left. */
  pin?: 'left';
  /** Start hidden (re-enable in Columns). */
  hidden?: boolean;
  /** Can't be hidden / moved / unpinned in Columns. */
  locked?: boolean;
}

export interface GridRowChange {
  row: RowKey;
  key: string;
  value: unknown;
}

export interface DataGridProps<T extends object = object> {
  columns: GridColumn<T>[];
  rows: T[];
  /** @default 'id' */
  rowKey?: string;
  onRowsChange?: (rows: T[], change: GridRowChange) => void;
  /** Scroll area height in px. @default 360 */
  height?: number;
  /** Pin the first column when no column sets pin. @default true */
  stickyFirst?: boolean;
  /** @default true */
  rowNumbers?: boolean;
  selectable?: boolean;
  /** Selected row keys (controlled). */
  selected?: RowKey[];
  onSelectionChange?: (keys: RowKey[]) => void;
  /** Buttons shown in the toolbar while rows are selected. */
  bulkActions?: (rows: T[]) => JSX.Element;
  /** Expandable detail panel under a row. */
  renderDetail?: (row: T) => JSX.Element;
  /** Free-text filter across visible columns. */
  searchable?: boolean;
  /** @default localized "Filter N records…" */
  searchPlaceholder?: string;
  /** Enables the Filters popover (QueryBuilder). */
  filterFields?: QueryField[];
  /** Enables the Columns popover (ColumnManager). */
  columnManager?: boolean;
  /** Shows Export. Pass null for a built-in CSV download of the current view. */
  onExport?: ((rows: T[], columns: GridColumn<T>[]) => void) | null;
  /** Extra toolbar nodes on the right. */
  toolbarEnd?: JSX.Element;
  /** true = "Showing X of Y"; a node adds it on the right. */
  footer?: JSX.Element;
  class?: string;
}

type CellEdit = { row: number; col: number };
type EditMove = 'down' | 'right' | 'stay';

const ROW_NUMBER_WIDTH = 44;
const CHECK_WIDTH = 40;
const DEFAULT_COLUMN_WIDTH = 160;
const PAGE_ROWS = 10;
const EXPORT_FILE_NAME = 'export.csv';

const initialColumnState = <T extends object>(columns: GridColumn<T>[], stickyFirst: boolean): ColumnState[] => {
  const anyPinned = columns.some((c) => c.pin);
  return columns.map((c, i) => ({
    key: c.key,
    visible: !c.hidden,
    pin: c.pin ?? (!anyPinned && stickyFirst && i === 0 ? 'left' : null),
  }));
};

const columnName = <T extends object>(c: GridColumn<T>) => (typeof c.label === 'string' ? c.label : c.key);

const warnClipboard = (error: unknown) => console.warn('DataGrid: copying the cell failed', error);

/**
 * Advanced data grid. Spreadsheet core: single active cell, arrows / Home / End / PageUp/Down, Enter / F2 / typing edits,
 * Enter commits ↓, Tab →, Esc cancels, ⌘C copies; sortable headers, resizable columns, sticky header.
 * Optional layers, each one prop: toolbar search (`searchable`), Filters popover with a QueryBuilder (`filterFields`),
 * Columns popover with ColumnManager (`columnManager`), Export (`onExport`; null = CSV download), row checkboxes with
 * select-all + bulk bar (`selectable`, `bulkActions`; Space toggles), expandable detail rows (`renderDetail`; Enter on a
 * read-only cell toggles), frozen columns with a shadow on horizontal scroll, "Showing X of Y" footer.
 * Use Table for simple read-only lists.
 */
export const DataGrid = <T extends object>(props: DataGridProps<T>): JSX.Element => {
  const p = mergeProps(
    {
      rowKey: 'id',
      height: 360,
      stickyFirst: true,
      rowNumbers: true,
      selectable: false,
      searchable: false,
      columnManager: false,
      footer: false,
    } satisfies Partial<DataGridProps<T>>,
    props,
  );
  const translate = useTranslate();
  const translateRich = useTranslateRich();
  const [cell, setCell] = createSignal({ row: 0, col: 0 });
  const [edit, setEdit] = createSignal<CellEdit | null>(null);
  const [draft, setDraft] = createSignal('');
  const [widths, setWidths] = createSignal<Record<string, number>>(
    untrack(() => Object.fromEntries(p.columns.map((c) => [c.key, c.width ?? DEFAULT_COLUMN_WIDTH]))),
  );
  const [sort, setSort] = createSignal<RowSort | null>(null);
  const [search, setSearch] = createSignal('');
  const [query, setQuery] = createSignal<QueryGroup | undefined>(
    untrack(() => (p.filterFields ? emptyQuery(p.filterFields) : undefined)),
  );
  const [columnState, setColumnState] = createSignal<ColumnState[]>(
    untrack(() => initialColumnState(p.columns, p.stickyFirst)),
  );
  const [selection, setSelection] = createControllable<RowKey[]>({
    value: () => p.selected,
    defaultValue: [],
    onChange: (keys) => p.onSelectionChange?.(keys),
  });
  const [open, setOpen] = createSignal<ReadonlySet<RowKey>>(new Set());
  const [scrolled, setScrolled] = createSignal(false);
  let grid!: HTMLDivElement;

  const columnWidth = (key: string) => widths()[key] ?? DEFAULT_COLUMN_WIDTH;
  const cols = createMemo(() => applyColumns(p.columns, columnState()));
  const activeFilters = () => {
    const q = query();
    return q ? countActiveRules(q) : 0;
  };
  const keyOf = (row: T, index: number) => rowId(row, p.rowKey, index);

  const view = createMemo(() => {
    let out = p.rows;
    const needle = search().trim().toLowerCase();
    if (needle)
      out = out.filter((r) => cols().some((c) => cellText(rowValue(r, c.key)).toLowerCase().includes(needle)));
    const q = query();
    if (q && activeFilters()) out = out.filter((r) => matchesQuery(q, r));
    const current = sort();
    if (current) out = sortRows(out, (r) => rowValue(r, current.key), current.dir);
    return out;
  });

  const selectedSet = createMemo(() => new Set(selection()));
  const viewKeys = () => view().map(keyOf);
  const allOn = () => view().length > 0 && viewKeys().every((k) => selectedSet().has(k));
  const someOn = () => !allOn() && viewKeys().some((k) => selectedSet().has(k));
  const selectedRows = () => p.rows.filter((r, i) => selectedSet().has(keyOf(r, i)));
  const toggleAll = () => {
    const next = new Set(selectedSet());
    viewKeys().forEach((k) => (allOn() ? next.delete(k) : next.add(k)));
    setSelection([...next]);
  };
  const toggleRow = (key: RowKey) => {
    const next = new Set(selectedSet());
    if (!next.delete(key)) next.add(key);
    setSelection([...next]);
  };
  const toggleOpen = (key: RowKey) =>
    setOpen((current) => {
      const next = new Set(current);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  const focusCell = (row: number, col: number) => {
    setCell({ row, col });
    requestAnimationFrame(() => grid.querySelector<HTMLElement>(`[data-rc="${row}-${col}"]`)?.focus());
  };

  const startEdit = (row: number, col: number, seed?: string) => {
    const column = cols()[col];
    const record = view()[row];
    if (!column?.editable || !record) return;
    setEdit({ row, col });
    setDraft(seed ?? cellText(rowValue(record, column.key)));
  };

  const commit = (move: EditMove = 'stay') => {
    const current = edit();
    if (!current) return;
    const column = cols()[current.col];
    const record = view()[current.row];
    setEdit(null);
    if (column && record) {
      const previous = rowValue(record, column.key);
      const parsed = parseFloat(draft().replace(',', '.'));
      const value = column.type === 'number' ? (Number.isNaN(parsed) ? previous : parsed) : draft();
      if (value !== previous) {
        const id = rowValue(record, p.rowKey);
        p.onRowsChange?.(
          p.rows.map((x) => (rowValue(x, p.rowKey) === id ? { ...x, [column.key]: value } : x)),
          { row: rowId(record, p.rowKey, current.row), key: column.key, value },
        );
      }
    }
    if (move === 'down') focusCell(Math.min(view().length - 1, current.row + 1), current.col);
    else if (move === 'right') focusCell(current.row, Math.min(cols().length - 1, current.col + 1));
    else focusCell(current.row, current.col);
  };

  const cancelEdit = (row: number, col: number) => {
    setEdit(null);
    focusCell(row, col);
  };

  const onKey: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    if (edit() || !(e.target instanceof Element) || !e.target.matches('[role="gridcell"]')) return;
    const { row, col } = cell();
    const lastRow = () => view().length - 1;
    const lastCol = () => cols().length - 1;
    const column = cols()[col];
    const record = view()[row];
    if (!column || !record) return;
    const go = (nextRow: number, nextCol: number) => {
      e.preventDefault();
      focusCell(clamp(nextRow, 0, lastRow()), clamp(nextCol, 0, lastCol()));
    };
    if (e.key === 'ArrowDown') go(row + 1, col);
    else if (e.key === 'ArrowUp') go(row - 1, col);
    else if (e.key === 'ArrowRight') go(row, col + 1);
    else if (e.key === 'ArrowLeft') go(row, col - 1);
    else if (e.key === 'Home') go(e.ctrlKey ? 0 : row, 0);
    else if (e.key === 'End') go(e.ctrlKey ? lastRow() : row, lastCol());
    else if (e.key === 'PageDown') go(row + PAGE_ROWS, col);
    else if (e.key === 'PageUp') go(row - PAGE_ROWS, col);
    else if (e.key === ' ' && p.selectable) {
      e.preventDefault();
      toggleRow(keyOf(record, row));
    } else if (e.key === 'Enter' || e.key === 'F2') {
      e.preventDefault();
      if (column.editable) startEdit(row, col);
      else if (p.renderDetail) toggleOpen(keyOf(record, row));
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && column.editable) {
      e.preventDefault();
      startEdit(row, col, '');
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && column.editable) {
      e.preventDefault();
      startEdit(row, col, e.key);
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
      navigator.clipboard.writeText(cellText(rowValue(record, column.key))).catch(warnClipboard);
    }
  };

  const exportRows = () => {
    if (p.onExport) {
      p.onExport(view(), cols());
      return;
    }
    downloadCsv(
      toCsv(
        view(),
        cols().map((c) => ({ key: c.key, header: columnName(c) })),
      ),
      EXPORT_FILE_NAME,
    );
  };

  const leadWidth = () => (p.rowNumbers ? ROW_NUMBER_WIDTH : 0) + (p.selectable ? CHECK_WIDTH : 0);
  const pinLeft = createMemo(() => {
    const offsets: Record<string, number> = {};
    let x = leadWidth();
    let last: string | undefined;
    cols().forEach((c) => {
      if (c.pin !== 'left') return;
      offsets[c.key] = x;
      x += columnWidth(c.key);
      last = c.key;
    });
    return { offsets, last };
  });
  const template = () =>
    [
      p.rowNumbers && `${ROW_NUMBER_WIDTH}px`,
      p.selectable && `${CHECK_WIDTH}px`,
      ...cols().map((c) => `${columnWidth(c.key)}px`),
    ]
      .filter(Boolean)
      .join(' ');
  const pinClass = (c: GridColumn<T>) =>
    c.pin === 'left' && cx('vui-grid__pin', c.key === pinLeft().last && 'vui-grid__pin--last');
  const pinStyle = (c: GridColumn<T>): JSX.CSSProperties | undefined =>
    c.pin === 'left' ? { left: `${pinLeft().offsets[c.key] ?? 0}px` } : undefined;
  const checkLeft = (): JSX.CSSProperties => ({ left: `${p.rowNumbers ? ROW_NUMBER_WIDTH : 0}px` });

  const hasToolbar = () =>
    p.searchable ||
    !!p.filterFields ||
    p.columnManager ||
    p.onExport !== undefined ||
    !!p.toolbarEnd ||
    (p.selectable && !!p.bulkActions);
  const emptyMessage = () => {
    const count = activeFilters();
    const term = search();
    if (term && count) return translate('velvet.data.dataGrid.noRowsTermFilters', { term, count });
    if (term) return translate('velvet.data.dataGrid.noRowsTerm', { term });
    if (count) return translate('velvet.data.dataGrid.noRowsFilters', { count });
    return translate('velvet.data.dataGrid.noRows');
  };
  const selectedCount = () =>
    translateRich('velvet.data.dataGrid.selected', {
      count: selectedRows().length,
      b: (children) => <b>{children}</b>,
    });

  const renderCell = (c: GridColumn<T>, row: T): JSX.Element => {
    if (c.render) return c.render(row);
    const value = rowValue(row, c.key);
    return c.format ? c.format(value) : cellText(value);
  };

  const focusOnMount = (el: HTMLElement) => queueMicrotask(() => el.focus());

  return (
    <div class={cx('vui-dgrid', p.class)}>
      <Show when={hasToolbar()}>
        <div class="vui-dgrid__bar">
          <Show
            when={p.selectable && selectedRows().length > 0}
            fallback={
              <Show when={p.searchable}>
                <SearchInput
                  size="sm"
                  class="vui-dgrid__search"
                  aria-label={translate('velvet.data.dataGrid.searchLabel')}
                  placeholder={
                    p.searchPlaceholder ?? translate('velvet.data.dataGrid.searchPlaceholder', { count: p.rows.length })
                  }
                  value={search()}
                  onValueChange={setSearch}
                />
              </Show>
            }
          >
            <div class="vui-dgrid__bulk">
              <span class="vui-dgrid__bulk-n">{selectedCount()}</span>
              <Button size="sm" variant="ghost" onClick={() => setSelection([])}>
                {translate('velvet.common.clear')}
              </Button>
              {p.bulkActions?.(selectedRows())}
            </div>
          </Show>
          <div class="vui-dgrid__tools">
            <Show when={p.filterFields}>
              {(fields) => (
                <Popover
                  class="vui-dgrid__pop vui-dgrid__pop--wide"
                  align="end"
                  title={translate('velvet.data.dataGrid.filters')}
                  trigger={
                    <Button size="sm" variant="secondary" iconLeft="filter">
                      {translate('velvet.data.dataGrid.filters')}
                      <Show when={activeFilters() > 0}>
                        <Count value={activeFilters()} size="sm" class="vui-dgrid__count" />
                      </Show>
                    </Button>
                  }
                >
                  <QueryBuilder fields={fields()} value={query()} onValueChange={setQuery} />
                  <Show when={activeFilters() > 0}>
                    <div class="vui-dgrid__popfoot">
                      <Button size="sm" variant="ghost" onClick={() => setQuery(emptyQuery(fields()))}>
                        {translate('velvet.data.dataGrid.resetFilters')}
                      </Button>
                    </div>
                  </Show>
                </Popover>
              )}
            </Show>
            <Show when={p.columnManager}>
              <Popover
                class="vui-dgrid__pop"
                align="end"
                trigger={
                  <Button size="sm" variant="secondary" iconLeft="sliders">
                    {translate('velvet.data.dataGrid.columns')}
                  </Button>
                }
              >
                <ColumnManager
                  columns={p.columns.map((c) => ({
                    key: c.key,
                    label: c.label,
                    visible: !c.hidden,
                    pin: c.pin,
                    locked: c.locked,
                  }))}
                  value={columnState()}
                  onValueChange={setColumnState}
                />
              </Popover>
            </Show>
            <Show when={p.onExport !== undefined}>
              <Button size="sm" variant="secondary" iconLeft="download" onClick={exportRows}>
                {translate('velvet.data.dataGrid.export')}
              </Button>
            </Show>
            {p.toolbarEnd}
          </div>
        </div>
      </Show>
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- grid uses roving tabindex: the active gridcell holds the tab stop */}
      <div
        ref={grid}
        role="grid"
        aria-rowcount={view().length + 1}
        aria-colcount={cols().length}
        aria-multiselectable={p.selectable || undefined}
        class={cx('vui-grid', scrolled() && 'vui-grid--scrolled')}
        style={{ height: `${p.height}px`, '--grid-tpl': template() }}
        onKeyDown={onKey}
        onScroll={(e) => setScrolled(e.currentTarget.scrollLeft > 2)}
      >
        <div role="row" class="vui-grid__row vui-grid__row--head">
          <Show when={p.rowNumbers}>
            <div class="vui-grid__rn" aria-hidden="true">
              #
            </div>
          </Show>
          <Show when={p.selectable}>
            <div class="vui-grid__chk" style={checkLeft()}>
              <Checkbox
                aria-label={translate('velvet.data.dataGrid.selectAllRows')}
                checked={allOn()}
                indeterminate={someOn()}
                onChange={toggleAll}
              />
            </div>
          </Show>
          <For each={cols()}>
            {(c) => {
              const sorted = () => sort()?.key === c.key;
              return (
                <div
                  role="columnheader"
                  aria-sort={sorted() ? (sort()?.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  class={cx('vui-grid__hd', c.type === 'number' && 'vui-grid__num', pinClass(c))}
                  style={pinStyle(c)}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    class="vui-grid__hbtn"
                    onClick={() => setSort(nextSort(sort(), c.key))}
                  >
                    {c.label}
                    <Show
                      when={sorted()}
                      fallback={<Glyph name="chevrons-up-down" class="vui-grid__sort vui-grid__sort--idle" />}
                    >
                      <Glyph name={sort()?.dir === 'asc' ? 'arrow-up' : 'arrow-down'} class="vui-grid__sort" />
                    </Show>
                    <Show when={c.editable}>
                      <Glyph name="pencil" class="vui-grid__edit-ic" />
                    </Show>
                  </button>
                  <ColumnResize
                    label={translate('velvet.data.dataGrid.resizeColumn', { name: columnName(c) })}
                    width={widths()[c.key]}
                    onResize={(w) => setWidths((x) => ({ ...x, [c.key]: w }))}
                  />
                </div>
              );
            }}
          </For>
        </div>
        <Show when={view().length === 0}>
          <EmptyText class="vui-grid__empty">{emptyMessage()}</EmptyText>
        </Show>
        <For each={view()}>
          {(row, r) => {
            const key = () => keyOf(row, r());
            const isSelected = () => selectedSet().has(key());
            const isOpen = () => !!p.renderDetail && open().has(key());
            return (
              <>
                <div
                  role="row"
                  aria-rowindex={r() + 2}
                  aria-selected={p.selectable ? isSelected() : undefined}
                  aria-expanded={p.renderDetail ? isOpen() : undefined}
                  class={cx(
                    'vui-grid__row',
                    cell().row === r() && 'vui-grid__row--cur',
                    isSelected() && 'vui-grid__row--sel',
                    isOpen() && 'vui-grid__row--open',
                  )}
                >
                  <Show when={p.rowNumbers}>
                    <div class="vui-grid__rn" aria-hidden="true">
                      {r() + 1}
                    </div>
                  </Show>
                  <Show when={p.selectable}>
                    <div class="vui-grid__chk" style={checkLeft()}>
                      <Checkbox
                        tabIndex={-1}
                        aria-label={translate('velvet.data.dataGrid.selectRow', { row: r() + 1 })}
                        checked={isSelected()}
                        onChange={() => toggleRow(key())}
                      />
                    </div>
                  </Show>
                  <For each={cols()}>
                    {(c, ci) => {
                      const active = () => cell().row === r() && cell().col === ci();
                      const editing = () => edit()?.row === r() && edit()?.col === ci();
                      return (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- gridcell keyboard handling lives on the grid owner (onKeyDown)
                        <div
                          role="gridcell"
                          data-rc={`${r()}-${ci()}`}
                          tabIndex={active() && !editing() ? 0 : -1}
                          aria-readonly={!c.editable || undefined}
                          class={cx(
                            'vui-grid__cell',
                            active() && 'vui-grid__cell--on',
                            editing() && 'vui-grid__cell--edit',
                            c.type === 'number' && 'vui-grid__num',
                            c.editable && 'vui-grid__cell--editable',
                            pinClass(c),
                          )}
                          style={pinStyle(c)}
                          onClick={() => setCell({ row: r(), col: ci() })}
                          onDblClick={() => startEdit(r(), ci())}
                        >
                          <Show when={ci() === 0 && p.renderDetail && !editing()}>
                            <button
                              type="button"
                              tabIndex={-1}
                              class="vui-grid__exp"
                              aria-label={translate(
                                isOpen() ? 'velvet.data.dataGrid.collapseRow' : 'velvet.data.dataGrid.expandRow',
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleOpen(key());
                              }}
                            >
                              <Glyph name="chevron-right" />
                            </button>
                          </Show>
                          <Show
                            when={editing()}
                            fallback={
                              <span class={cx('vui-grid__val', c.render && 'vui-grid__val--custom')}>
                                {renderCell(c, row)}
                              </span>
                            }
                          >
                            <Show
                              when={c.options}
                              fallback={
                                <input
                                  ref={focusOnMount}
                                  class="vui-grid__input"
                                  value={draft()}
                                  inputMode={c.type === 'number' ? 'decimal' : undefined}
                                  onInput={(e) => setDraft(e.currentTarget.value)}
                                  onBlur={() => commit()}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      commit('down');
                                    } else if (e.key === 'Tab') {
                                      e.preventDefault();
                                      commit('right');
                                    } else if (e.key === 'Escape') {
                                      e.preventDefault();
                                      cancelEdit(r(), ci());
                                    }
                                  }}
                                />
                              }
                            >
                              {(options) => (
                                <select
                                  ref={focusOnMount}
                                  class="vui-grid__input"
                                  value={draft()}
                                  onChange={(e) => setDraft(e.currentTarget.value)}
                                  onBlur={() => commit()}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      commit('down');
                                    } else if (e.key === 'Escape') {
                                      cancelEdit(r(), ci());
                                    }
                                  }}
                                >
                                  <For each={options()}>
                                    {(o) => (
                                      <option value={o} selected={o === draft()}>
                                        {o}
                                      </option>
                                    )}
                                  </For>
                                </select>
                              )}
                            </Show>
                          </Show>
                        </div>
                      );
                    }}
                  </For>
                </div>
                <Show when={isOpen()}>
                  <div role="row" class="vui-grid__row vui-grid__row--detail">
                    <div role="gridcell" class="vui-grid__detail">
                      <div class="vui-grid__detail-in" style={{ 'padding-left': `${leadWidth() + 36}px` }}>
                        {p.renderDetail?.(row)}
                      </div>
                    </div>
                  </div>
                </Show>
              </>
            );
          }}
        </For>
      </div>
      <Show when={p.footer}>
        <div class="vui-dgrid__foot">
          <span aria-live="polite">
            {translateRich('velvet.data.dataGrid.showing', {
              shown: view().length,
              total: p.rows.length,
              b: (children) => <b>{children}</b>,
            })}
          </span>
          <Show when={p.selectable && selectedRows().length > 0}>
            <span>{selectedCount()}</span>
          </Show>
          <Show when={typeof p.footer !== 'boolean'}>
            <span class="vui-dgrid__foot-end">{p.footer}</span>
          </Show>
        </div>
      </Show>
    </div>
  );
};
