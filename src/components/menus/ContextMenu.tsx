import { type JSX, Portal } from '@solidjs/web';
import { createEffect, createMemo, createSignal, Show } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import styles from './ContextMenu.module.css';
import type { MenuItem } from './menuItem';
import { MenuPanel } from './MenuPanel';

const VIEWPORT_MARGIN_PX = 8;
const KEYBOARD_OFFSET_PX = 16;

const fitInViewport = (value: number, size: number, viewport: number): number =>
  clamp(value, VIEWPORT_MARGIN_PX, viewport - size - VIEWPORT_MARGIN_PX);

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
  const [host, setHost] = createSignal<HTMLElement>();
  const [pos, setPos] = createSignal<Point | null>(null);
  const isOpen = createMemo(() => pos() !== null);

  const close = () => setPos(null);
  createEffect(
    () => props.disabled,
    (disabled) => {
      if (disabled) close();
    },
  );
  createDismiss(
    isOpen,
    (reason) => {
      close();
      if (reason === 'escape') zone.focus({ preventScroll: true });
    },
    host,
    { refocus: false },
  );

  createEffect(isOpen, (opened) => {
    if (!opened) return;
    const onScroll = (e: Event) => {
      if (!(e.target instanceof Node && host()?.contains(e.target))) close();
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', close);
    };
  });

  createEffect(
    () => [pos(), host()] as const,
    ([at, panel]) => {
      const rect = panel?.getBoundingClientRect();
      if (!at || !rect) return;
      const x = fitInViewport(at.x, rect.width, window.innerWidth);
      const y = fitInViewport(at.y, rect.height, window.innerHeight);
      if (x !== at.x || y !== at.y) setPos({ x, y });
    },
  );

  const onContextMenu: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (props.disabled || e.defaultPrevented) return;
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
  };

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    if (props.disabled || e.defaultPrevented) return;
    if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu') {
      e.preventDefault();
      const rect = zone.getBoundingClientRect();
      setPos({ x: rect.left + KEYBOARD_OFFSET_PX, y: rect.top + KEYBOARD_OFFSET_PX });
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- delegates context-menu events from the supplied content; the focusable zone also handles Shift+F10
    <div
      ref={(element) => {
        zone = element;
      }}
      class={cx(styles.root, props.class)}
      style={props.style}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the zone must be focusable so Shift+F10 / ContextMenu open the menu from the keyboard
      tabindex={0}
      aria-haspopup="menu"
      onContextMenu={onContextMenu}
      onKeyDown={onKeyDown}
    >
      {props.children}
      <Show when={pos()}>
        {(at) => (
          <Portal mount={zone.closest('dialog[open]') ?? undefined}>
            <MenuPanel
              ref={setHost}
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
