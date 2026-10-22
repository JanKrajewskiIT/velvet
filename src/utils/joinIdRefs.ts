export const joinIdRefs = (...values: (string | undefined)[]): string | undefined => {
  const ids = values.flatMap((value) => value?.trim().split(/\s+/u).filter(Boolean) ?? []);
  return [...new Set(ids)].join(' ') || undefined;
};
