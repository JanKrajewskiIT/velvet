import { type Accessor, createEffect, createMemo, createSignal } from 'solid-js';

import type { ComboboxOptions } from './createComboboxOptions';
import type { MultiSelectProps } from './multiSelectTypes';
import type { SelectOption } from './selectOption';

export interface MultiSelectEntry extends SelectOption {
  create?: boolean;
}

export const createMultiSelectEntries = (
  props: MultiSelectProps,
  options: ComboboxOptions,
  selected: Accessor<readonly string[]>,
  query: Accessor<string>,
) => {
  const [pickedLabels, setPickedLabels] = createSignal<ReadonlyMap<string, string>>(new Map());
  createEffect(() => {
    const keys = new Set(selected());
    const known = [...options.local(), ...options.remote.items()].filter((option) => keys.has(option.value));
    setPickedLabels((previous) => {
      const next = new Map([...previous].filter(([key]) => keys.has(key)));
      for (const option of known) next.set(option.value, option.label);
      return next.size === previous.size && [...next].every(([key, label]) => previous.get(key) === label)
        ? previous
        : next;
    });
  });
  const isFull = () => props.max != null && selected().length >= props.max;
  const labelOf = (value: string) =>
    pickedLabels().get(value) ??
    options.local().find((option) => option.value === value)?.label ??
    options.remote.items().find((option) => option.value === value)?.label ??
    value;
  const available = createMemo<MultiSelectEntry[]>(() => {
    const entries: MultiSelectEntry[] = options.list().map((option) => ({
      ...option,
      disabled: !!props.disabled || !!option.disabled || (!selected().includes(option.value) && isFull()),
    }));
    const text = query().trim();
    const needle = text.toLowerCase();
    const matches = (value: string) => value.toLowerCase() === needle;
    const exists = [...options.local(), ...options.remote.items()].some(
      (option) => matches(option.label) || matches(option.value),
    );
    const picked = selected().some((value) => matches(value) || matches(labelOf(value)));
    if (props.creatable && text && !isFull() && !exists && !picked) {
      entries.push({ value: text, label: text, create: true, disabled: !!props.disabled });
    }
    return entries;
  });
  const remember = (option: SelectOption) =>
    setPickedLabels((previous) => new Map(previous).set(option.value, option.label));
  return { available, isFull, labelOf, remember };
};
