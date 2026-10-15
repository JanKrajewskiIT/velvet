import { createEffect, createMemo, createSignal, createUniqueId, For, type JSX, Show } from 'solid-js';

import { createModal } from '../../hooks/createModal';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { ModalBackdrop } from '../feedback/ModalBackdrop';
import { EmptyText } from '../primitives/EmptyText';
import { Glyph, renderIcon } from '../primitives/Glyph';
import { Kbd } from '../primitives/Kbd';
import { highlightMatch } from '../primitives/Mark';
import { SectionLabel } from '../primitives/SectionLabel';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './CommandPaletteDialog.module.css';
import { type CommandGroup, type CommandItem, type CommandPaletteLabels, filterCommandGroups } from './commandSearch';
import { MenuItemContent } from './MenuItemContent';

export interface CommandPaletteDialogProps {
  groups: CommandGroup[];
  onClose: () => void;
  placeholder?: string;
  emptyText?: string;
  labels?: Partial<CommandPaletteLabels>;
  class?: string;
}

/** The palette surface. Mounted only while open, so query and active result start fresh each time. */
export const CommandPaletteDialog = (props: CommandPaletteDialogProps) => {
  const translate = useTranslate();
  const placeholder = () => props.placeholder ?? translate('velvet.menus.commandPalette.placeholder');
  const emptyText = () => props.emptyText ?? translate('velvet.menus.commandPalette.emptyText');
  const labels = () => ({
    dialog: props.labels?.dialog ?? translate('velvet.menus.commandPalette.dialog'),
    navigate: props.labels?.navigate ?? translate('velvet.menus.commandPalette.navigate'),
    open: props.labels?.open ?? translate('velvet.menus.commandPalette.open'),
    close: props.labels?.close ?? translate('velvet.menus.commandPalette.close'),
  });
  const id = createUniqueId();
  const optionId = (index: number) => `${id}-${index}`;
  let list!: HTMLDivElement;
  const [root, setRoot] = createSignal<HTMLDialogElement>();
  const [query, setQuery] = createSignal('');
  const [highlighted, setActive] = createSignal(0);

  createModal(() => true, root, { onEscape: () => props.onClose() });

  const groups = createMemo(() => filterCommandGroups(props.groups, query()));
  const flat = createMemo(() => groups().flatMap((group) => group.results.map((result) => result.item)));
  const active = () => (flat().length ? Math.min(Math.max(0, highlighted()), flat().length - 1) : -1);

  createEffect(() => {
    const el = document.getElementById(optionId(active()));
    if (el && (el.offsetTop < list.scrollTop || el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight)) {
      list.scrollTop = el.offsetTop - list.clientHeight / 2;
    }
  });

  const run = (item: CommandItem | undefined) => {
    if (!item) return;
    props.onClose();
    item.onSelect?.();
  };

  const step = (direction: 1 | -1) => {
    const count = Math.max(1, flat().length);
    setActive((active() + direction + count) % count);
  };

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(flat()[active()]);
    }
  };

  const resultCount = () => {
    const count = flat().length;
    const custom = count === 1 ? props.labels?.resultOne : props.labels?.resultMany;
    return custom === undefined
      ? translate('velvet.menus.commandPalette.resultCount', { count })
      : `${count} ${custom}`;
  };

  return (
    <ModalBackdrop
      ref={setRoot}
      class={cx(styles.dialogBackdrop, styles.dialogBackdropVariantTop)}
      onDismiss={props.onClose}
      aria-label={labels().dialog}
    >
      <div class={cx(styles.cmdk, props.class)}>
        <div class={styles.cmdkPartSearch}>
          <Glyph name="search" />
          <input
            class={typographyClass('body-lg')}
            role="combobox"
            aria-label={translate('velvet.common.search')}
            aria-expanded="true"
            aria-controls={id}
            aria-activedescendant={flat().length ? optionId(active()) : undefined}
            aria-autocomplete="list"
            value={query()}
            placeholder={placeholder()}
            onInput={(e) => {
              setQuery(e.currentTarget.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
          />
          <Kbd class={styles.cmdkPartKey} aria-hidden="true">
            Esc
          </Kbd>
        </div>
        <div
          ref={(element) => {
            list = element;
          }}
          id={id}
          role="listbox"
          class={styles.cmdkPartList}
        >
          <For each={groups()}>
            {(group) => (
              <div role="group" aria-label={group.label}>
                <SectionLabel class={styles.cmdkPartGroup}>{group.label}</SectionLabel>
                <For each={group.results}>
                  {(result) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- option rows are driven by aria-activedescendant on the combobox input, which owns keyboard handling and focus
                    <div
                      id={optionId(result.index)}
                      role="option"
                      aria-selected={result.index === active()}
                      class={cx(
                        typographyClass('body'),
                        styles.menuPartItem,
                        styles.cmdkPartItem,
                        result.index === active() && styles.menuPartItemVariantActive,
                      )}
                      onMouseMove={() => active() !== result.index && setActive(result.index)}
                      onClick={() => run(result.item)}
                    >
                      <MenuItemContent
                        leading={renderIcon(result.item.icon)}
                        label={highlightMatch(result.item.label, query())}
                        description={result.item.description}
                        shortcut={result.item.shortcut}
                        trailing={
                          <Show when={result.index === active()}>
                            <Glyph name="arrow-right" class={styles.cmdkPartGo} />
                          </Show>
                        }
                      />
                    </div>
                  )}
                </For>
              </div>
            )}
          </For>
          <Show when={!flat().length}>
            <EmptyText class={styles.cmdkPartEmpty}>{emptyText()}</EmptyText>
          </Show>
        </div>
        <div class={cx(styles.cmdkPartFoot, typographyClass('caption'))} aria-hidden="true">
          <Text as="span" variant="caption" tone="inherit">
            <Kbd class={styles.cmdkPartKey}>↑↓</Kbd>
            {labels().navigate}
          </Text>
          <Text as="span" variant="caption" tone="inherit">
            <Kbd class={styles.cmdkPartKey}>↵</Kbd>
            {labels().open}
          </Text>
          <Text as="span" variant="caption" tone="inherit">
            <Kbd class={styles.cmdkPartKey}>Esc</Kbd>
            {labels().close}
          </Text>
          <Text as="span" variant="caption" tone="inherit" class={styles.cmdkPartCount}>
            {resultCount()}
          </Text>
        </div>
      </div>
    </ModalBackdrop>
  );
};
