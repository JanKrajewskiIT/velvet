import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { callHandler } from '../../utils/callHandler';
import { cx } from '../../utils/cx';
import { Spinner } from '../feedback/Spinner';
import { renderIcon } from '../primitives/Glyph';
import styles from './Button.module.css';
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
  /** Shows a decorative spinner and blocks activation while preserving focus and the action label. */
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
    'aria-disabled',
    'onClick',
    'onKeyDown',
    'onKeyUp',
    'class',
    'children',
  ]);
  const groupSize = useButtonGroupSize();
  const blocked = () =>
    local.disabled || local.loading || local['aria-disabled'] === true || local['aria-disabled'] === 'true';
  const click: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    if (blocked()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    callHandler(local.onClick, event);
  };
  const keyboard = (
    event: KeyboardEvent & { currentTarget: HTMLButtonElement; target: Element },
    handler: ButtonProps['onKeyDown'],
  ) => {
    if (blocked() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    callHandler(handler, event);
  };
  return (
    <button
      {...rest}
      class={cx(
        styles.root,
        buttonClass({ variant: local.variant, size: local.size ?? groupSize(), block: local.block }),
        local.class,
      )}
      disabled={local.disabled}
      aria-disabled={local.loading || local['aria-disabled']}
      aria-busy={local.loading || rest['aria-busy']}
      onClick={click}
      onKeyDown={(event) => keyboard(event, local.onKeyDown)}
      onKeyUp={(event) => keyboard(event, local.onKeyUp)}
    >
      <Show when={local.loading} fallback={renderIcon(local.iconLeft)}>
        <Spinner size="inline" tone="current" decorative />
      </Show>
      {local.children}
      <Show when={!local.loading}>{renderIcon(local.iconRight)}</Show>
    </button>
  );
};
