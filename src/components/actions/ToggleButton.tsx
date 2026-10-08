import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { cx, modifier } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { type ToggleSize, useToggleGroup } from './ToggleGroup';

/** Icons whose `-filled` twin replaces them while pressed. */
const FILLED_TWINS: readonly string[] = [
  'home',
  'bell',
  'user',
  'folder',
  'bookmark',
  'heart',
  'message-square',
  'star',
];

const pressedIcon = (name: string, pressed: boolean): string =>
  pressed && FILLED_TWINS.includes(name) ? `${name}-filled` : name;

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
  const flip = () => (group ? group.toggle(local.value) : setOwnPressed(!ownPressed()));

  return (
    <button
      type="button"
      aria-pressed={on()}
      aria-label={iconOnly() ? local.label : undefined}
      title={iconOnly() ? local.label : undefined}
      disabled={local.disabled || group?.disabled()}
      class={cx(
        'vui-toggle',
        modifier('vui-toggle', size(), 'md'),
        iconOnly() && 'vui-toggle--icon',
        modifier('vui-toggle', local.tone, 'brand'),
        local.class,
      )}
      onClick={flip}
      {...rest}
    >
      <Show when={typeof local.icon === 'string' ? local.icon : undefined} fallback={local.icon}>
        {(name) => <Glyph name={pressedIcon(name(), on())} />}
      </Show>
      {local.children}
    </button>
  );
};
