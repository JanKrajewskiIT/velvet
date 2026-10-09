import type { Accessor } from 'solid-js';

import type { TreeFocus } from './createTreeFocus';
import type { TreeModel } from './createTreeModel';
import type { TreeViewConfig, TreeViewLabels } from './treeViewTypes';

/** Everything the TreeView parts share: resolved props plus the state owned by the tree hooks. */
export interface TreeController {
  config: TreeViewConfig;
  labels: Accessor<TreeViewLabels>;
  model: TreeModel;
  focus: TreeFocus;
}
