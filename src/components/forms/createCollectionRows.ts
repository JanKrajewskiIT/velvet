import { createSignal, createUniqueId } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import type { EditableItem, EditableItemId } from './editableItem';
import { normalizeOption, type SelectOption } from './selectOption';

const DEFAULT_WEIGHT = 3;

export interface CollectionRowsOptions {
  items?: ReadonlyArray<EditableItem>;
  defaultItems: ReadonlyArray<EditableItem>;
  onItemsChange?: (items: ReadonlyArray<EditableItem>) => void;
  levels?: ReadonlyArray<string | SelectOption>;
  weighted: boolean;
  newItemText: string;
  maxItems?: number;
}

export type CollectionRows = ReturnType<typeof createCollectionRows>;

export const createCollectionRows = (options: CollectionRowsOptions) => {
  const idPrefix = createUniqueId();
  let newItemCount = 0;
  let root: HTMLDivElement | undefined;

  const [items, setItems] = createControllable<ReadonlyArray<EditableItem>>({
    value: () => options.items,
    defaultValue: options.defaultItems,
    onChange: (next) => options.onItemsChange?.(next),
  });
  const [touched, setTouched] = createSignal<ReadonlySet<EditableItemId>>(new Set());

  const canAdd = () => options.maxItems == null || items().length < options.maxItems;

  const patch = (id: EditableItemId, changes: Partial<Omit<EditableItem, 'id'>>) =>
    setItems(items().map((item) => (item.id === id ? { ...item, ...changes } : item)));

  const moveItem = (from: number, to: number) => {
    const moved = items()[from];
    if (!moved || to < 0 || to >= items().length || from === to) return;
    const next = items().filter((_, index) => index !== from);
    next.splice(to, 0, moved);
    setItems(next);
  };

  const removeItem = (id: EditableItemId) => setItems(items().filter((entry) => entry.id !== id));

  const addItem = () => {
    const fresh: EditableItem = { id: `${idPrefix}-new-${++newItemCount}`, text: options.newItemText };
    const levels = options.levels?.map(normalizeOption).filter((option) => !option.disabled);
    const level = levels?.[Math.min(1, levels.length - 1)];
    if (level !== undefined) fresh.level = level.value;
    if (options.weighted) fresh.weight = DEFAULT_WEIGHT;
    setItems([...items(), fresh]);
    requestAnimationFrame(() =>
      [...(root?.querySelectorAll<HTMLElement>('[data-vui-collection-input]') ?? [])].at(-1)?.focus(),
    );
  };

  const focusGrip = (index: number) =>
    requestAnimationFrame(() => root?.querySelectorAll<HTMLElement>('[data-vui-collection-grip]')[index]?.focus());

  const onGripKeyDown = (event: KeyboardEvent, index: number) => {
    const target = event.key === 'ArrowUp' ? index - 1 : event.key === 'ArrowDown' ? index + 1 : undefined;
    if (target === undefined || target < 0 || target >= items().length) return;
    event.preventDefault();
    moveItem(index, target);
    focusGrip(target);
  };

  const markTouched = (id: EditableItemId) => setTouched((previous) => new Set(previous).add(id));

  return {
    bindRoot: (element: HTMLDivElement) => {
      root = element;
    },
    items,
    touched,
    canAdd,
    patch,
    moveItem,
    removeItem,
    addItem,
    onGripKeyDown,
    markTouched,
  };
};
