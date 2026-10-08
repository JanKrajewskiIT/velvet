import { type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
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

const isRenderer = (trigger: JSX.Element | MenuTriggerRenderer): trigger is MenuTriggerRenderer =>
  typeof trigger === 'function';

export interface MenuProps {
  /** A render function receiving the trigger attributes (usually spread onto a Button or IconButton; ↓ on it opens), or content for a default secondary Button. */
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
  class?: string;
}

/** Dropdown menu of actions attached to a trigger. ↑↓ / Home / End move, type to jump, Enter selects, Esc closes and refocuses the trigger. */
export const Menu = (props: MenuProps) => {
  const p = mergeProps({ align: 'start', side: 'bottom', defaultOpen: false } satisfies Partial<MenuProps>, props);
  let wrap!: HTMLSpanElement;
  const [isOpen, setOpen] = createControllable({
    value: () => p.open,
    defaultValue: p.defaultOpen,
    onChange: (next) => p.onOpenChange?.(next),
  });

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) wrap.querySelector<HTMLElement>(TRIGGER_SELECTOR)?.focus({ preventScroll: true });
  };
  createDismiss(
    isOpen,
    () => setOpen(false),
    () => wrap,
    { escape: false },
  );
  const floating = createFloating(isOpen, () => wrap, { side: () => p.side, align: () => p.align });

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

  const renderTrigger = () => {
    const trigger = p.trigger;
    return isRenderer(trigger) ? (
      trigger(triggerProps)
    ) : (
      <Button variant="secondary" {...triggerProps}>
        {trigger}
      </Button>
    );
  };

  return (
    <span ref={wrap} class={cx('vui-menu-wrap', p.class)}>
      {renderTrigger()}
      <Show when={isOpen()}>
        <MenuPanel
          ref={floating.ref}
          items={p.items}
          onClose={close}
          class={cx(
            'vui-menu--pop',
            p.align === 'end' && 'vui-menu--end',
            floating.side() === 'top' && 'vui-menu--top',
          )}
          style={{ ...floating.style(), ...(p.width ? { 'min-width': `${p.width}px` } : undefined) }}
        />
      </Show>
    </span>
  );
};
