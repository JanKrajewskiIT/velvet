import { createSignal } from 'solid-js';

import type { RowKey } from './rowData';

export interface TableExpansion {
  isOpen: (key: RowKey) => boolean;
  toggleExpanded: (key: RowKey) => void;
}

export const createTableExpansion = (): TableExpansion => {
  const [expanded, setExpanded] = createSignal<RowKey[]>([]);
  const isOpen = (key: RowKey) => expanded().includes(key);
  const toggleExpanded = (key: RowKey) =>
    setExpanded((x) => (x.includes(key) ? x.filter((y) => y !== key) : [...x, key]));
  return { isOpen, toggleExpanded };
};
