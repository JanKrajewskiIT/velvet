import type { JSX } from 'solid-js';

import type { ContextItem, ContextSwitcherProps, ContextTemplate } from './contextSwitcherTypes';

export interface ContextConfirmation {
  next: ContextItem;
  current: ContextItem;
  action: ContextSwitcherProps['onValueChange'];
}

export const sameContext = (item: ContextItem | undefined, snapshot: ContextItem): boolean =>
  !!item &&
  item.id === snapshot.id &&
  item.label === snapshot.label &&
  item.description === snapshot.description &&
  item.icon === snapshot.icon &&
  item.tone === snapshot.tone;

export function resolveContextTemplate(value: ContextTemplate<string>, pair: ContextConfirmation): string;
export function resolveContextTemplate(value: ContextTemplate<JSX.Element>, pair: ContextConfirmation): JSX.Element;
export function resolveContextTemplate(value: ContextTemplate<JSX.Element>, pair: ContextConfirmation): JSX.Element {
  return typeof value === 'function' ? value(pair.next, pair.current) : value;
}
