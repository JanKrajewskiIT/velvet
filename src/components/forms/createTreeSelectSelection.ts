import { type Accessor, createMemo, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { callbackAlias } from './callbackAlias';
import { findNode, leafIds, type TreeSelectNode } from './treeSelectRows';
import type { SelectionValue, TreeSelectModelProps } from './treeSelectTypes';

export interface TreeSelectSelection {
  selected: Accessor<ReadonlySet<string>>;
  /** Selected nodes in value order. */
  picked: Accessor<TreeSelectNode[]>;
  setValue: (next: SelectionValue) => void;
  removePicked: (id: string) => void;
  clear: () => void;
  /** Multiple mode: selects every leaf of the node, or deselects them when all are already selected. */
  toggleLeaves: (node: TreeSelectNode) => void;
}

export const createTreeSelectSelection = (props: TreeSelectModelProps): TreeSelectSelection => {
  const [value, setValue] = createControllable<SelectionValue>({
    value: () => props.value,
    defaultValue: untrack(() => props.defaultValue ?? (props.multiple ? [] : null)),
    onChange: callbackAlias(
      () => props.onValueChange,
      () => props.onChange,
    ),
  });
  const selected = createMemo((): ReadonlySet<string> => {
    const v = value();
    if (Array.isArray(v)) return new Set(v);
    return new Set(v == null ? [] : [v]);
  });
  const selectedIds = () => [...selected()];
  const picked = createMemo(() => selectedIds().flatMap((id) => findNode(props.data, id) ?? []));

  const removePicked = (id: string) => setValue(selectedIds().filter((x) => x !== id));
  const clear = () => setValue([]);
  const toggleLeaves = (node: TreeSelectNode) => {
    const leaves = leafIds(node);
    const all = leaves.every((id) => selected().has(id));
    const next = new Set(selected());
    leaves.forEach((id) => (all ? next.delete(id) : next.add(id)));
    setValue([...next]);
  };

  return { selected, picked, setValue, removePicked, clear, toggleLeaves };
};
