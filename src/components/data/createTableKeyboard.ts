import type { Accessor } from 'solid-js';

import type { TableExpansion } from './createTableExpansion';
import type { TableSelection } from './createTableSelection';
import type { RowKey } from './rowData';

export interface TableKeyboardOptions {
  body: () => HTMLElement;
  selectable: Accessor<boolean>;
  hasExpander: Accessor<boolean>;
  selection: TableSelection;
  expansion: TableExpansion;
}

export const createTableKeyboard = (options: TableKeyboardOptions) => {
  const { selection, expansion } = options;
  return (e: KeyboardEvent & { currentTarget: HTMLTableRowElement }, key: RowKey) => {
    if (e.target !== e.currentTarget) return;
    const rows = [...options.body().querySelectorAll<HTMLElement>('tr[tabindex]')];
    const i = rows.indexOf(e.currentTarget);
    const moveFocus = (target: HTMLElement | undefined) => {
      if (!target) return false;
      e.preventDefault();
      target.focus();
      return true;
    };
    if (e.key === 'ArrowDown' && moveFocus(rows[i + 1])) return;
    if (e.key === 'ArrowUp' && moveFocus(rows[i - 1])) return;
    if (options.hasExpander() && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault();
      if ((e.key === 'ArrowRight') !== expansion.isOpen(key)) expansion.toggleExpanded(key);
    } else if (options.selectable() && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      selection.toggle(key);
    } else if (options.selectable() && e.key === 'a' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      selection.set(selection.allKeys());
    } else if (options.selectable() && e.key === 'Escape') {
      selection.clear();
    }
  };
};
