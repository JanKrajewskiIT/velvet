import { Show } from 'solid-js';

import type { ContextItem } from './contextSwitcherTypes';

interface ContextSwitcherLabelProps {
  item: ContextItem;
}

export const ContextSwitcherLabel = (props: ContextSwitcherLabelProps) => (
  <Show when={props.item.label} keyed fallback={props.item.id}>
    {(label) => (typeof label === 'function' ? label() : label)}
  </Show>
);
