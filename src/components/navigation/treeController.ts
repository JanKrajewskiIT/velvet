import type { Accessor } from 'solid-js';

import type { TreeFocus } from './createTreeFocus';
import type { TreeModel } from './createTreeModel';
import type { TreeMove } from './createTreeMove';
import type { ResolvedTreeViewLabels } from './createTreeViewLabels';
import type { TreeViewConfig } from './treeViewTypes';

/** Everything the TreeView parts share: resolved props plus the state owned by the tree hooks. */
export interface TreeController {
  config: TreeViewConfig;
  labels: Accessor<ResolvedTreeViewLabels>;
  model: TreeModel;
  focus: TreeFocus;
  move: TreeMove;
}
