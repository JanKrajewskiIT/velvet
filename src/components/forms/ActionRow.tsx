import { type JSX, mergeProps, Show } from 'solid-js';

import { cx } from '../../utils/cx';

export interface ActionRowProps {
  /** @default 'end' */
  align?: 'start' | 'center' | 'end' | 'between';
  /** Pins to the bottom of the scroll container with a frosted background. */
  sticky?: boolean;
  divider?: boolean;
  /** Left slot, e.g. Delete or "Saved 2 min ago". */
  start?: JSX.Element;
  class?: string;
  children?: JSX.Element;
}

/** Button row for forms, dialogs and panels. Wraps on narrow widths; the primary action stays last. */
export const ActionRow = (props: ActionRowProps) => {
  const p = mergeProps({ align: 'end' } satisfies Partial<ActionRowProps>, props);
  return (
    <div
      class={cx(
        'vui-actionrow',
        `vui-actionrow--${p.align}`,
        p.sticky && 'vui-actionrow--sticky',
        p.divider && 'vui-actionrow--divider',
        p.class,
      )}
    >
      <Show when={p.start}>
        <div class="vui-actionrow__start">{p.start}</div>
      </Show>
      <div class="vui-actionrow__main">{p.children}</div>
    </div>
  );
};
