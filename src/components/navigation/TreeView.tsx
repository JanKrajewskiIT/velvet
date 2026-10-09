import { For, Match, mergeProps, Switch } from 'solid-js';

import { cx } from '../../utils/cx';
import { createTreeFocus } from './createTreeFocus';
import { createTreeKeyboard } from './createTreeKeyboard';
import { createTreeModel } from './createTreeModel';
import { createTreeViewLabels } from './createTreeViewLabels';
import type { TreeController } from './treeController';
import { TreeNodeRow } from './TreeNodeRow';
import { TreeStatusRow } from './TreeStatusRow';
import type { TreeViewLabels, TreeViewProps } from './treeViewTypes';

export type { TreeViewLabels, TreeViewProps };

/**
 * Hierarchical list (files, categories, org). WAI-ARIA tree keyboard: ↑↓ move · → expand / into child · ← collapse / to parent ·
 * Home/End · Enter select · * expand siblings. With `checkable`: tri-state checkboxes (parent = all / some / none of its leaves),
 * Space or click toggles; the value is the list of checked LEAF ids.
 */
export const TreeView = (props: TreeViewProps) => {
  const p = mergeProps(
    { checkable: false, defaultExpanded: [], defaultChecked: [] } satisfies Partial<TreeViewProps>,
    props,
  );
  const model = createTreeModel(p);
  const focus = createTreeFocus(model.rows, () => model.selected() ?? p.data[0]?.id);
  const tree: TreeController = { config: p, labels: createTreeViewLabels(() => p.labels), model, focus };
  const onKeyDown = createTreeKeyboard(tree);

  return (
    <ul
      ref={focus.setRoot}
      role="tree"
      aria-label={p.label}
      aria-multiselectable={p.checkable || undefined}
      class={cx('vui-tree', p.checkable && 'vui-tree--checkable', p.class)}
      onKeyDown={onKeyDown}
    >
      <For each={model.rows()}>
        {(row) => (
          <Switch>
            <Match when={row.kind === 'status' && row}>
              {(statusRow) => <TreeStatusRow tree={tree} row={statusRow()} />}
            </Match>
            <Match when={row.kind === 'node' && row}>{(nodeRow) => <TreeNodeRow tree={tree} row={nodeRow()} />}</Match>
          </Switch>
        )}
      </For>
    </ul>
  );
};
