import { type Accessor, batch, createMemo, createSignal } from 'solid-js';

import { type TreeRow, type TreeSelectNode, visibleRows } from './treeSelectRows';

export interface TreeSelectView {
  query: Accessor<string>;
  /** Trimmed, lower-cased query; empty while not searching. */
  needle: () => string;
  /** Index of the virtual active row. */
  active: Accessor<number>;
  setActive: (index: number) => void;
  rows: Accessor<TreeRow[]>;
  activeRow: () => TreeRow | undefined;
  /** Searching forces every branch open. */
  isExpanded: (id: string) => boolean;
  toggleExpanded: (id: string, force?: boolean) => void;
  search: (text: string) => void;
  reset: () => void;
}

/** Expansion, search query and the virtual active row over the visible rows. */
export const createTreeSelectView = (
  data: Accessor<TreeSelectNode[]>,
  defaultExpanded: Iterable<string> | undefined,
): TreeSelectView => {
  const [expanded, setExpanded] = createSignal<ReadonlySet<string>>(new Set(defaultExpanded));
  const [query, setQuery] = createSignal('');
  const [active, setActive] = createSignal(0);
  const needle = () => query().trim().toLowerCase();
  const rows = createMemo(() => visibleRows(data(), expanded(), needle()));
  const activeRow = () => rows()[active()];
  const isExpanded = (id: string) => !!needle() || expanded().has(id);

  const setActiveIndex = (index: number) => setActive(index);
  const toggleExpanded = (id: string, force?: boolean) => {
    const next = new Set(expanded());
    if (force ?? !next.has(id)) next.add(id);
    else next.delete(id);
    setExpanded(next);
  };
  const search = (text: string) => {
    setQuery(text);
    setActive(0);
  };
  const reset = () =>
    batch(() => {
      setQuery('');
      setActive(0);
    });

  return {
    query,
    needle,
    active,
    setActive: setActiveIndex,
    rows,
    activeRow,
    isExpanded,
    toggleExpanded,
    search,
    reset,
  };
};
