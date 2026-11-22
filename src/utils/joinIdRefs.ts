export const joinIdRefs = (...values: (string | false | undefined)[]): string | undefined => {
  const ids = values.flatMap((value) => (value ? value.trim().split(/\s+/u).filter(Boolean) : []));
  return [...new Set(ids)].join(' ') || undefined;
};
