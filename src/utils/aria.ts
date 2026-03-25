export function joinAriaIds(...ids: Array<string | null | undefined | false>): string | undefined {
  const merged = ids.filter((id): id is string => Boolean(id && id.trim()));
  return merged.length > 0 ? merged.join(' ') : undefined;
}

export function resolveAriaInvalid(
  invalid?: boolean,
  explicit?: boolean | 'true' | 'false'
): boolean | 'true' | 'false' | undefined {
  if (explicit !== undefined) return explicit;
  return invalid ? true : undefined;
}

export function resolveAriaErrorMessage(
  describedBy: string | undefined,
  explicit?: string,
  fallback?: string
): string | undefined {
  if (explicit) return explicit;
  if (fallback && describedBy) return fallback;
  return undefined;
}
