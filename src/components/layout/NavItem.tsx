import { children, For, type JSX, Show, splitProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { Chevron } from '../primitives/Chevron';
import { Count } from '../primitives/Count';
import { renderIcon } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './NavItem.module.css';
import { useSidebar } from './sidebarContext';

export interface NavSubItem {
  id?: string;
  label: JSX.Element;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

export interface NavItemProps extends HtmlProps<HTMLElement, 'onClick'> {
  /** Glyph name or node. */
  icon?: JSX.Element;
  label?: JSX.Element;
  /** Current page. */
  active?: boolean;
  /** Mono count pill; solid brand when active; a dot in the rail. */
  count?: number | string;
  /** Any trailing node (prefer count). */
  end?: JSX.Element;
  /** Renders an `<a>` when set (ignored with subItems). */
  href?: string;
  /** Nested links — opens by default when one is active. */
  subItems?: NavSubItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClick?: (event: MouseEvent) => void;
}

/** Single navigation link inside Sidebar; with `subItems` it becomes an animated accordion parent. */
export const NavItem = (props: NavItemProps) => {
  const [local, rest] = splitProps(props, [
    'icon',
    'label',
    'active',
    'count',
    'end',
    'href',
    'subItems',
    'open',
    'defaultOpen',
    'onOpenChange',
    'onClick',
    'class',
    'children',
  ]);
  const sidebar = useSidebar();
  const subItems = () => local.subItems ?? [];
  const hasSub = () => subItems().length > 0;
  const childActive = () => subItems().some((item) => item.active);
  const [open, setOpen] = createControllable({
    value: () => local.open,
    defaultValue: local.defaultOpen ?? childActive(),
    onChange: (value) => local.onOpenChange?.(value),
  });
  const isOpen = () => hasSub() && !sidebar.collapsed() && open();
  const text = children(() => local.label || local.children);
  const tip = () => {
    const content = text();
    return sidebar.collapsed() && typeof content === 'string' ? content : undefined;
  };

  const onClick = (event: MouseEvent) => {
    if (hasSub()) {
      if (sidebar.collapsed() && sidebar.expand()) {
        setOpen(true);
      } else {
        setOpen(!isOpen());
      }
    }
    local.onClick?.(event);
  };

  return (
    <>
      <Polymorphic
        tag={local.href && !hasSub() ? 'a' : 'button'}
        {...rest}
        href={local.href && !hasSub() ? local.href : undefined}
        type={local.href && !hasSub() ? undefined : 'button'}
        aria-current={local.active && !hasSub() ? 'page' : undefined}
        aria-expanded={hasSub() ? isOpen() : undefined}
        aria-label={tip()}
        data-tip={tip()}
        data-collapsed={sidebar.collapsed()}
        class={cx(
          typographyClass('label'),
          styles.navItem,
          (local.active || (sidebar.collapsed() && childActive())) && styles.navItemVariantActive,
          local.count != null && styles.navItemVariantHasCount,
          isOpen() && styles.navItemVariantOpen,
          local.class,
        )}
        onClick={onClick}
      >
        {renderIcon(local.icon)}
        <Text
          as="span"
          variant="label"
          tone="inherit"
          data-collapsed={sidebar.collapsed()}
          class={styles.navItemPartLabel}
        >
          {text()}
        </Text>
        <Show when={local.count != null}>
          <Count
            value={local.count}
            tone="neutral"
            showZero
            data-collapsed={sidebar.collapsed()}
            class={styles.navItemPartCount}
          />
        </Show>
        <Show when={local.end}>
          <span data-collapsed={sidebar.collapsed()} class={styles.navItemPartEnd}>
            {local.end}
          </span>
        </Show>
        <Show when={hasSub()}>
          <Chevron direction="right" data-collapsed={sidebar.collapsed()} class={styles.navItemPartCaret} />
        </Show>
      </Polymorphic>
      <Show when={hasSub()}>
        <div
          data-collapsed={sidebar.collapsed()}
          class={cx(styles.navSub, isOpen() && styles.navSubVariantOpen)}
          aria-hidden={!isOpen() || undefined}
        >
          <div class={styles.navSubPartInner}>
            <For each={subItems()}>
              {(item) => (
                <Polymorphic
                  tag={item.href ? 'a' : 'button'}
                  href={item.href}
                  type={item.href ? undefined : 'button'}
                  tabIndex={isOpen() ? undefined : -1}
                  aria-current={item.active ? 'page' : undefined}
                  class={cx(styles.navSubPartLink, typographyClass('body-sm'))}
                  onClick={() => item.onClick?.()}
                >
                  {item.label}
                </Polymorphic>
              )}
            </For>
          </div>
        </div>
      </Show>
    </>
  );
};
