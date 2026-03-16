import { IoCaretDown, IoCaretUp } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { createEffect, createMemo, createSignal, For, onCleanup, Show } from 'solid-js';

import Card from '~/components/data-display/Card/Card';
import Input from '~/components/inputs/Input/Input';
import CheckboxControl from '~/components/switchers/CheckboxControl/CheckboxControl';
import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DataGridPro.module.css';

type SortDirection = 'asc' | 'desc';
type DataGridProColumnPin = 'left' | 'right' | null;
type DataGridProColumnPinning = Partial<Record<string, DataGridProColumnPin>>;

interface DataGridProColumn<T> {
  key: keyof T & string;
  header: string;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  pinned?: 'left' | 'right';
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => JSX.Element;
  sortAccessor?: (row: T) => string | number | boolean | Date | null | undefined;
  sortFn?: (a: T, b: T, direction: SortDirection) => number;
  filterAccessor?: (row: T) => string | number | boolean | null | undefined;
  filterFn?: (row: T, query: string) => boolean;
}

interface DataGridProSortState {
  key: string | null;
  direction: SortDirection;
}

interface DataGridProProps<T> {
  data: T[];
  columns: DataGridProColumn<T>[];
  height?: number;
  rowHeight?: number;
  headerHeight?: number;
  overscan?: number;
  sortable?: boolean;
  striped?: boolean;
  emptyMessage?: string;
  getRowId?: (row: T, index: number) => string;
  selectable?: boolean;
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  filterable?: boolean;
  filterQuery?: string;
  defaultFilterQuery?: string;
  onFilterQueryChange?: (query: string) => void;
  filterPlaceholder?: string;
  filterFn?: (row: T, query: string) => boolean;
  manualFiltering?: boolean;
  sortKey?: string | null;
  sortDirection?: SortDirection;
  onSortChange?: (state: DataGridProSortState) => void;
  manualSorting?: boolean;
  showToolbar?: boolean;
  reorderable?: boolean;
  columnOrder?: string[];
  defaultColumnOrder?: string[];
  onColumnOrderChange?: (order: string[]) => void;
  columnVisibility?: Record<string, boolean>;
  defaultColumnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
  columnPinning?: DataGridProColumnPinning;
  defaultColumnPinning?: DataGridProColumnPinning;
  onColumnPinningChange?: (pinning: DataGridProColumnPinning) => void;
  persistenceKey?: string;
  resetPersistenceLabel?: string;
  onPersistenceReset?: () => void;
  importSettingsLabel?: string;
  exportSettingsLabel?: string;
  persistedBadgeLabel?: string;
  defaultBadgeLabel?: string;
}

interface ResizeState {
  key: string;
  startX: number;
  startWidth: number;
}

const DEFAULT_COLUMN_WIDTH = 180;
const SELECTION_COLUMN_WIDTH = 44;
const DATA_GRID_PERSISTENCE_VERSION = 1;

interface PersistedGridState {
  v: number;
  filterQuery?: string;
  sortKey?: string | null;
  sortDirection?: SortDirection;
  columnOrder?: string[];
  columnVisibility?: Record<string, boolean>;
  columnPinning?: DataGridProColumnPinning;
  columnWidths?: Record<string, number>;
}

