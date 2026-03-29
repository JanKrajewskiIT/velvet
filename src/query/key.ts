import type { QueryKey, QueryKeyPart } from '~/query/types';

function normalizeQueryKeyPart(part: QueryKeyPart): unknown {
  if (part === undefined) {
    return '__undefined__';
  }

  if (part === null || typeof part === 'string' || typeof part === 'number' || typeof part === 'boolean') {
    return part;
  }

  if (Array.isArray(part)) {
    return part.map((entry) => normalizeUnknown(entry));
  }

  if (typeof part === 'object') {
    const entries = Object.entries(part as Record<string, unknown>).sort(([left], [right]) =>
      left.localeCompare(right)
    );
    const normalizedObject: Record<string, unknown> = {};
    entries.forEach(([key, value]) => {
      normalizedObject[key] = normalizeUnknown(value);
    });
    return normalizedObject;
  }

  return Object.prototype.toString.call(part);
}

function normalizeUnknown(value: unknown): unknown {
  if (value === undefined) {
    return '__undefined__';
  }

  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeUnknown(entry));
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) =>
      left.localeCompare(right)
    );
    const normalizedObject: Record<string, unknown> = {};
    entries.forEach(([key, entry]) => {
      normalizedObject[key] = normalizeUnknown(entry);
    });
    return normalizedObject;
  }

  return Object.prototype.toString.call(value);
}

export function normalizeQueryKey(key: QueryKey): unknown[] {
  return key.map((part) => normalizeQueryKeyPart(part));
}

export function hashQueryKey(key: QueryKey): string {
  return JSON.stringify(normalizeQueryKey(key));
}

export function matchesPartialKey(full: QueryKey, partial: QueryKey): boolean {
  if (partial.length > full.length) {
    return false;
  }

  const normalizedFull = normalizeQueryKey(full);
  const normalizedPartial = normalizeQueryKey(partial);

  for (let index = 0; index < normalizedPartial.length; index += 1) {
    if (JSON.stringify(normalizedFull[index]) !== JSON.stringify(normalizedPartial[index])) {
      return false;
    }
  }

  return true;
}
