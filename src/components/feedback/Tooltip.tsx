import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  on,
  onCleanup,
  Show,
} from 'solid-js';

import { createFloating } from '../../hooks/createFloating';
import { createLayer } from '../../hooks/createLayer';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Kbd } from '../primitives/Kbd';
import { Text } from '../primitives/Text';
import styles from './Tooltip.module.css';

const TOOLTIP_CLASSES = {
  bottom: styles.tooltipVariantBottom,
  right: styles.tooltipVariantRight,
  left: styles.tooltipVariantLeft,
  open: styles.tooltipVariantOpen,
} as const;

/** Pause (ms) before hiding, so the pointer can cross the gap between trigger and tooltip. */
const HIDE_DELAY = 120;

const focusStaysWithin = (event: FocusEvent & { currentTarget: HTMLElement }): boolean =>
  event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget);

export interface TooltipProps {
  content: JSX.Element;
  /** Preferred side; flips when there is no room. @default 'top' */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Keyboard shortcut hint, e.g. `"⌘K"`. */
  shortcut?: string;
  /** Force visible (docs/demos). */
  open?: boolean;
  class?: string;
  /** The trigger. The first element, or the wrapper for text, receives `aria-describedby`. */
  children: JSX.Element;
}

/** Short hint on hover/focus. Stays visible while hovered, dismisses with Esc. Never put essential info or interactive content inside. */
export const Tooltip = (props: TooltipProps) => {
  const p = mergeProps({ side: 'top' } satisfies Partial<TooltipProps>, props);
  const id = createUniqueId();
  const [wrap, setWrap] = createSignal<HTMLElement>();
  const [hovered, setHovered] = createSignal(false);
  const [focused, setFocused] = createSignal(false);
  const [dismissed, setDismissed] = createSignal(false);
  const trigger = createMemo(() => props.children);
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  const visible = () => !dismissed() && (!!p.open || hovered() || focused());
  createEffect(
    on(
      () => p.open,
      (open) => {
        if (open) setDismissed(false);
      },
      { defer: true },
    ),
  );
  const enter = () => {
    clearTimeout(hideTimer);
    setHovered(true);
    setDismissed(false);
  };
  const leave = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => setHovered(false), HIDE_DELAY);
  };
  onCleanup(() => clearTimeout(hideTimer));
  createLayer(visible, () => setDismissed(true), { root: wrap, onOutside: () => setDismissed(true) });
  const anchor = () => {
    trigger();
    const wrapper = wrap();
    const first = wrapper?.firstElementChild;
    return first && first.id !== id ? first : wrapper;
  };
  const floating = createFloating(visible, anchor, {
    side: () => p.side,
    align: () => 'center',
    offset: 'var(--tooltip-offset)',
  });

  createEffect(() => {
    const described = anchor();
    if (!described) return;
    const previous = described.getAttribute('aria-describedby');
    described.setAttribute('aria-describedby', previous ? `${previous} ${id}` : id);
    onCleanup(() => {
      if (previous) described.setAttribute('aria-describedby', previous);
      else described.removeAttribute('aria-describedby');
    });
  });

  return (
    <span
      ref={setWrap}
      class={cx(styles.tooltipWrap, p.class)}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onFocusIn={(event) => {
        if (focusStaysWithin(event)) return;
        setFocused(true);
        setDismissed(false);
      }}
      onFocusOut={(event) => {
        if (!focusStaysWithin(event)) setFocused(false);
      }}
    >
      {trigger()}
      <Text
        as="span"
        variant="label-sm"
        tone="inherit"
        ref={floating.ref}
        id={id}
        role="tooltip"
        class={cx(
          styles.tooltip,
          variantClass(TOOLTIP_CLASSES, floating.side(), 'top'),
          visible() && styles.tooltipVariantOpen,
        )}
        style={{
          ...floating.style(),
          opacity: visible() ? undefined : '0',
          'pointer-events': visible() ? 'auto' : undefined,
        }}
      >
        {p.content}
        <Show when={p.shortcut}>
          {(shortcut) => (
            <Kbd plain class={styles.tooltipPartKbd}>
              {shortcut()}
            </Kbd>
          )}
        </Show>
      </Text>
    </span>
  );
};
