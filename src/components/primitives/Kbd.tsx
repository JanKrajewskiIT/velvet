import { For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './Kbd.module.css';
import { Text } from './Text';

const KBD_CLASSES = {
  sm: styles.kbdVariantSm,
  plain: styles.kbdVariantPlain,
} as const;

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

export interface KbdProps extends HtmlProps<HTMLElement> {
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
  const [local, rest] = splitProps(p, ['keys', 'children', 'size', 'plain', 'class']);
  const list = () => (local.keys ? (Array.isArray(local.keys) ? local.keys : local.keys.split('+')) : undefined);
  const capClass = () =>
    cx(styles.kbd, variantClass(KBD_CLASSES, local.size, 'md'), local.plain && styles.kbdVariantPlain);
  return (
    <Show
      when={list()}
      fallback={
        <Text
          {...rest}
          as="kbd"
          variant={local.size === 'sm' ? 'micro' : 'kbd'}
          tone="inherit"
          class={cx(capClass(), local.class)}
        >
          {local.children}
        </Text>
      }
    >
      {(keys) => (
        <span {...rest} class={cx(styles.kbdCombo, local.class)} aria-label={keys().join(' + ')}>
          <For each={keys()}>
            {(key) => (
              <Text
                as="kbd"
                variant={local.size === 'sm' ? 'micro' : 'kbd'}
                tone="inherit"
                class={capClass()}
                aria-hidden="true"
              >
                {keyLabel(key)}
              </Text>
            )}
          </For>
        </span>
      )}
    </Show>
  );
};
