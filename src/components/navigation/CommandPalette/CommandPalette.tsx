import { createEffect, createMemo, createSignal, createUniqueId, For, type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import useEscapeKey from '~/hooks/useEscapeKey';
import useFocusTrap from '~/hooks/useFocusTrap';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import SearchInput from '../../inputs/SearchInput/SearchInput';
import Heading from '../../typography/Heading/Heading';
import styles from './CommandPalette.module.css';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: JSX.Element;
  group?: string;
  onSelect: () => void;
}

interface CommandPaletteMessages {
  title?: string;
  closeHintLabel?: string;
  navigateHintLabel?: string;
  selectHintLabel?: string;
  placeholder?: string;
  dialogLabel?: string;
  resultsLabel?: string;
  emptyLabel?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  dialogLabel?: string;
  resultsLabel?: string;
  emptyLabel?: string;
  messages?: CommandPaletteMessages;
}

const CommandPalette = (props: Props<CommandPaletteProps>) => {
  const [query, setQuery] = createSignal('');
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const listboxId = createUniqueId();
  const [panelRef, setPanelRef] = createSignal<HTMLElement | undefined>();

  useEscapeKey(
    () => props.open,
    () => props.onClose()
  );

  useFocusTrap(panelRef, () => props.open);

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

  const indexMap = createMemo(() => {
    const map = new Map<CommandItem, number>();
    flatList().forEach((item, index) => {
      map.set(item, index);
    });
    return map;
  });

  const executeSelected = () => {
    const item = flatList()[selectedIndex()];
    if (item) {
      item.onSelect();
      props.onClose();
    }
  };

  const optionId = (index: number): string => `${listboxId}-option-${index}`;

  const handleKeyDown = (e: KeyboardEvent) => {
    const itemsCount = flatList().length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (itemsCount > 0 ? Math.min(i + 1, itemsCount - 1) : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSelectedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      if (itemsCount > 0) setSelectedIndex(itemsCount - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeSelected();
    }
  };

  createEffect(() => {
    if (!props.open) return;
    setQuery('');
    setSelectedIndex(0);
  });

  createEffect(() => {
    filtered();
    setSelectedIndex(0);
  });

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) props.onClose();
  };

  const handleItemClick = (item: CommandItem) => {
    item.onSelect();
    props.onClose();
  };

  const placeholder = () => props.messages?.placeholder ?? props.placeholder ?? 'Search commands...';
  const dialogLabel = () => props.messages?.dialogLabel ?? props.dialogLabel ?? 'Command palette';
  const resultsLabel = () => props.messages?.resultsLabel ?? props.resultsLabel ?? 'Command results';
  const emptyLabel = () => props.messages?.emptyLabel ?? props.emptyLabel ?? 'No results found';
  const title = () => props.messages?.title ?? 'Command Palette';
  const closeHintLabel = () => props.messages?.closeHintLabel ?? 'Esc';
  const navigateHintLabel = () => props.messages?.navigateHintLabel ?? 'Up/Down to navigate';
  const selectHintLabel = () => props.messages?.selectHintLabel ?? 'Enter to select';

  return (
    <Show when={props.open}>
      <Portal>
        <div role="presentation" class={classNames(styles.overlay, props.class)} onClick={handleOverlayClick}>
          <div ref={setPanelRef} class={styles.panel} role="dialog" aria-modal="true" aria-label={dialogLabel()}>
            <div class={styles.header}>
              <Heading as="h2" level={2} class={styles.title}>
                {title()}
              </Heading>
              <span class={styles.hintKey}>{closeHintLabel()}</span>
            </div>
            <div
              class={styles.searchWrap}
              onKeyDown={handleKeyDown}
              role="combobox"
              tabindex={0}
              aria-autocomplete="list"
              aria-expanded={props.open}
              aria-controls={listboxId}
              aria-activedescendant={flatList().length > 0 ? optionId(selectedIndex()) : undefined}
            >
              <SearchInput
                class={styles.searchInput}
                size="lg"
                placeholder={placeholder()}
                value={query()}
                onInput={setQuery}
                onClear={() => setQuery('')}
                autofocus
              />
            </div>
            <div class={styles.results} id={listboxId} role="listbox" aria-label={resultsLabel()}>
              <Show when={flatList().length > 0} fallback={<div class={styles.empty}>{emptyLabel()}</div>}>
                <For each={grouped()}>
                  {(group) => (
                    <>
                      <Show when={group.name}>
                        <div class={styles.groupHeader}>{group.name}</div>
                      </Show>
                      <For each={group.items}>
                        {(item) => {
                          const itemIndex = () => indexMap().get(item) ?? 0;
                          return (
                            <button
                              type="button"
                              id={optionId(itemIndex())}
                              class={classNames(styles.resultItem, itemIndex() === selectedIndex() && styles.selected)}
                              onMouseEnter={() => setSelectedIndex(itemIndex())}
                              onClick={() => handleItemClick(item)}
                              role="option"
                              aria-selected={itemIndex() === selectedIndex()}
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
            <div class={styles.footer}>
              <span class={styles.footerHint}>{navigateHintLabel()}</span>
              <span class={styles.footerHint}>{selectHintLabel()}</span>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default CommandPalette;
