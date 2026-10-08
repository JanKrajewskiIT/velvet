import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { Spinner } from '../feedback/Spinner';
import { renderIcon } from '../primitives/Glyph';
import { buttonClass, type ButtonSize } from './buttonClass';
import { useButtonGroupSize } from './ButtonGroup';

export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'link' | 'dashed';

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /** `dashed` = low-key "+ Add …" affordance; with `block` it becomes the add-row at the end of a list/table. @default 'primary' */
  variant?: ButtonVariant;
  /** @default 'md' (40px; 44px on touch) */
  size?: ButtonSize;
  /** Glyph name (e.g. `"plus"`) or a node. */
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  /** Shows a spinner and disables. */
  loading?: boolean;
  /** Full width. */
  block?: boolean;
}

/** Primary action trigger. One primary per view; secondary/ghost for the rest. */
export const Button = (props: ButtonProps) => {
  const merged = mergeProps({ variant: 'primary', type: 'button' } satisfies ButtonProps, props);
  const [local, rest] = splitProps(merged, [
    'variant',
    'size',
    'iconLeft',
    'iconRight',
    'loading',
    'block',
    'disabled',
    'class',
    'children',
  ]);
  const groupSize = useButtonGroupSize();
  return (
    <button
      {...rest}
      class={cx(
        buttonClass({ variant: local.variant, size: local.size ?? groupSize, block: local.block }),
        local.class,
      )}
      disabled={local.disabled || local.loading}
      aria-busy={local.loading || undefined}
    >
      <Show when={local.loading} fallback={renderIcon(local.iconLeft)}>
        <Spinner size="inline" tone="current" />
      </Show>
      {local.children}
      <Show when={!local.loading}>{renderIcon(local.iconRight)}</Show>
    </button>
  );
};
