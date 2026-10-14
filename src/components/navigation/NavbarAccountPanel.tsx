import { createSignal, createUniqueId, For, Show } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { createFrameFocus } from '../../hooks/createFrameFocus';
import { useTranslate } from '../../i18n/useTranslate';
import { Avatar } from '../data/Avatar';
import { renderIcon } from '../primitives/Glyph';
import { NavbarAccountTheme } from './NavbarAccountTheme';
import type { NavbarUserProps } from './navbarUserTypes';

export interface NavbarAccountPanelProps extends NavbarUserProps {
  label: string;
  accessibleName: string;
}

export const NavbarAccountPanel = (props: NavbarAccountPanelProps) => {
  const [open, setOpen] = createSignal(false);
  const [root, setRoot] = createSignal<HTMLDivElement>();
  const id = createUniqueId();
  const translate = useTranslate();
  const focus = createFrameFocus(root);
  createDismiss(open, () => setOpen(false), root);
  const floating = createFloating(open, root, { align: () => 'end' });
  const items = () => props.items.filter((item) => !item.divider && !item.section && item.label != null);
  const close = () => {
    setOpen(false);
    focus('[aria-haspopup="dialog"]');
  };
  const run = (action: (() => void) | undefined) => {
    close();
    action?.();
  };

  return (
    <div
      ref={setRoot}
      class="vui-acct"
      onFocusOut={(event) => {
        if (open() && !event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        class="vui-acct__trigger"
        aria-haspopup="dialog"
        aria-expanded={open()}
        aria-controls={id}
        aria-label={props.accessibleName}
        title={props.name}
        onClick={() => {
          const next = !open();
          setOpen(next);
          if (next)
            focus(
              items().some((item) => !item.disabled) || props.onThemeChange || props.onSignOut
                ? '.vui-acct__panel button:not(:disabled):not([tabindex="-1"])'
                : '.vui-acct__panel',
            );
        }}
      >
        <Avatar name={props.name} src={props.src} size="sm" />
      </button>
      <Show when={open()}>
        <div
          id={id}
          ref={floating.ref}
          role="dialog"
          tabIndex={-1}
          aria-label={props.label}
          class="vui-acct__panel"
          style={floating.style()}
        >
          <div class="vui-acct__head">
            <Avatar name={props.name} src={props.src} size="lg" />
            <div class="vui-acct__id">
              <span class="vui-acct__name">{props.name}</span>
              <Show when={props.email}>
                <span class="vui-acct__email">{props.email}</span>
              </Show>
              <Show when={props.meta}>
                <span class="vui-acct__meta">{props.meta}</span>
              </Show>
            </div>
          </div>
          <Show when={items().length}>
            <ul class="vui-acct__list">
              <For each={items()}>
                {(item) => (
                  <li>
                    <button
                      type="button"
                      class="vui-acct__item"
                      disabled={item.disabled}
                      onClick={() => run(item.onSelect)}
                    >
                      {renderIcon(item.icon)}
                      <span>{item.label}</span>
                      <Show when={item.shortcut}>
                        <span class="vui-acct__hint">{item.shortcut}</span>
                      </Show>
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </Show>
          <Show when={props.onThemeChange}>
            <NavbarAccountTheme value={props.theme} onChange={(value) => props.onThemeChange?.(value)} />
          </Show>
          <Show when={props.onSignOut}>
            <div class="vui-acct__foot">
              <button type="button" class="vui-acct__item" onClick={() => run(props.onSignOut)}>
                {renderIcon('log-out')}
                <span>{translate('velvet.actions.authButton.signOut')}</span>
              </button>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
};
