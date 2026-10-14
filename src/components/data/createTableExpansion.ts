import { type Accessor, createEffect, createSignal, on } from 'solid-js';

import type { RowKey } from './rowData';

export interface TableExpansion {
  isOpen: (key: RowKey) => boolean;
  toggleExpanded: (key: RowKey) => void;
}

export const createTableExpansion = (
  keys?: Accessor<readonly RowKey[]>,
  dataKey?: Accessor<string | number | undefined>,
): TableExpansion => {
  const [expanded, setExpanded] = createSignal<RowKey[]>([]);
  if (keys)
    createEffect(() => {
      const available = new Set(keys());
      setExpanded((current) => current.filter((key) => available.has(key)));
    });
  if (dataKey) createEffect(on(dataKey, () => setExpanded([]), { defer: true }));
  const isOpen = (key: RowKey) => expanded().includes(key);
  const toggleExpanded = (key: RowKey) =>
    setExpanded((x) => (x.includes(key) ? x.filter((y) => y !== key) : [...x, key]));
  return { isOpen, toggleExpanded };
};
