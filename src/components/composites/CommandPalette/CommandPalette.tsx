import { createEffect, createMemo, createSignal, For, type JSX, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import useEscapeKey from '~/hooks/useEscapeKey';
import useFocusTrap from '~/hooks/useFocusTrap';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import SearchInput from '../../inputs/SearchInput/SearchInput';
import Surface from '../../surfaces/Surface/Surface';
import Text from '../../typography/Text/Text';
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
}

const CommandPalette = (props: Props<CommandPaletteProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['open', 'onClose', 'items', 'class']);
  const [query, setQuery] = createSignal('');
  const [activeIndex, setActiveIndex] = createSignal(-1);
  const [panelRef, setPanelRef] = createSignal<HTMLElement | undefined>();
  let resultsRef: HTMLDivElement | undefined;

  useEscapeKey(
    () => local.open,
    () => local.onClose(),
  );

  useFocusTrap(panelRef, () => local.open);

  const filtered = createMemo(() => {
    const q = query().toLowerCase();
    if (!q) return local.items;
    return local.items.filter(
      (item) => item.label.toLowerCase().includes(q) || (item.description?.toLowerCase().includes(q) ?? false),
    );
  });

  const grouped = createMemo(() => {
    const groups: { name: string | undefined; items: (CommandItem & { flatIndex: number })[] }[] = [];
    const map = new Map<string | undefined, (CommandItem & { flatIndex: number })[]>();
    filtered().forEach((item, flatIndex) => {
      const key = item.group;
      const existing = map.get(key);
      const indexedItem = { ...item, flatIndex };
      if (existing) {
        existing.push(indexedItem);
      } else {
        const arr = [indexedItem];
        map.set(key, arr);
        groups.push({ name: key, items: arr });
      }
    });
    return groups;
  });

  createEffect(() => {
    if (!local.open) return;
    setQuery('');
    setActiveIndex(local.items.length > 0 ? 0 : -1);
  });

  createEffect(() => {
    const items = filtered();
    if (items.length === 0) {
      if (activeIndex() !== -1) {
        setActiveIndex(-1);
      }
      return;
    }

    const current = activeIndex();
    if (current < 0 || current >= items.length) {
      setActiveIndex(0);
    }
  });

  createEffect(() => {
    if (!local.open) return;

    const index = activeIndex();
    if (index < 0) return;

    const activeItem = resultsRef?.querySelector<HTMLElement>(`[data-command-index="${String(index)}"]`);
    activeItem?.scrollIntoView({ block: 'nearest' });
  });

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) local.onClose();
  };

  const handleItemClick = (item: CommandItem) => {
    item.onSelect();
    local.onClose();
  };
  const moveActiveIndex = (direction: 1 | -1) => {
    const items = filtered();
    if (items.length === 0) {
      setActiveIndex(-1);
      return;
    }

    const current = activeIndex();
    const startIndex = current >= 0 ? current : direction === 1 ? -1 : 0;
    const nextIndex = (startIndex + direction + items.length) % items.length;
    setActiveIndex(nextIndex);
  };
  const handleSearchKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveActiveIndex(1);
        return;
      case 'ArrowUp':
        event.preventDefault();
        moveActiveIndex(-1);
        return;
      case 'Home':
        if (filtered().length === 0) return;
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        if (filtered().length === 0) return;
        event.preventDefault();
        setActiveIndex(filtered().length - 1);
        return;
      case 'Enter': {
        const activeItem = filtered()[activeIndex()];
        if (!activeItem) return;
        event.preventDefault();
        handleItemClick(activeItem);
        return;
      }
      default:
        return;
    }
  };

  return (
    <Show when={local.open}>
      <Portal>
        <div {...rest} role="presentation" class={classNames(styles.overlay, local.class)} onClick={handleOverlayClick}>
          <Surface
            ref={setPanelRef}
            class={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label={ts('commandPalette.label')}
            elevation="dialog"
          >
            <div class={styles.searchWrap} role="search">
              <SearchInput
                class={styles.searchInput}
                size="lg"
                placeholder={ts('commandPalette.searchCommands')}
                value={query()}
                onInput={setQuery}
                onClear={() => setQuery('')}
                onKeyDown={handleSearchKeyDown}
                autofocus
              />
            </div>
            <div ref={resultsRef} class={styles.results} role="list" aria-label={ts('commandPalette.results')}>
              <Show
                when={filtered().length > 0}
                fallback={
                  <Text as="p" variant="bodySm" tone="muted" class={styles.empty}>
                    {ts('commandPalette.noResults')}
                  </Text>
                }
              >
                <For each={grouped()}>
                  {(group) => (
                    <>
                      <Show when={group.name}>
                        <Text as="p" variant="overline" tone="tertiary" class={styles.groupHeader}>
                          {group.name}
                        </Text>
                      </Show>
                      <For each={group.items}>
                        {(item) => (
                          <Button
                            type="button"
                            variant="subtle"
                            size="sm"
                            class={classNames(
                              styles.resultItem,
                              activeIndex() === item.flatIndex && styles.resultItemActive,
                            )}
                            data-command-index={String(item.flatIndex)}
                            onClick={() => handleItemClick(item)}
                            onMouseEnter={() => setActiveIndex(item.flatIndex)}
                          >
                            <Show when={item.icon}>
                              <span class={styles.itemIcon}>{item.icon}</span>
                            </Show>
                            <Text as="span" variant="bodySm" class={styles.itemLabel}>
                              {item.label}
                            </Text>
                            <Show when={item.description}>
                              <Text as="span" variant="caption" tone="muted" class={styles.itemDescription}>
                                {item.description}
                              </Text>
                            </Show>
                          </Button>
                        )}
                      </For>
                    </>
                  )}
                </For>
              </Show>
            </div>
            <div class={styles.footer}>
              <Text as="span" variant="caption" tone="muted">
                {ts('commandPalette.navigate')}
              </Text>
              <Text as="span" variant="caption" tone="muted">
                {ts('commandPalette.select')}
              </Text>
              <Text as="span" variant="caption" tone="muted">
                {ts('commandPalette.escToClose')}
              </Text>
            </div>
          </Surface>
        </div>
      </Portal>
    </Show>
  );
};

export default CommandPalette;
