import { createUniqueId, For, Match, mergeProps, Switch } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { createTreeFocus } from './createTreeFocus';
import { createTreeKeyboard } from './createTreeKeyboard';
import { createTreeModel } from './createTreeModel';
import { createTreeMove } from './createTreeMove';
import { createTreeViewLabels } from './createTreeViewLabels';
import type { TreeController } from './treeController';
import { TreeNodeRow } from './TreeNodeRow';
import { TreeStatusRow } from './TreeStatusRow';
import type { TreeViewLabels, TreeViewMoveLabels, TreeViewProps } from './treeViewTypes';

export type { TreeViewLabels, TreeViewMoveLabels, TreeViewProps };

/**
 * Hierarchical list (files, categories, org). WAI-ARIA tree keyboard: ↑↓ move · → expand / into child · ← collapse / to parent ·
 * Home/End · Enter select · * expand siblings. With `checkable`: tri-state checkboxes (parent = all / some / none of its leaves),
 * Space or click toggles; the value is the list of checked LEAF ids. With `draggable` and `onMove`, nodes can be dropped as
 * children of other nodes; keyboard users press Space (Ctrl+Space when checkable), navigate to a parent, then press Enter.
 * With onMovePosition, edge drops reorder siblings, folder centers accept children, and Alt+arrows reorder or change parents.
 */
export const TreeView = (props: TreeViewProps) => {
  const p = mergeProps(
    { checkable: false, defaultExpanded: [], defaultChecked: [] } satisfies Partial<TreeViewProps>,
    props,
  );
  const model = createTreeModel(p);
  const translate = useTranslate();
  const focus = createTreeFocus(model.rows, () => model.selected() ?? p.data[0]?.id);
  const labels = createTreeViewLabels(() => p.labels);
  const move = createTreeMove(p, labels, model, focus);
  const tree: TreeController = { config: p, labels, model, focus, move };
  const onKeyDown = createTreeKeyboard(tree);

  const instructionsId = `vui-tree-instructions-${createUniqueId()}`;

  return (
    <>
      <span class="vui-sr-only" id={instructionsId}>
        {p.onMovePosition && !p.labels?.moveInstructions
          ? translate('velvet.navigation.treeView.positionInstructions')
          : labels().moveInstructions}
      </span>
      <span class="vui-sr-only" aria-live="polite">
        {move.announcement()}
      </span>
      <ul
        ref={focus.setRoot}
        role="tree"
        aria-label={p.label}
        aria-describedby={move.enabled() ? instructionsId : undefined}
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
              <Match when={row.kind === 'node' && row}>
                {(nodeRow) => <TreeNodeRow tree={tree} row={nodeRow()} />}
              </Match>
            </Switch>
          )}
        </For>
      </ul>
    </>
  );
};
