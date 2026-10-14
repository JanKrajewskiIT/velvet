import type { RowKey } from '../components/data/rowData';

export const toggleKey = (selected: readonly RowKey[], key: RowKey): RowKey[] =>
  selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key];

export const toggleKeyScope = (selected: readonly RowKey[], scope: readonly RowKey[]): RowKey[] => {
  const current = new Set(selected);
  const remove = scope.length > 0 && scope.every((key) => current.has(key));
  scope.forEach((key) => {
    if (remove) current.delete(key);
    else current.add(key);
  });
  return [...current];
};
