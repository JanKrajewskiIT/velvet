export const tabIds = (tabsId: string, value: string): { tab: string; panel: string } => {
  const key = encodeURIComponent(value);
  return { tab: `${tabsId}-tab-${key}`, panel: `${tabsId}-panel-${key}` };
};
