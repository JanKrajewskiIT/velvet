import { createEffect, createMemo, createSignal, type JSX, onCleanup, Show, untrack } from 'solid-js';
import { Portal } from 'solid-js/web';

import { createDismiss } from '../../hooks/createDismiss';
import type { MenuItem } from './menuItem';
import { MenuPanel } from './MenuPanel';

const VIEWPORT_MARGIN_PX = 8;
const KEYBOARD_OFFSET_PX = 16;

const fitInViewport = (value: number, size: number, viewport: number): number =>
  Math.max(VIEWPORT_MARGIN_PX, Math.min(value, viewport - size - VIEWPORT_MARGIN_PX));

interface Point {
  x: number;
  y: number;
}

export interface ContextMenuProps {
  items: MenuItem[];
  disabled?: boolean;
  class?: string;
  style?: JSX.CSSProperties;
  /** The region that responds to right-click. */
  children?: JSX.Element;
}

/** Right-click (or Shift+F10 / Menu key) menu for a region. Opens at the pointer, clamps to the viewport, closes on scroll and outside click. Always duplicate critical actions somewhere visible: context menus are undiscoverable. */
export const ContextMenu = (props: ContextMenuProps) => {
  let zone!: HTMLDivElement;
  let host: HTMLElement | undefined;
  const [pos, setPos] = createSignal<Point | null>(null);
  const isOpen = createMemo(() => pos() !== null);

  const close = () => setPos(null);
  createDismiss(isOpen, close, () => host, { escape: false });

  createEffect(() => {
    if (!isOpen()) return;
    const onScroll = (e: Event) => {
      if (!(e.target instanceof Node && host?.contains(e.target))) close();
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', close);
    onCleanup(() => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', close);
    });
  });

  /** Called once the portal host is attached, so the panel can be measured and kept inside the viewport. */
  const placePanel = (el: Element) => {
    if (!(el instanceof HTMLElement)) return;
    host = el;
    const at = untrack(pos);
    const rect = el.firstElementChild?.getBoundingClientRect();
    if (!at || !rect) return;
    setPos({
      x: fitInViewport(at.x, rect.width, window.innerWidth),
      y: fitInViewport(at.y, rect.height, window.innerHeight),
    });
  };

  const onContextMenu: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (props.disabled) return;
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
  };

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    if (props.disabled || e.target !== e.currentTarget) return;
    if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu') {
      e.preventDefault();
      const rect = zone.getBoundingClientRect();
      setPos({ x: rect.left + KEYBOARD_OFFSET_PX, y: rect.top + KEYBOARD_OFFSET_PX });
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={zone}
      class={props.class}
      style={props.style}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the zone must be focusable so Shift+F10 / ContextMenu open the menu from the keyboard
      tabIndex={0}
      aria-haspopup="menu"
      onContextMenu={onContextMenu}
      onKeyDown={onKeyDown}
    >
      {props.children}
      <Show when={pos()}>
        {(at) => (
          <Portal ref={placePanel}>
            <MenuPanel
              items={props.items}
              style={{ position: 'fixed', left: `${at().x}px`, top: `${at().y}px`, 'z-index': 'var(--z-dropdown)' }}
              onClose={(refocus) => {
                close();
                if (refocus) zone.focus({ preventScroll: true });
              }}
            />
          </Portal>
        )}
      </Show>
    </div>
  );
};
