import { createEffect, mergeProps, onCleanup, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Kbd } from '../primitives/Kbd';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './SearchTrigger.module.css';

export interface SearchTriggerProps {
  /** @default localized "Search…" */
  placeholder?: string;
  /** @default '⌘K' */
  shortcut?: string;
  /** Register the global ⌘K / Ctrl+K listener. @default true */
  hotkey?: boolean;
  onOpen?: () => void;
  class?: string;
}

/** Search field look-alike that opens a command palette. Listens for ⌘K / Ctrl+K globally; collapses to an icon under 640px. */
export const SearchTrigger = (props: SearchTriggerProps) => {
  const p = mergeProps({ shortcut: '⌘K', hotkey: true } satisfies SearchTriggerProps, props);
  const translate = useTranslate();
  const placeholder = () => p.placeholder ?? translate('velvet.layout.searchTrigger.placeholder');

  createEffect(() => {
    if (!p.hotkey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        p.onOpen?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    onCleanup(() => window.removeEventListener('keydown', onKeyDown));
  });

  return (
    <button
      type="button"
      onClick={() => p.onOpen?.()}
      aria-label={placeholder()}
      aria-keyshortcuts={p.hotkey ? 'Meta+K Control+K' : undefined}
      class={cx(typographyClass('body-sm'), styles.searchTrigger, p.class)}
    >
      <Glyph name="search" />
      <Text as="span" variant="label" tone="inherit" class={styles.searchTriggerPartText}>
        {placeholder()}
      </Text>
      <Show when={p.shortcut}>{(shortcut) => <Kbd class={styles.shortcut}>{shortcut()}</Kbd>}</Show>
    </button>
  );
};
