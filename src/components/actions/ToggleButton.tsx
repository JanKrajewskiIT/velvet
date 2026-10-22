import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { callHandler } from '../../utils/callHandler';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { filledIcon } from '../display/IconFilled';
import { Glyph } from '../primitives/Glyph';
import { typographyClass } from '../primitives/typography';
import styles from './ToggleButton.module.css';
import { type ToggleSize, useToggleGroup } from './ToggleGroup';

const TOGGLE_CLASSES = {
  neutral: styles.toggleVariantNeutral,
  sm: styles.toggleVariantSm,
  lg: styles.toggleVariantLg,
  icon: styles.toggleVariantIcon,
} as const;

export interface ToggleButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Identity inside a ToggleGroup. */
  value?: string;
  /** Glyph name or node. Icons with a filled twin swap to `<name>-filled` when pressed. */
  icon?: JSX.Element;
  size?: ToggleSize;
  /** Pressed colour. `neutral` for editor toolbars (B / I / U). @default 'brand' */
  tone?: 'brand' | 'neutral';
  /** Square icon-only button; automatic when `icon` is set and there are no children. Requires `label`. */
  iconOnly?: boolean;
  /** Accessible name + tooltip for icon-only toggles. */
  label?: string;
}

/** Button with an on/off state (`aria-pressed`) — an action that stays pressed, not a setting (use Switch). */
export const ToggleButton = (props: ToggleButtonProps) => {
  const merged = mergeProps({ defaultPressed: false, tone: 'brand', size: 'md' } satisfies ToggleButtonProps, props);
  const [local, rest] = splitProps(merged, [
    'pressed',
    'defaultPressed',
    'onPressedChange',
    'value',
    'icon',
    'size',
    'tone',
    'iconOnly',
    'label',
    'disabled',
    'onClick',
    'class',
    'children',
  ]);
  const group = useToggleGroup();
  const [ownPressed, setOwnPressed] = createControllable({
    value: () => local.pressed,
    defaultValue: local.defaultPressed,
    onChange: (pressed) => local.onPressedChange?.(pressed),
  });

  const on = () => (group ? group.isOn(local.value) : ownPressed());
  const size = () => group?.size() ?? local.size;
  const iconOnly = () => local.iconOnly ?? (!local.children && !!local.icon);
  const flip: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    callHandler(local.onClick, event);
    if (event.defaultPrevented || local.disabled || group?.disabled()) return;
    if (group) group.toggle(local.value);
    else setOwnPressed(!ownPressed());
  };

  return (
    <button
      type="button"
      aria-pressed={on()}
      aria-label={iconOnly() ? local.label : undefined}
      title={iconOnly() ? local.label : undefined}
      disabled={local.disabled || group?.disabled()}
      class={cx(
        typographyClass(size() === 'sm' ? 'button-sm' : 'button'),
        styles.toggle,
        variantClass(TOGGLE_CLASSES, size(), 'md'),
        iconOnly() && styles.toggleVariantIcon,
        variantClass(TOGGLE_CLASSES, local.tone, 'brand'),
        local.class,
      )}
      {...rest}
      onClick={flip}
    >
      <Show when={typeof local.icon === 'string' ? local.icon : undefined} fallback={local.icon}>
        {(name) => <Glyph name={filledIcon(name(), on())} />}
      </Show>
      {local.children}
    </button>
  );
};
