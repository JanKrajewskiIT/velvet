import { type Accessor, createMemo, createSignal } from 'solid-js';

export interface SelectionStore {
  selectedId: Accessor<string | null>;
  filter: Accessor<string>;
  sortBy: Accessor<string | null>;
  hasSelection: Accessor<boolean>;
  setSelectedId: (id: string | null) => void;
  setFilter: (value: string) => void;
  setSortBy: (value: string | null) => void;
  clear: () => void;
}

export interface CreateSelectionStoreOptions {
  initialSelectedId?: string | null;
  initialFilter?: string;
  initialSortBy?: string | null;
}

export function createSelectionStore(options: CreateSelectionStoreOptions = {}): SelectionStore {
  const [selectedId, setSelectedId] = createSignal<string | null>(options.initialSelectedId ?? null);
  const [filter, setFilter] = createSignal(options.initialFilter ?? '');
  const [sortBy, setSortBy] = createSignal<string | null>(options.initialSortBy ?? null);

  const hasSelection = createMemo(() => selectedId() !== null);

  const clear = () => {
    setSelectedId(null);
    setFilter('');
    setSortBy(null);
  };

  return {
    selectedId,
    filter,
    sortBy,
    hasSelection,
    setSelectedId,
    setFilter,
    setSortBy,
    clear,
  };
}
