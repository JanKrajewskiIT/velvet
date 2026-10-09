import type { Accessor } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import type { TreeViewLabels } from './treeViewTypes';

export const createTreeViewLabels = (
  overrides: Accessor<Partial<TreeViewLabels> | undefined>,
): Accessor<TreeViewLabels> => {
  const translate = useTranslate();
  return () => ({
    loading: overrides()?.loading ?? translate('velvet.navigation.treeView.loading'),
    loadFailed: overrides()?.loadFailed ?? translate('velvet.navigation.treeView.loadFailed'),
    retry: overrides()?.retry ?? translate('velvet.common.retry'),
  });
};
