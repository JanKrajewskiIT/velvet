import { createSignal, createUniqueId, For, mergeProps, Show } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { createMenuNavigation } from '../../hooks/createMenuNavigation';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';

const DIAL_STAGGER_MS = 30;

export interface FabAction {
  label: string;
  icon: string;
  onClick?: () => void;
}

export interface FabProps {
  /** @default 'plus' */
  icon?: string;
  /** Required — aria-label or visible text. */
  label: string;
  extended?: boolean;
  onClick?: () => void;
  /** With actions the button becomes a speed dial (icon rotates to ×, labelled mini-buttons stagger in; Esc closes). */
  actions?: FabAction[];
  /** fixed = bottom-right of the viewport · static. @default 'fixed' */
  position?: 'fixed' | 'static';
  class?: string;
}

/** Floating action button — the single most important creation action on mobile screens. */
export const Fab = (props: FabProps) => {
  const p = mergeProps({ icon: 'plus', position: 'fixed' } satisfies Partial<FabProps>, props);
  const [open, setOpen] = createSignal(false);
  const [wrap, setWrap] = createSignal<HTMLDivElement>();
  const dial = () => (p.actions?.length ?? 0) > 0;
  const menuId = createUniqueId();
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) wrap()?.querySelector<HTMLElement>('.vui-fab')?.focus({ preventScroll: true });
  };
  const menu = createMenuNavigation(wrap, () => p.actions?.length ?? 0, close);
  const openMenu = (last = false) => {
    setOpen(true);
    menu.focus(last ? (p.actions?.length ?? 1) - 1 : 0);
  };

  createDismiss(open, () => setOpen(false), wrap, { refocus: '.vui-fab' });

  const floating = createFloating(open, () => wrap()?.querySelector('.vui-fab'), {
    side: () => 'top',
    align: () => 'end',
    offset: 12,
  });
  const choose = (action: FabAction) => {
    close(true);
    action.onClick?.();
  };

  return (
    <div
      ref={setWrap}
      class={cx(
        'vui-fab-wrap',
        p.position === 'fixed' && 'vui-fab-wrap--fixed',
        open() && 'vui-fab-wrap--open',
        p.class,
      )}
    >
      <Show when={dial()}>
        {}
        <ul
          ref={floating.ref}
          style={floating.style()}
          id={menuId}
          class="vui-fab__dial"
          role="menu"
          aria-label={p.label}
          aria-hidden={!open()}
          onKeyDown={menu.onKeyDown}
        >
          <For each={p.actions}>
            {(action, i) => (
              <li
                role="presentation"
                style={{
                  'transition-delay': open() ? `${((p.actions?.length ?? 1) - 1 - i()) * DIAL_STAGGER_MS}ms` : '0ms',
                }}
              >
                <span class="vui-fab__tag" aria-hidden="true">
                  {action.label}
                </span>
                <button
                  type="button"
                  role="menuitem"
                  tabIndex={open() && i() === menu.active() ? 0 : -1}
                  class="vui-fab__mini"
                  aria-label={action.label}
                  onClick={() => choose(action)}
                  onFocus={() => menu.onFocus(i())}
                >
                  <Glyph name={action.icon} />
                </button>
              </li>
            )}
          </For>
        </ul>
      </Show>
      <button
        type="button"
        class={cx('vui-fab', p.extended && 'vui-fab--extended')}
        aria-label={p.extended ? undefined : p.label}
        aria-haspopup={dial() ? 'menu' : undefined}
        aria-expanded={dial() ? open() : undefined}
        aria-controls={dial() ? menuId : undefined}
        onClick={() => {
          if (!dial()) p.onClick?.();
          else if (open()) close(false);
          else openMenu();
        }}
        onKeyDown={(event) => {
          if (!dial() || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
          event.preventDefault();
          openMenu(event.key === 'ArrowUp');
        }}
      >
        <Glyph name={p.icon} class="vui-fab__icon" />
        <Show when={p.extended}>
          <span>{p.label}</span>
        </Show>
      </button>
    </div>
  );
};
