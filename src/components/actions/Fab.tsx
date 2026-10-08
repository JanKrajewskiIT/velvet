import { createSignal, For, mergeProps, Show } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
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

  createDismiss(open, () => setOpen(false), wrap, { refocus: '.vui-fab' });

  const choose = (action: FabAction) => {
    setOpen(false);
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
        <ul class="vui-fab__dial" role="menu" aria-hidden={!open()}>
          <For each={p.actions}>
            {(action, i) => (
              <li
                style={{
                  'transition-delay': open() ? `${((p.actions?.length ?? 1) - 1 - i()) * DIAL_STAGGER_MS}ms` : '0ms',
                }}
              >
                <span class="vui-fab__tag">{action.label}</span>
                <button
                  type="button"
                  role="menuitem"
                  tabIndex={open() ? 0 : -1}
                  class="vui-fab__mini"
                  aria-label={action.label}
                  onClick={() => choose(action)}
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
        onClick={() => (dial() ? setOpen(!open()) : p.onClick?.())}
      >
        <Glyph name={p.icon} class="vui-fab__icon" />
        <Show when={p.extended}>
          <span>{p.label}</span>
        </Show>
      </button>
    </div>
  );
};
