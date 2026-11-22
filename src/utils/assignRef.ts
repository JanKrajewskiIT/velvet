import { type JSX } from '@solidjs/web';

export const assignRef = <T extends HTMLElement>(ref: JSX.HTMLAttributes<T>['ref'], element: T): void => {
  if (Array.isArray(ref)) {
    for (const entry of ref) assignRef(entry, element);
  } else if (typeof ref === 'function') ref(element);
};
