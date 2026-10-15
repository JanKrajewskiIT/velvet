export const variantClass = (
  variants: Readonly<Record<string, string | undefined>>,
  value: string | undefined,
  fallback?: string,
): string | undefined => (value && value !== fallback ? variants[value] : undefined);

export const classSelector = (value: string | undefined): string => {
  // A composed alias belongs to its importer; the final class identifies the shared owner.
  const name = value?.trim().split(/\s+/u).at(-1);
  return name ? '.' + name : ':not(*)';
};
