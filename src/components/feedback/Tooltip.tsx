import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
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

export interface TooltipProps {
  content: JSX.Element;
  /** Preferred side; flips when there is no room. @default 'top' */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Keyboard shortcut hint, e.g. `"⌘K"`. */
  shortcut?: string;
  /** Force visible (docs/demos). */
  open?: boolean;
  class?: string;
  /** The trigger. Its first element is described by the tooltip (`aria-describedby`). */
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
  const enter = () => {
    clearTimeout(hideTimer);
    setHovered(true);
  };
  const leave = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      setHovered(false);
      setDismissed(false);
    }, HIDE_DELAY);
  };
  onCleanup(() => clearTimeout(hideTimer));
  createLayer(visible, () => setDismissed(true), { root: wrap, onOutside: () => setDismissed(true) });
  const floating = createFloating(visible, () => wrap()?.firstElementChild ?? wrap(), {
    side: () => p.side,
    align: () => 'center',
    offset: 'var(--tooltip-offset)',
  });

  createEffect(() => {
    trigger();
    const described = wrap()?.firstElementChild;
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
      onFocusIn={() => setFocused(true)}
      onFocusOut={() => {
        setFocused(false);
        setDismissed(false);
      }}
    >
      {trigger()}
      <Text
        as="span"
        variant="caption"
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
