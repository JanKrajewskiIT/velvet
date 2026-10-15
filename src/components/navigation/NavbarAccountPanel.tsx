import { createSignal, createUniqueId, For, Show } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { createFrameFocus } from '../../hooks/createFrameFocus';
import { useTranslate } from '../../i18n/useTranslate';
import { classSelector } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Avatar } from '../data/Avatar';
import { renderIcon } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './NavbarAccountPanel.module.css';
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
      class={styles.acct}
      onFocusOut={(event) => {
        if (open() && !event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        class={styles.acctPartTrigger}
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
                ? `${classSelector(styles.acctPartPanel)} button:not(:disabled):not([tabindex="-1"])`
                : classSelector(styles.acctPartPanel),
            );
        }}
      >
        <Avatar class={styles.triggerAvatar} name={props.name} src={props.src} size="sm" />
      </button>
      <Show when={open()}>
        <div
          id={id}
          ref={floating.ref}
          role="dialog"
          tabIndex={-1}
          aria-label={props.label}
          class={cx(styles.acctPartPanel, typographyClass('body'))}
          style={floating.style()}
        >
          <div class={styles.acctPartHead}>
            <Avatar class={styles.headerAvatar} name={props.name} src={props.src} size="lg" />
            <div class={styles.acctPartId}>
              <Text as="span" variant="title" tone="inherit" class="vui-acct__name">
                {props.name}
              </Text>
              <Show when={props.email}>
                <Text as="span" variant="caption" tone="secondary" class={styles.acctPartEmail}>
                  {props.email}
                </Text>
              </Show>
              <Show when={props.meta}>
                <Text as="span" variant="label-sm" tone="brand" class={styles.acctPartMeta}>
                  {props.meta}
                </Text>
              </Show>
            </div>
          </div>
          <Show when={items().length}>
            <ul class={styles.acctPartList}>
              <For each={items()}>
                {(item) => (
                  <li>
                    <button
                      type="button"
                      class={cx(styles.acctPartItem, typographyClass('body-sm'))}
                      disabled={item.disabled}
                      onClick={() => run(item.onSelect)}
                    >
                      {renderIcon(item.icon)}
                      <Text as="span" variant="body-sm" tone="inherit">
                        {item.label}
                      </Text>
                      <Show when={item.shortcut}>
                        <Text as="span" variant="caption" tone="inherit" class={styles.acctPartHint}>
                          {item.shortcut}
                        </Text>
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
            <div class={styles.acctPartFoot}>
              <button
                type="button"
                class={cx(styles.acctPartItem, typographyClass('body-sm'))}
                onClick={() => run(props.onSignOut)}
              >
                {renderIcon('log-out')}
                <Text as="span" variant="body-sm" tone="inherit">
                  {translate('velvet.actions.authButton.signOut')}
                </Text>
              </button>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
};
