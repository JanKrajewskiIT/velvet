import { FiSearch } from 'solid-icons/fi';
import { createEffect, createMemo, createSignal, For, type JSX, onCleanup, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import type Props from '~/models/Props';

import useEscapeKey from '../../../hooks/useEscapeKey';
import styles from './CommandPalette.module.css';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: JSX.Element;
  group?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}

const CommandPalette = (props: Props<CommandPaletteProps>) => {
  const [query, setQuery] = createSignal('');
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  let inputRef: HTMLInputElement | undefined;

  useEscapeKey(
    () => props.open,
    () => props.onClose()
  );

  const filtered = createMemo(() => {
    const q = query().toLowerCase();
    if (!q) return props.items;
    return props.items.filter(
      (item) => item.label.toLowerCase().includes(q) || (item.description?.toLowerCase().includes(q) ?? false)
    );
  });

  const grouped = createMemo(() => {
    const groups: { name: string | undefined; items: CommandItem[] }[] = [];
    const map = new Map<string | undefined, CommandItem[]>();
    for (const item of filtered()) {
      const key = item.group;
      const existing = map.get(key);
      if (existing) {
        existing.push(item);
      } else {
        const arr = [item];
        map.set(key, arr);
        groups.push({ name: key, items: arr });
      }
    }
    return groups;
  });

  const flatList = createMemo(() => filtered());

  const executeSelected = () => {
    const item = flatList()[selectedIndex()];
    if (item) {
      item.onSelect();
      props.onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatList().length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeSelected();
    }
  };

  createEffect(() => {
    if (!props.open) return;
    setQuery('');
    setSelectedIndex(0);
    requestAnimationFrame(() => inputRef?.focus());

    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown));
  });

  createEffect(() => {
    filtered();
    setSelectedIndex(0);
  });

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) props.onClose();
  };

  const placeholder = () => props.placeholder ?? 'Search commands...';

  return (
    <Show when={props.open}>
      <Portal>
        <div
          role="presentation"
          class={`${styles.overlay} ${props.class ?? ''}`}
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
        >
          <div class={styles.panel} role="dialog" aria-label="Command palette">
            <div class={styles.searchBar}>
              <FiSearch size={20} class={styles.searchIcon} />
              <input
                ref={inputRef}
                type="text"
                class={styles.searchInput}
                placeholder={placeholder()}
                value={query()}
                onInput={(e) => setQuery(e.currentTarget.value)}
              />
            </div>
            <div class={styles.divider} />
            <div class={styles.results}>
              <Show when={flatList().length > 0} fallback={<div class={styles.empty}>No results found</div>}>
                <For each={grouped()}>
                  {(group) => (
                    <>
                      <Show when={group.name}>
                        <div class={styles.groupHeader}>{group.name}</div>
                      </Show>
                      <For each={group.items}>
                        {(item) => {
                          const itemIndex = () => flatList().indexOf(item);
                          return (
                            <button
                              type="button"
                              class={`${styles.resultItem} ${itemIndex() === selectedIndex() ? styles.selected : ''}`}
                              onMouseEnter={() => setSelectedIndex(itemIndex())}
                              onClick={() => {
                                item.onSelect();
                                props.onClose();
                              }}
                            >
                              <Show when={item.icon}>
                                <span class={styles.itemIcon}>{item.icon}</span>
                              </Show>
                              <span class={styles.itemLabel}>{item.label}</span>
                              <Show when={item.description}>
                                <span class={styles.itemDescription}>{item.description}</span>
                              </Show>
                            </button>
                          );
                        }}
                      </For>
                    </>
                  )}
                </For>
              </Show>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default CommandPalette;
