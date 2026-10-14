/** Retains an available key, otherwise chooses the first available item. */
export const activeItemKey = <T, K>(
  items: readonly T[],
  current: K | undefined,
  keyOf: (item: T) => K,
  available: (item: T) => boolean,
): K | undefined => {
  const retained = items.find((item) => keyOf(item) === current && available(item));
  const item = retained ?? items.find(available);
  return item === undefined ? undefined : keyOf(item);
};
