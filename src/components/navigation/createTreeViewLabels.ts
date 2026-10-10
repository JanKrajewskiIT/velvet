import type { Accessor } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import type { TreeViewLabels, TreeViewMoveLabels } from './treeViewTypes';

export type ResolvedTreeViewLabels = TreeViewLabels & TreeViewMoveLabels;

export const createTreeViewLabels = (
  overrides: Accessor<Partial<TreeViewLabels & TreeViewMoveLabels> | undefined>,
): Accessor<ResolvedTreeViewLabels> => {
  const translate = useTranslate();
  return () => ({
    loading: overrides()?.loading ?? translate('velvet.navigation.treeView.loading'),
    loadFailed: overrides()?.loadFailed ?? translate('velvet.navigation.treeView.loadFailed'),
    retry: overrides()?.retry ?? translate('velvet.common.retry'),
    moveInstructions: overrides()?.moveInstructions ?? translate('velvet.navigation.treeView.moveInstructions'),
    moveStarted: overrides()?.moveStarted ?? translate('velvet.navigation.treeView.moveStarted'),
    moveCompleted: overrides()?.moveCompleted ?? translate('velvet.navigation.treeView.moveCompleted'),
    moveCancelled: overrides()?.moveCancelled ?? translate('velvet.navigation.treeView.moveCancelled'),
    invalidMove: overrides()?.invalidMove ?? translate('velvet.navigation.treeView.invalidMove'),
  });
};
