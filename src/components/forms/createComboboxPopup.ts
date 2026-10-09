import { type Accessor, createSignal, createUniqueId, type Setter } from 'solid-js';

import { createFloating, type Floating } from '../../hooks/createFloating';

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
  handleArrowKey: (e: KeyboardEvent, optionCount: number) => boolean;
}

export const createComboboxPopup = (idOverride: Accessor<string | undefined>): ComboboxPopup => {
  const autoId = createUniqueId();
  const id = () => idOverride() ?? autoId;
  const listId = () => `${id()}-list`;
  const optionId = (index: number) => `${listId()}-${index}`;

  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal(0);
  const [root, setRoot] = createSignal<HTMLElement>();
  const floating = createFloating(open, root, { matchWidth: true });

  const activeDescendant = (options: ReadonlyArray<unknown>) =>
    open() && options[active()] ? optionId(active()) : undefined;
  const handleArrowKey = (e: KeyboardEvent, optionCount: number): boolean => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (open()) setActive((index) => Math.min(optionCount - 1, index + 1));
      else setOpen(true);
      return true;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((index) => Math.max(0, index - 1));
      return true;
    }
    return false;
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
