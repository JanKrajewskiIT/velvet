import { splitProps } from 'solid-js';

import type { HtmlProps } from '../../utils/polymorphic';
import { tabIds } from './tabIds';

export interface TabPanelProps extends HtmlProps<HTMLDivElement> {
  tabsId: string;
  value: string;
  activeValue: string | undefined;
  /** Overrides the matching tab's ID when TabItem.id is supplied. */
  tabId?: string;
}

export const TabPanel = (props: TabPanelProps) => {
  const [local, rest] = splitProps(props, ['tabsId', 'value', 'activeValue', 'tabId', 'id', 'tabIndex']);
  const ids = () => tabIds(local.tabsId, local.value);
  return (
    <div
      {...rest}
      id={local.id ?? ids().panel}
      role="tabpanel"
      aria-labelledby={local.tabId ?? ids().tab}
      hidden={local.value !== local.activeValue}
      tabIndex={local.tabIndex ?? 0}
    />
  );
};
