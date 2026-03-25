import { createEffect, createMemo, createSignal, For, type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import useEscapeKey from '~/hooks/useEscapeKey';
import useFocusTrap from '~/hooks/useFocusTrap';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import SearchInput from '../../inputs/SearchInput/SearchInput';
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

interface CommandPaletteMessages {
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
  const { t } = useI18n();
  const [query, setQuery] = createSignal('');
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

  createEffect(() => {
    if (!props.open) return;
    setQuery('');
  });

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) props.onClose();
  };

  const handleItemClick = (item: CommandItem) => {
    item.onSelect();
    props.onClose();
  };

  const placeholder = () => props.messages?.placeholder ?? props.placeholder ?? t('commandPalette.searchCommands');
  const dialogLabel = () => props.messages?.dialogLabel ?? props.dialogLabel ?? t('commandPalette.label');
  const resultsLabel = () => props.messages?.resultsLabel ?? props.resultsLabel ?? t('commandPalette.results');
  const emptyLabel = () => props.messages?.emptyLabel ?? props.emptyLabel ?? t('commandPalette.noResults');
  const closeHintLabel = () => props.messages?.closeHintLabel ?? t('commandPalette.escToClose');

  return (
    <Show when={props.open}>
      <Portal>
        <div role="presentation" class={classNames(styles.overlay, props.class)} onClick={handleOverlayClick}>
          <div ref={setPanelRef} class={styles.panel} role="dialog" aria-modal="true" aria-label={dialogLabel()}>
            <div class={styles.searchWrap} role="search">
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
            <div class={styles.results} role="list" aria-label={resultsLabel()}>
              <Show
                when={filtered().length > 0}
                fallback={
                  <Text as="p" variant="bodySm" tone="muted" class={styles.empty}>
                    {emptyLabel()}
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
                            class={styles.resultItem}
                            onClick={() => handleItemClick(item)}
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
                {closeHintLabel()}
              </Text>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default CommandPalette;
