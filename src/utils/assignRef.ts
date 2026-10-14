import type { JSX } from 'solid-js';

export const assignRef = <T extends HTMLElement>(ref: JSX.HTMLAttributes<T>['ref'], element: T): void => {
  if (typeof ref === 'function') ref(element);
};
