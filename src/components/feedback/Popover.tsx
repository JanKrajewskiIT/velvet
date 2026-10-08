import {
  children as resolveChildren,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  onCleanup,
  Show,
  untrack,
} from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { cx } from '../../utils/cx';

/** Attributes and handler a custom trigger must spread onto its element. */
export interface PopoverTriggerProps {
  'aria-haspopup': 'dialog';
  'aria-expanded': boolean;
  'aria-controls': string;
  onClick: (e: MouseEvent) => void;
}

export interface PopoverProps {
  /** Label of the default trigger button, or a render function that spreads the received props onto a Button or IconButton. */
  trigger: JSX.Element | ((trigger: PopoverTriggerProps) => JSX.Element);
  title?: JSX.Element;
  /** Preferred side; flips when there is no room. @default 'bottom' */
  side?: 'bottom' | 'top';
  /** @default 'start' */
  align?: 'start' | 'end';
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** click or hover — hover = HoverCard behaviour: opens after `openDelay`, stays open over trigger or panel, also opens on focus. @default 'click' */
  openOn?: 'click' | 'hover';
  /** Hover only, ms. @default 350 */
  openDelay?: number;
  /** Hover only, ms. @default 150 */
  closeDelay?: number;
  class?: string;
  children?: JSX.Element;
}

/** Floating panel for rich content — profiles, quick settings, small forms. Use Tooltip for plain-text hints. Closes on outside click and Esc. */
export const Popover = (props: PopoverProps) => {
  const p = mergeProps(
    {
      side: 'bottom',
      align: 'start',
      defaultOpen: false,
      openOn: 'click',
      openDelay: 350,
      closeDelay: 150,
    } satisfies Partial<PopoverProps>,
    props,
  );
  const [isOpen, setOpen] = createControllable({
    value: () => p.open,
    defaultValue: p.defaultOpen,
    onChange: (next) => p.onOpenChange?.(next),
  });
  const [wrap, setWrap] = createSignal<HTMLElement>();
  const id = createUniqueId();
  const hover = () => p.openOn === 'hover';
  const title = resolveChildren(() => p.title);
  const titleText = () => {
    const resolved = title();
    return typeof resolved === 'string' ? resolved : undefined;
  };
  let timer: ReturnType<typeof setTimeout> | undefined;

  const cancelPending = () => clearTimeout(timer);
  const later = (next: boolean, ms: number) => {
    cancelPending();
    timer = setTimeout(() => setOpen(next), ms);
  };
  onCleanup(cancelPending);
  createDismiss(
    isOpen,
    () => {
      cancelPending();
      setOpen(false);
    },
    wrap,
  );
  const floating = createFloating(isOpen, wrap, { side: () => p.side, align: () => p.align });

  const triggerProps: PopoverTriggerProps = {
    'aria-haspopup': 'dialog',
    get 'aria-expanded'() {
      return isOpen();
    },
    'aria-controls': id,
    onClick: () => {
      if (!hover()) setOpen(!isOpen());
    },
  };
  const trigger = createMemo(() => {
    const t = p.trigger;
    return untrack(() =>
      typeof t === 'function' ? (
        t(triggerProps)
      ) : (
        <button type="button" {...triggerProps}>
          {t}
        </button>
      ),
    );
  });

  return (
    <span
      ref={setWrap}
      class={cx('vui-popover-wrap', hover() && 'vui-popover-wrap--hover', p.class)}
      onMouseEnter={() => hover() && later(true, p.openDelay)}
      onMouseLeave={() => hover() && later(false, p.closeDelay)}
      onFocusIn={() => hover() && later(true, 0)}
      onFocusOut={(e) => {
        if (hover() && !e.currentTarget.contains(e.relatedTarget as Node | null)) later(false, p.closeDelay);
      }}
    >
      {trigger()}
      <Show when={isOpen()}>
        <div
          ref={floating.ref}
          id={id}
          role="dialog"
          aria-label={titleText()}
          class={cx(
            'vui-popover',
            floating.side() === 'top' && 'vui-popover--top',
            p.align === 'end' && 'vui-popover--end',
          )}
          style={floating.style()}
        >
          <Show when={title()}>
            <div class="vui-popover__title">{title()}</div>
          </Show>
          <div class="vui-popover__body">{p.children}</div>
        </div>
      </Show>
    </span>
  );
};
