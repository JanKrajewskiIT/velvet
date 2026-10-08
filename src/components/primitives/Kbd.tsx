import { For, type JSX, mergeProps, Show } from 'solid-js';

import { cx, modifier } from '../../utils/cx';

const isApplePlatform = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/u.test(navigator.userAgent);

const KEY_LABELS: Record<string, string> = {
  mod: isApplePlatform ? '⌘' : 'Ctrl',
  cmd: '⌘',
  ctrl: 'Ctrl',
  alt: isApplePlatform ? '⌥' : 'Alt',
  shift: '⇧',
  enter: '↵',
  esc: 'Esc',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  tab: 'Tab',
  backspace: '⌫',
  space: 'Space',
};

const keyLabel = (key: string): string => KEY_LABELS[key.toLowerCase()] ?? key.toUpperCase();

export interface KbdProps {
  /** `"mod+k"` renders ⌘ K on Mac, Ctrl K elsewhere. Aliases: mod cmd ctrl alt shift enter esc up down left right tab backspace space. */
  keys?: string | string[];
  children?: JSX.Element;
  size?: 'sm' | 'md';
  /** No key cap — bare shortcut text for menus, command palette and tooltips (inherits colour). */
  plain?: boolean;
  class?: string;
}

/** Keyboard key(s). */
export const Kbd = (props: KbdProps) => {
  const p = mergeProps({ size: 'md', plain: false } satisfies KbdProps, props);
  const list = () => (p.keys ? (Array.isArray(p.keys) ? p.keys : p.keys.split('+')) : undefined);
  const capClass = () => cx('vui-kbd', modifier('vui-kbd', p.size, 'md'), p.plain && 'vui-kbd--plain');
  return (
    <Show when={list()} fallback={<kbd class={cx(capClass(), p.class)}>{p.children}</kbd>}>
      {(keys) => (
        <span class={cx('vui-kbd-combo', p.class)} aria-label={keys().join(' + ')}>
          <For each={keys()}>
            {(key) => (
              <kbd class={capClass()} aria-hidden="true">
                {keyLabel(key)}
              </kbd>
            )}
          </For>
        </span>
      )}
    </Show>
  );
};
