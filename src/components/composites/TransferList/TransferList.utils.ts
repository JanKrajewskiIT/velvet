import type { TransferItem } from './TransferList';

export const normalizeTransferQuery = (query: string) => query.trim().toLowerCase();

export const filterTransferItems = (items: readonly TransferItem[], query: string): TransferItem[] => {
  const normalized = normalizeTransferQuery(query);
  if (!normalized) return [...items];
  return items.filter((item) => item.label.toLowerCase().includes(normalized));
};

export const toggleTransferSelection = (checked: ReadonlySet<string>, id: string): Set<string> => {
  const next = new Set(checked);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
};

export const pruneTransferSelection = (checked: ReadonlySet<string>, items: readonly TransferItem[]): Set<string> => {
  const availableIds = new Set(items.map((item) => item.id));
  return new Set(Array.from(checked).filter((id) => availableIds.has(id)));
};

export const moveSelectedTransferItems = (
  sourceItems: readonly TransferItem[],
  targetItems: readonly TransferItem[],
  checkedIds: ReadonlySet<string>,
): { source: TransferItem[]; target: TransferItem[] } => {
  const moving = sourceItems.filter((item) => checkedIds.has(item.id));
  const remaining = sourceItems.filter((item) => !checkedIds.has(item.id));
  return {
    source: remaining,
    target: [...targetItems, ...moving],
  };
};

export const moveAllTransferItems = (
  sourceItems: readonly TransferItem[],
  targetItems: readonly TransferItem[],
): { source: TransferItem[]; target: TransferItem[] } => ({
  source: [],
  target: [...targetItems, ...sourceItems],
});