const parseWidth = (width: number | string | undefined): number => {
  if (typeof width === 'number') return width;
  if (typeof width === 'string') {
    const parsed = Number(width.replace('px', '').trim());
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }
  return DEFAULT_COLUMN_WIDTH;
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const DataGridPro = <T extends Record<string, unknown>>(props: Props<DataGridProProps<T>>) => {
  const [internalSortKey, setInternalSortKey] = createSignal<string | null>(null);
  const [internalSortDirection, setInternalSortDirection] = createSignal<SortDirection>('asc');
  const [internalFilterQuery, setInternalFilterQuery] = createSignal(props.defaultFilterQuery ?? '');
  const [internalSelectedRowIds, setInternalSelectedRowIds] = createSignal<string[]>(props.defaultSelectedRowIds ?? []);
  const [internalColumnOrder, setInternalColumnOrder] = createSignal<string[]>([]);
  const [internalColumnVisibility, setInternalColumnVisibility] = createSignal<Record<string, boolean>>(
    props.defaultColumnVisibility ?? {}
  );
  const [internalColumnPinning, setInternalColumnPinning] = createSignal<DataGridProColumnPinning>(
    props.defaultColumnPinning ?? {}
  );
  const [columnWidths, setColumnWidths] = createSignal<Record<string, number>>({});
  const [resizeState, setResizeState] = createSignal<ResizeState | null>(null);
  const [scrollTop, setScrollTop] = createSignal(0);
  const [draggingColumnKey, setDraggingColumnKey] = createSignal<string | null>(null);
  const [dragOverColumnKey, setDragOverColumnKey] = createSignal<string | null>(null);
  const [columnMenuOpen, setColumnMenuOpen] = createSignal(false);
  const [hydratedPersistence, setHydratedPersistence] = createSignal(false);
  const [persistenceSaveReady, setPersistenceSaveReady] = createSignal(false);
  const [hasPersistedLayout, setHasPersistedLayout] = createSignal(false);
  let columnMenuWrapRef: HTMLDivElement | undefined;
  let importFileInputRef: HTMLInputElement | undefined;

  const sortKey = () => props.sortKey ?? internalSortKey();
  const sortDirection = () => props.sortDirection ?? internalSortDirection();
  const filterQuery = () => props.filterQuery ?? internalFilterQuery();
  const selectedRowIds = () => props.selectedRowIds ?? internalSelectedRowIds();
  const currentColumnOrder = () => props.columnOrder ?? internalColumnOrder();
  const currentColumnVisibility = () => props.columnVisibility ?? internalColumnVisibility();
  const currentColumnPinning = () => props.columnPinning ?? internalColumnPinning();

  const rowHeight = () => props.rowHeight ?? 40;
  const headerHeight = () => props.headerHeight ?? 44;
  const viewportHeight = () => props.height ?? 420;
  const overscan = () => props.overscan ?? 6;
  const selectable = () => props.selectable ?? false;
  const reorderable = () => props.reorderable ?? true;
  const showToolbar = () => props.showToolbar ?? true;
  const persistenceStorageKey = () => (props.persistenceKey ? `velvetui.datagridpro.${props.persistenceKey}` : '');

  createEffect(() => {
    setColumnWidths((prev) => {
      const next: Record<string, number> = {};
      for (const column of props.columns) {
        next[column.key] = prev[column.key] ?? parseWidth(column.width);
      }
      return next;
    });
  });

  createEffect(() => {
    const keys = props.columns.map((column) => column.key);
    const defaultOrder = props.defaultColumnOrder ?? keys;
    setInternalColumnOrder((prev) => {
      const fromPrev = prev.filter((key) => keys.includes(key));
      const missing = keys.filter((key) => !fromPrev.includes(key));
      return prev.length === 0 ? defaultOrder : [...fromPrev, ...missing];
    });
  });

  createEffect(() => {
    const keys = props.columns.map((column) => column.key);
    setInternalColumnVisibility((prev) => {
      const next: Record<string, boolean> = {};
      for (const key of keys) {
        next[key] = prev[key] ?? props.defaultColumnVisibility?.[key] ?? true;
      }
      return next;
    });
  });

  createEffect(() => {
    const keys = props.columns.map((column) => column.key);
    const byKey = new Map(props.columns.map((column) => [column.key, column]));
    setInternalColumnPinning((prev) => {
      const next: DataGridProColumnPinning = {};
      for (const key of keys) {
        next[key] = prev[key] ?? props.defaultColumnPinning?.[key] ?? byKey.get(key)?.pinned ?? null;
      }
      return next;
    });
  });

  const getRowId = (row: T, index: number): string => {
    if (props.getRowId) return props.getRowId(row, index);
    return String(index);
  };

  const getColumnByKey = (key: string) => props.columns.find((column) => column.key === key);
  const keyOrderDefault = () => props.defaultColumnOrder ?? props.columns.map((column) => column.key);
  const visibilityDefault = () => {
    const next: Record<string, boolean> = {};
    for (const column of props.columns) {
      const key = column.key;
      next[key] = props.defaultColumnVisibility?.[key] ?? true;
    }
    return next;
  };
  const pinningDefault = () => {
    const next: DataGridProColumnPinning = {};
    for (const column of props.columns) {
      const key = column.key;
      next[key] = props.defaultColumnPinning?.[key] ?? column.pinned ?? null;
    }
    return next;
  };

  const isColumnSortable = (column: DataGridProColumn<T>) => {
    if (column.sortable !== undefined) return column.sortable;
    return props.sortable ?? true;
  };

  const setSortState = (state: DataGridProSortState) => {
    setInternalSortKey(state.key);
    setInternalSortDirection(state.direction);
    props.onSortChange?.(state);
  };

  const setColumnOrder = (nextOrder: string[]) => {
    setInternalColumnOrder(nextOrder);
    props.onColumnOrderChange?.(nextOrder);
  };

  const setColumnVisibility = (nextVisibility: Record<string, boolean>) => {
    setInternalColumnVisibility(nextVisibility);
    props.onColumnVisibilityChange?.(nextVisibility);
  };

  const setColumnPinning = (nextPinning: DataGridProColumnPinning) => {
    setInternalColumnPinning(nextPinning);
    props.onColumnPinningChange?.(nextPinning);
  };

  const loadPersistedState = () => {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
    const storageKey = persistenceStorageKey();
    if (!storageKey) return;

    const serialized = window.localStorage.getItem(storageKey);
    if (!serialized) {
      setHasPersistedLayout(false);
      return;
    }

    try {
      const parsed = JSON.parse(serialized) as PersistedGridState;
      if (applyGridState(parsed)) {
        setHasPersistedLayout(true);
        return;
      }
      setHasPersistedLayout(false);
    } catch {
      setHasPersistedLayout(false);
      // Ignore malformed persistence payloads.
    }
  };

  const applyGridState = (state: PersistedGridState): boolean => {
    if (state.v !== DATA_GRID_PERSISTENCE_VERSION) return false;

    if (props.filterQuery == null && typeof state.filterQuery === 'string') {
      setInternalFilterQuery(state.filterQuery);
      props.onFilterQueryChange?.(state.filterQuery);
    }

    if (!props.sortKey) {
      setInternalSortKey(state.sortKey ?? null);
    }

    if (!props.sortDirection && state.sortDirection) {
      setInternalSortDirection(state.sortDirection);
    }

    if (!props.sortKey || !props.sortDirection) {
      props.onSortChange?.({
        key: props.sortKey ?? state.sortKey ?? null,
        direction: props.sortDirection ?? state.sortDirection ?? 'asc',
      });
    }

    if (!props.columnOrder && Array.isArray(state.columnOrder)) {
      setInternalColumnOrder(state.columnOrder);
      props.onColumnOrderChange?.(state.columnOrder);
    }

    if (!props.columnVisibility && state.columnVisibility && typeof state.columnVisibility === 'object') {
      setInternalColumnVisibility(state.columnVisibility);
      props.onColumnVisibilityChange?.(state.columnVisibility);
    }

    if (!props.columnPinning && state.columnPinning && typeof state.columnPinning === 'object') {
      setInternalColumnPinning(state.columnPinning);
      props.onColumnPinningChange?.(state.columnPinning);
    }

    if (state.columnWidths && typeof state.columnWidths === 'object') {
      setColumnWidths((prev) => ({ ...prev, ...state.columnWidths }));
    }

    return true;
  };

  const getGridStatePayload = (): PersistedGridState => ({
    v: DATA_GRID_PERSISTENCE_VERSION,
    filterQuery: filterQuery(),
    sortKey: sortKey(),
    sortDirection: sortDirection(),
    columnOrder: currentColumnOrder(),
    columnVisibility: currentColumnVisibility(),
    columnPinning: currentColumnPinning(),
    columnWidths: columnWidths(),
  });

  const savePersistedState = () => {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
    const storageKey = persistenceStorageKey();
    if (!storageKey) return;

    const payload = getGridStatePayload();

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
      setHasPersistedLayout(true);
    } catch {
      // Ignore quota/storage errors and continue with in-memory state.
    }
  };

  const handleSort = (column: DataGridProColumn<T>) => {
    if (!isColumnSortable(column)) return;
    if (sortKey() === column.key) {
      const nextDirection: SortDirection = sortDirection() === 'asc' ? 'desc' : 'asc';
      setSortState({ key: column.key, direction: nextDirection });
      return;
    }
    setSortState({ key: column.key, direction: 'asc' });
  };

  const filteredData = createMemo(() => {
    if (props.manualFiltering) return props.data;
    const query = filterQuery().trim().toLowerCase();
    if (!query) return props.data;

    if (props.filterFn) {
      return props.data.filter((row) => props.filterFn?.(row, query) ?? false);
    }

    return props.data.filter((row) =>
      props.columns.some((column) => {
        if (column.filterFn) return column.filterFn(row, query);
        const raw = column.filterAccessor ? column.filterAccessor(row) : row[column.key];
        return String(raw ?? '')
          .toLowerCase()
          .includes(query);
      })
    );
  });

  const sortedData = createMemo(() => {
    if (props.manualSorting) return filteredData();
    const key = sortKey();
    const rows = [...filteredData()];
    if (!key) return rows;
    const direction = sortDirection();
    const column = getColumnByKey(key);
    if (!column) return rows;

    if (column.sortFn) {
      return rows.sort((a, b) => column.sortFn?.(a, b, direction) ?? 0);
    }

    const getValue = (row: T) =>
      column.sortAccessor
        ? column.sortAccessor(row)
        : (row[key] as string | number | boolean | Date | null | undefined);

    return rows.sort((a, b) => {
      const aVal = getValue(a);
      const bVal = getValue(b);
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  const bodyHeight = createMemo(() => Math.max(0, viewportHeight() - headerHeight()));
  const totalRowsHeight = createMemo(() => sortedData().length * rowHeight());
  const visibleCount = createMemo(() => Math.ceil(bodyHeight() / rowHeight()) + overscan() * 2);
  const startIndex = createMemo(() => {
    const relativeTop = Math.max(0, scrollTop() - headerHeight());
    return Math.max(0, Math.floor(relativeTop / rowHeight()) - overscan());
  });
  const endIndex = createMemo(() => Math.min(sortedData().length, startIndex() + visibleCount()));
  const offsetY = createMemo(() => startIndex() * rowHeight());
  const visibleRows = createMemo(() =>
    sortedData()
      .slice(startIndex(), endIndex())
      .map((row, offset) => ({
        row,
        index: startIndex() + offset,
        id: getRowId(row, startIndex() + offset),
      }))
  );

  const orderedColumns = createMemo(() => {
    const byKey = new Map(props.columns.map((column) => [column.key, column]));
    const order = currentColumnOrder();
    const normalizedOrder = [
      ...order.filter((key) => byKey.has(key)),
      ...Array.from(byKey.keys()).filter((key) => !order.includes(key)),
    ];
    return normalizedOrder.map((key) => byKey.get(key)).filter(Boolean) as DataGridProColumn<T>[];
  });

  const visibleColumns = createMemo(() =>
    orderedColumns().filter((column) => currentColumnVisibility()[column.key] !== false)
  );

  const getColumnPin = (column: DataGridProColumn<T>): DataGridProColumnPin => {
    const pin = currentColumnPinning()[column.key];
    if (pin === 'left' || pin === 'right') return pin;
    if (pin === null) return null;
    return column.pinned ?? null;
  };

  const pinnedLeftColumns = createMemo(() => visibleColumns().filter((column) => getColumnPin(column) === 'left'));
  const pinnedRightColumns = createMemo(() => visibleColumns().filter((column) => getColumnPin(column) === 'right'));
  const pinnedLeftOffsets = createMemo(() => {
    const offsets: Record<string, number> = {};
    let offset = selectable() ? SELECTION_COLUMN_WIDTH : 0;
    for (const column of pinnedLeftColumns()) {
      offsets[column.key] = offset;
      offset += columnWidths()[column.key] ?? DEFAULT_COLUMN_WIDTH;
    }
    return offsets;
  });
  const pinnedRightOffsets = createMemo(() => {
    const offsets: Record<string, number> = {};
    let offset = 0;
    for (const column of [...pinnedRightColumns()].reverse()) {
      offsets[column.key] = offset;
      offset += columnWidths()[column.key] ?? DEFAULT_COLUMN_WIDTH;
    }
    return offsets;
  });

  const getColumnStyle = (column: DataGridProColumn<T>): JSX.CSSProperties => {
    const width = `${columnWidths()[column.key] ?? DEFAULT_COLUMN_WIDTH}px`;
    const pin = getColumnPin(column);
    const base: JSX.CSSProperties = { width, 'min-width': width, 'max-width': width };
    if (pin === 'left') {
      return { ...base, position: 'sticky', left: `${pinnedLeftOffsets()[column.key]}px`, 'z-index': 4 };
    }
    if (pin === 'right') {
      return { ...base, position: 'sticky', right: `${pinnedRightOffsets()[column.key]}px`, 'z-index': 4 };
    }
    return base;
  };

  const handleScroll: JSX.EventHandler<HTMLDivElement, Event> = (e) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const setFilterValue = (next: string) => {
    setInternalFilterQuery(next);
    props.onFilterQueryChange?.(next);
  };

  const handleFilterInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setFilterValue(e.currentTarget.value);
  };

  const selectedSet = createMemo(() => new Set(selectedRowIds()));

  const updateSelection = (next: string[]) => {
    setInternalSelectedRowIds(next);
    props.onSelectedRowIdsChange?.(next);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedSet());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    updateSelection(Array.from(next));
  };

  const allVisibleSelected = createMemo(() => {
    const ids = sortedData().map((row, index) => getRowId(row, index));
    if (ids.length === 0) return false;
    return ids.every((id) => selectedSet().has(id));
  });

  const toggleAllVisible = () => {
    const ids = sortedData().map((row, index) => getRowId(row, index));
    const next = new Set(selectedSet());
    if (allVisibleSelected()) {
      for (const id of ids) next.delete(id);
    } else {
      for (const id of ids) next.add(id);
    }
    updateSelection(Array.from(next));
  };

  const handleResizeStart = (columnKey: string, e: MouseEvent) => {
    e.preventDefault();
    setResizeState({
      key: columnKey,
      startX: e.clientX,
      startWidth: columnWidths()[columnKey] ?? DEFAULT_COLUMN_WIDTH,
    });
  };

  const handleColumnVisibilityToggle = (key: string) => {
    const visibility = { ...currentColumnVisibility() };
    const currentlyVisible = visibleColumns().length;
    const isVisible = visibility[key] !== false;
    if (isVisible && currentlyVisible <= 1) return;
    visibility[key] = !isVisible;
    setColumnVisibility(visibility);
  };

  const resetColumns = () => {
    setColumnOrder(keyOrderDefault());
    setColumnVisibility(visibilityDefault());
    setColumnPinning(pinningDefault());
  };

  const resetView = () => {
    setFilterValue('');
    setSortState({ key: null, direction: 'asc' });
    updateSelection([]);
    resetColumns();
  };

  const resetPersistedLayout = () => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const storageKey = persistenceStorageKey();
      if (storageKey) {
        window.localStorage.removeItem(storageKey);
      }
    }
    setHasPersistedLayout(false);
    setPersistenceSaveReady(false);
    resetView();
    props.onPersistenceReset?.();
  };

  const clearSelection = () => {
    updateSelection([]);
  };

  const exportSettings = () => {
    const payload = getGridStatePayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${props.persistenceKey ?? 'datagridpro-settings'}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    importFileInputRef?.click();
  };

  const handleImportFile: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    const storageKey = persistenceStorageKey();

    void (async () => {
      try {
        const content = await file.text();
        const parsed = JSON.parse(content) as PersistedGridState;
        if (!applyGridState(parsed)) return;

        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && storageKey) {
          try {
            window.localStorage.setItem(storageKey, JSON.stringify(parsed));
            setHasPersistedLayout(true);
          } catch {
            // Ignore storage errors and keep imported in-memory state.
          }
        }
      } catch {
        // Ignore malformed imports.
      }
    })();
  };

  const handleHeaderDragStart = (key: string, e: DragEvent) => {
    if (!reorderable()) return;
    setDraggingColumnKey(key);
    e.dataTransfer?.setData('text/plain', key);
    e.dataTransfer?.setDragImage(e.currentTarget ? (e.currentTarget as Element) : new Image(), 8, 8);
  };

  const handleHeaderDragOver = (key: string, e: DragEvent) => {
    if (!reorderable()) return;
    e.preventDefault();
    setDragOverColumnKey(key);
  };

  const handleHeaderDrop = (targetKey: string, e: DragEvent) => {
    if (!reorderable()) return;
    e.preventDefault();
    const sourceKey = draggingColumnKey();
    setDraggingColumnKey(null);
    setDragOverColumnKey(null);
    if (!sourceKey || sourceKey === targetKey) return;

    const order = [...currentColumnOrder()];
    const sourceIndex = order.indexOf(sourceKey);
    const targetIndex = order.indexOf(targetKey);
    if (sourceIndex < 0 || targetIndex < 0) return;
    order.splice(sourceIndex, 1);
    order.splice(targetIndex, 0, sourceKey);
    setColumnOrder(order);
  };

  const handleHeaderDragEnd = () => {
    setDraggingColumnKey(null);
    setDragOverColumnKey(null);
  };

  useClickOutside(
    () => columnMenuWrapRef,
    columnMenuOpen,
    () => setColumnMenuOpen(false)
  );
  useEscapeKey(
    () => columnMenuOpen(),
    () => setColumnMenuOpen(false)
  );

  createEffect(() => {
    const active = resizeState();
    if (!active) return;

    const onMouseMove = (e: MouseEvent) => {
      const column = getColumnByKey(active.key);
      if (!column) return;

      const delta = e.clientX - active.startX;
      const baseWidth = active.startWidth + delta;
      const min = column.minWidth ?? 80;
      const max = column.maxWidth ?? 720;
      const nextWidth = clamp(baseWidth, min, max);

      setColumnWidths((prev) => ({
        ...prev,
        [active.key]: nextWidth,
      }));
    };

    const onMouseUp = () => {
      setResizeState(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    onCleanup(() => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    });
  });

  const gridWidth = createMemo(() => {
    const widths = columnWidths();
    return visibleColumns().reduce(
      (acc, column) => acc + (widths[column.key] ?? DEFAULT_COLUMN_WIDTH),
      selectable() ? SELECTION_COLUMN_WIDTH : 0
    );
  });

  createEffect(() => {
    if (hydratedPersistence()) return;
    loadPersistedState();
    setHydratedPersistence(true);
  });

  createEffect(() => {
    if (!hydratedPersistence()) return;
    if (!persistenceStorageKey()) return;

    filterQuery();
    sortKey();
    sortDirection();
    currentColumnOrder();
    currentColumnVisibility();
    currentColumnPinning();
    columnWidths();

    const saveReady = persistenceSaveReady();
    if (!saveReady) {
      setPersistenceSaveReady(true);
      return;
    }
    savePersistedState();
  });

  const rowClass = (index: number) => classNames(styles.row, props.striped && index % 2 === 1 && styles.striped);

  return (
    <Card class={classNames(styles.wrapper, props.class)}>
      <Show when={showToolbar()}>
        <div class={styles.toolbar}>
          <div class={styles.toolbarLeft}>
            <Show when={props.filterable}>
              <Input
                type="search"
                value={filterQuery()}
                onInput={handleFilterInput}
                placeholder={props.filterPlaceholder ?? 'Filter rows...'}
                class={styles.filterInput}
              />
            </Show>
            <span class={styles.resultsCount}>
              {sortedData().length} rows
              <Show when={selectable()}> - {selectedSet().size} selected</Show>
            </span>
            <Show when={Boolean(persistenceStorageKey())}>
              <span
                class={classNames(
                  styles.persistenceBadge,
                  hasPersistedLayout() ? styles.badgePersisted : styles.badgeDefault
                )}
              >
                {hasPersistedLayout()
                  ? (props.persistedBadgeLabel ?? 'Persisted')
                  : (props.defaultBadgeLabel ?? 'Default')}
              </span>
            </Show>
          </div>
          <div class={styles.toolbarRight}>
            <button
              type="button"
              class={styles.toolbarButton}
              onClick={clearSelection}
              disabled={selectedSet().size === 0}
            >
              Clear selection
            </button>
            <button type="button" class={styles.toolbarButton} onClick={resetView}>
              Reset view
            </button>
            <Show when={Boolean(persistenceStorageKey())}>
              <button type="button" class={styles.toolbarButton} onClick={resetPersistedLayout}>
                {props.resetPersistenceLabel ?? 'Reset saved layout'}
              </button>
            </Show>
            <button type="button" class={styles.toolbarButton} onClick={handleImportClick}>
              {props.importSettingsLabel ?? 'Import JSON'}
            </button>
            <button type="button" class={styles.toolbarButton} onClick={exportSettings}>
              {props.exportSettingsLabel ?? 'Export JSON'}
            </button>
            <input
              ref={importFileInputRef}
              type="file"
              accept="application/json"
              class={styles.hiddenInput}
              onChange={handleImportFile}
            />
            <div ref={columnMenuWrapRef} class={styles.columnMenuWrap}>
              <button
                type="button"
                class={styles.toolbarButton}
                onClick={() => setColumnMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={columnMenuOpen() ? 'true' : 'false'}
              >
                Columns
              </button>
              <Show when={columnMenuOpen()}>
                <div class={styles.columnMenu} role="menu" aria-label="Column visibility">
                  <For each={orderedColumns()}>
                    {(column) => {
                      const key = () => column.key;
                      const checked = () => currentColumnVisibility()[key()] !== false;
                      const disableUncheck = () => checked() && visibleColumns().length <= 1;

                      return (
                        <label class={styles.columnOption}>
                          <CheckboxControl
                            checked={checked()}
                            disabled={disableUncheck()}
                            onChange={() => handleColumnVisibilityToggle(key())}
                          />
                          <span>{column.header}</span>
                        </label>
                      );
                    }}
                  </For>
                  <button type="button" class={styles.toolbarButtonSmall} onClick={resetColumns}>
                    Reset columns
                  </button>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Show>
      <div class={styles.viewport} style={{ height: `${viewportHeight()}px` }} onScroll={handleScroll}>
        <div class={styles.grid} style={{ width: `${gridWidth()}px` }}>
          <div class={styles.header} style={{ height: `${headerHeight()}px` }}>
            <Show when={selectable()}>
              <div class={classNames(styles.headerCell, styles.pinnedLeft, styles.selectionHeaderCell)}>
                <CheckboxControl
                  checked={allVisibleSelected()}
                  onChange={toggleAllVisible}
                  aria-label="Select all visible rows"
                />
              </div>
            </Show>
            <For each={visibleColumns()}>
              {(column) => {
                const sortable = () => isColumnSortable(column);
                const key = () => column.key;
                const activeSort = () => sortKey() === key();

                return (
                  <div
                    role="button"
                    tabIndex={0}
                    class={classNames(
                      styles.headerCell,
                      sortable() && styles.headerSortable,
                      draggingColumnKey() === key() && styles.headerDragging,
                      dragOverColumnKey() === key() && styles.headerDragOver,
                      getColumnPin(column) === 'left' && styles.pinnedLeft,
                      getColumnPin(column) === 'right' && styles.pinnedRight
                    )}
                    style={getColumnStyle(column)}
                    onClick={() => handleSort(column)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSort(column);
                      }
                    }}
                    draggable={reorderable()}
                    onDragStart={(e) => handleHeaderDragStart(key(), e)}
                    onDragOver={(e) => handleHeaderDragOver(key(), e)}
                    onDrop={(e) => handleHeaderDrop(key(), e)}
                    onDragEnd={handleHeaderDragEnd}
                  >
                    <span class={styles.headerLabel}>{column.header}</span>
                    <Show when={sortable()}>
                      <span class={classNames(styles.sortIcon, activeSort() && styles.sortActive)}>
                        <Show when={activeSort() && sortDirection() === 'desc'} fallback={<IoCaretUp />}>
                          <IoCaretDown />
                        </Show>
                      </span>
                    </Show>
                    <button
                      type="button"
                      class={styles.resizeHandle}
                      aria-label={`Resize ${column.header}`}
                      onMouseDown={(e) => handleResizeStart(key(), e)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                );
              }}
            </For>
          </div>

          <Show
            when={sortedData().length > 0}
            fallback={
              <div class={styles.empty} style={{ height: `${bodyHeight()}px` }}>
                {props.emptyMessage ?? 'No rows to display'}
              </div>
            }
          >
            <div class={styles.body} style={{ height: `${totalRowsHeight()}px` }}>
              <div class={styles.rows} style={{ transform: `translateY(${offsetY()}px)` }}>
                <For each={visibleRows()}>
                  {(entry) => (
                    <div class={rowClass(entry.index)} style={{ height: `${rowHeight()}px` }}>
                      <Show when={selectable()}>
                        <div class={classNames(styles.cell, styles.pinnedLeft, styles.selectionCell)}>
                          <CheckboxControl
                            checked={selectedSet().has(entry.id)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => toggleRow(entry.id)}
                            aria-label={`Select row ${entry.id}`}
                          />
                        </div>
                      </Show>
                      <For each={visibleColumns()}>
                        {(column) => (
                          <div
                            class={classNames(
                              styles.cell,
                              getColumnPin(column) === 'left' && styles.pinnedLeft,
                              getColumnPin(column) === 'right' && styles.pinnedRight
                            )}
                            style={getColumnStyle(column)}
                          >
                            {column.render
                              ? column.render(entry.row[column.key], entry.row)
                              : (() => {
                                  const val = entry.row[column.key];
                                  return val == null ? '' : typeof val === 'string' ? val : String(val);
                                })()}
                          </div>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </Card>
  );
};

export { DataGridPro };
export type {
  DataGridProColumn,
  DataGridProColumnPin,
  DataGridProColumnPinning,
  DataGridProProps,
  DataGridProSortState,
};
