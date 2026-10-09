import { createEffect, createMemo, createSignal, createUniqueId, For, type JSX, Show } from 'solid-js';

import { createModal } from '../../hooks/createModal';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { ModalBackdrop } from '../feedback/ModalBackdrop';
import { EmptyText } from '../primitives/EmptyText';
import { Glyph, renderIcon } from '../primitives/Glyph';
import { highlightMatch } from '../primitives/Mark';
import { SectionLabel } from '../primitives/SectionLabel';
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
  const [root, setRoot] = createSignal<HTMLDivElement>();
  const [query, setQuery] = createSignal('');
  const [active, setActive] = createSignal(0);

  createModal(() => true, root, { onEscape: () => props.onClose() });

  const groups = createMemo(() => filterCommandGroups(props.groups, query()));
  const flat = createMemo(() => groups().flatMap((group) => group.results.map((result) => result.item)));

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
    setActive((at) => (at + direction + count) % count);
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
    <ModalBackdrop class="vui-dialog-backdrop vui-dialog-backdrop--top" onDismiss={props.onClose}>
      <div
        ref={setRoot}
        role="dialog"
        aria-modal="true"
        aria-label={labels().dialog}
        class={cx('vui-cmdk', props.class)}
      >
        <div class="vui-cmdk__search">
          <Glyph name="search" />
          <input
            role="combobox"
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
          <kbd class="vui-cmdk__key" aria-hidden="true">
            Esc
          </kbd>
        </div>
        <div ref={list} id={id} role="listbox" class="vui-cmdk__list">
          <For each={groups()}>
            {(group) => (
              <div role="group" aria-label={group.label}>
                <SectionLabel class="vui-cmdk__group">{group.label}</SectionLabel>
                <For each={group.results}>
                  {(result) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- option rows are driven by aria-activedescendant on the combobox input, which owns keyboard handling and focus
                    <div
                      id={optionId(result.index)}
                      role="option"
                      aria-selected={result.index === active()}
                      class={cx(
                        'vui-menu__item',
                        'vui-cmdk__item',
                        result.index === active() && 'vui-menu__item--active',
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
                            <Glyph name="arrow-right" class="vui-cmdk__go" />
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
            <EmptyText class="vui-cmdk__empty">{emptyText()}</EmptyText>
          </Show>
        </div>
        <div class="vui-cmdk__foot" aria-hidden="true">
          <span>
            <kbd class="vui-cmdk__key">↑↓</kbd>
            {labels().navigate}
          </span>
          <span>
            <kbd class="vui-cmdk__key">↵</kbd>
            {labels().open}
          </span>
          <span>
            <kbd class="vui-cmdk__key">Esc</kbd>
            {labels().close}
          </span>
          <span class="vui-cmdk__count">{resultCount()}</span>
        </div>
      </div>
    </ModalBackdrop>
  );
};
