import { type Accessor, createEffect, createSignal, createUniqueId, onCleanup, type Setter } from 'solid-js';

import { createActiveOptionScroll } from '../../hooks/createActiveOptionScroll';
import { createFloating, type Floating } from '../../hooks/createFloating';
import { activeItemKey } from '../../utils/activeItem';
import type { SelectOption } from './selectOption';

export interface ComboboxPopup {
  id: Accessor<string>;
  listId: Accessor<string>;
  optionId: (index: number) => string;
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  active: Accessor<number>;
  setActive: Setter<number>;
  root: Accessor<HTMLElement | undefined>;
  setRoot: Setter<HTMLElement | undefined>;
  floating: Floating;
  activeDescendant: (options: ReadonlyArray<unknown>) => string | undefined;
  handleArrowKey: (e: KeyboardEvent) => boolean;
}

export const createComboboxPopup = (
  idOverride: Accessor<string | undefined>,
  options: Accessor<readonly SelectOption[]>,
): ComboboxPopup => {
  const autoId = createUniqueId();
  const id = () => idOverride() ?? autoId;
  const listId = () => `${id()}-list`;
  const optionId = (index: number) => `${listId()}-${index}`;

  const [open, setOpen] = createSignal(false);
  const [activeKey, setActiveKey] = createSignal<string>();
  const active = () => {
    const key = activeItemKey(
      options(),
      activeKey(),
      (option) => option.value,
      (option) => !option.disabled,
    );
    return options().findIndex((option) => option.value === key);
  };
  const setActive: Setter<number> = (next) => {
    const index = typeof next === 'function' ? next(active()) : next;
    setActiveKey(options()[index]?.value);
    return index;
  };
  const [root, setRoot] = createSignal<HTMLElement>();
  const floating = createFloating(open, root, { matchWidth: true });
  createEffect(() => {
    const initialRoot = root();
    if (!open() || !initialRoot) return;
    const leave = (event: FocusEvent) => {
      if (event.relatedTarget instanceof Node && !initialRoot.contains(event.relatedTarget)) setOpen(false);
    };
    initialRoot.addEventListener('focusout', leave);
    onCleanup(() => initialRoot.removeEventListener('focusout', leave));
  });
  createActiveOptionScroll(open, () => (active() >= 0 ? optionId(active()) : undefined));

  const activeDescendant = (items: ReadonlyArray<unknown>) =>
    open() && items[active()] ? optionId(active()) : undefined;
  const handleArrowKey = (e: KeyboardEvent): boolean => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && !(open() && (e.key === 'Home' || e.key === 'End')))
      return false;
    e.preventDefault();
    if (!open()) {
      setOpen(true);
      return true;
    }
    const enabled = options().flatMap((option, index) => (option.disabled ? [] : [index]));
    const at = enabled.indexOf(active());
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? enabled.length - 1
          : Math.max(0, Math.min(enabled.length - 1, at + (e.key === 'ArrowDown' ? 1 : -1)));
    setActive(enabled[next] ?? -1);
    return true;
  };

  return {
    id,
    listId,
    optionId,
    open,
    setOpen,
    active,
    setActive,
    root,
    setRoot,
    floating,
    activeDescendant,
    handleArrowKey,
  };
};
