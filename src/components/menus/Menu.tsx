import { createSignal, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { createTrigger } from '../../hooks/createTrigger';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import styles from './Menu.module.css';
import type { MenuItem } from './menuItem';
import { MenuPanel } from './MenuPanel';

const TRIGGER_SELECTOR = '[aria-haspopup="menu"]';

/** Attributes and handlers a menu trigger must carry. Spread them last, after your own props, and call your own handlers yourself. */
export interface MenuTriggerProps {
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  onClick: JSX.EventHandler<HTMLElement, MouseEvent>;
  onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent>;
}

export type MenuTriggerRenderer = (trigger: MenuTriggerProps) => JSX.Element;

export interface MenuProps {
  /** Label, a native interactive element, or a render function receiving attributes and keyboard handlers. */
  trigger: JSX.Element | MenuTriggerRenderer;
  items: MenuItem[];
  /** @default 'start' */
  align?: 'start' | 'end';
  /** Preferred side; flips when there is no room. @default 'bottom' */
  side?: 'bottom' | 'top';
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Min panel width (px). */
  width?: number;
  /** @default 'start' */
  iconPosition?: 'start' | 'end';
  class?: string;
}

/** Dropdown menu of actions attached to a trigger. ↑↓ / Home / End move, type to jump, Enter selects, Esc closes and refocuses the trigger. */
export const Menu = (props: MenuProps) => {
  const p = mergeProps({ align: 'start', side: 'bottom', defaultOpen: false } satisfies Partial<MenuProps>, props);
  const [wrap, setWrap] = createSignal<HTMLSpanElement>();
  const [isOpen, setOpen] = createControllable({
    value: () => p.open,
    defaultValue: p.defaultOpen,
    onChange: (next) => p.onOpenChange?.(next),
  });

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) wrap()?.querySelector<HTMLElement>(TRIGGER_SELECTOR)?.focus({ preventScroll: true });
  };
  createDismiss(isOpen, (reason) => close(reason === 'escape'), wrap, { refocus: false });
  const floating = createFloating(isOpen, wrap, { side: () => p.side, align: () => p.align });

  const triggerProps: MenuTriggerProps = {
    'aria-haspopup': 'menu',
    get 'aria-expanded'() {
      return isOpen();
    },
    onClick: () => setOpen(!isOpen()),
    onKeyDown: (e) => {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !isOpen()) {
        e.preventDefault();
        setOpen(true);
      }
    },
  };

  const trigger = createTrigger(
    () => p.trigger,
    triggerProps,
    (content, attributes) => (
      <Button variant="secondary" {...attributes}>
        {content}
      </Button>
    ),
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- delegates events from the supplied native trigger, which owns keyboard semantics
    <span ref={setWrap} class={cx(styles.menuWrap, p.class)} onClick={trigger.onClick} onKeyDown={trigger.onKeyDown}>
      {trigger.content}
      <Show when={isOpen()}>
        <MenuPanel
          ref={floating.ref}
          items={p.items}
          iconPosition={p.iconPosition}
          onClose={close}
          class={cx(
            styles.menuVariantPop,
            p.align === 'end' && styles.menuVariantEnd,
            floating.side() === 'top' && styles.menuVariantTop,
          )}
          style={{ ...floating.style(), ...(p.width ? { 'min-width': `${p.width}px` } : undefined) }}
        />
      </Show>
    </span>
  );
};
