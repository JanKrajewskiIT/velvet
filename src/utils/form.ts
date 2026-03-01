export function orEmpty<T extends string>(value: T | null | undefined): T | '' {
  return value ?? '';
}

export function numberToString(value: number | null | undefined): string {
  return value?.toString() ?? '';
}

export function emptyToNull<T extends string>(value: T | ''): T | null {
  return value || null;
}

export function parseFloatOrNull(value: string): number | null {
  return value ? parseFloat(value) : null;
}
