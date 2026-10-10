import {
  children as resolveChildren,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  onCleanup,
  Show,
} from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { createTrigger } from '../../hooks/createTrigger';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';

/** Attributes and handler a custom trigger must spread onto its element. */
export interface PopoverTriggerProps {
  'aria-haspopup': 'dialog';
  'aria-expanded': boolean;
  'aria-controls': string;
  onClick: (e: MouseEvent) => void;
}

export interface PopoverProps {
  /** Label, a native interactive element, or a render function spreading the received attributes onto its trigger. */
  trigger: JSX.Element | ((trigger: PopoverTriggerProps) => JSX.Element);
  title?: JSX.Element;
  /** Accessible name when the panel has no visible title. */
  label?: string;
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
  const titleId = `${id}-title`;
  const translate = useTranslate();
  const hover = () => p.openOn === 'hover';
  const title = resolveChildren(() => p.title);
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
  const trigger = createTrigger(
    () => p.trigger,
    triggerProps,
    (content, attributes) => (
      <button type="button" {...attributes}>
        {content}
      </button>
    ),
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- delegates events from the supplied native trigger, which owns keyboard semantics
    <span
      ref={setWrap}
      class={cx('vui-popover-wrap', hover() && 'vui-popover-wrap--hover', p.class)}
      onClick={trigger.onClick}
      onKeyDown={trigger.onKeyDown}
      onMouseEnter={() => hover() && later(true, p.openDelay)}
      onMouseLeave={() => hover() && later(false, p.closeDelay)}
      onFocusIn={() => hover() && later(true, 0)}
      onFocusOut={(e) => {
        if (hover() && !e.currentTarget.contains(e.relatedTarget as Node | null)) later(false, p.closeDelay);
      }}
    >
      {trigger.content}
      <Show when={isOpen()}>
        <div
          ref={floating.ref}
          id={id}
          role="dialog"
          aria-labelledby={title() ? titleId : undefined}
          aria-label={title() ? undefined : (p.label ?? translate('velvet.feedback.dialog.label'))}
          class={cx(
            'vui-popover',
            floating.side() === 'top' && 'vui-popover--top',
            p.align === 'end' && 'vui-popover--end',
          )}
          style={floating.style()}
        >
          <Show when={title()}>
            <div id={titleId} class="vui-popover__title">
              {title()}
            </div>
          </Show>
          <div class="vui-popover__body">{p.children}</div>
        </div>
      </Show>
    </span>
  );
};
