import type { JSX } from '@solidjs/web';

export type ClassValue = JSX.ClassValue;

const appendClass = (classes: string[], value: ClassValue): void => {
  if (Array.isArray(value)) {
    for (const item of value) appendClass(classes, item);
  } else if (typeof value === 'string' || typeof value === 'number') {
    if (value !== '') classes.push(String(value));
  } else if (value && typeof value === 'object') {
    for (const [name, enabled] of Object.entries(value)) {
      if (enabled) classes.push(name);
    }
  }
};

export const cx = (...values: ClassValue[]): string => {
  const classes: string[] = [];
  for (const value of values) appendClass(classes, value);
  return classes.join(' ');
};
