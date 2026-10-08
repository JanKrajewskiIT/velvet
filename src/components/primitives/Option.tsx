import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Glyph, renderIcon } from './Glyph';

export interface OptionProps extends HtmlProps<HTMLDivElement> {
  /** Glyph name or node. */
  icon?: JSX.Element;
  label?: JSX.Element;
  description?: JSX.Element;
  /** e.g. "⌘K". */
  shortcut?: JSX.Element;
  selected?: boolean;
  /** Keyboard-highlighted (the `aria-activedescendant` target). */
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  /** Reserve a leading check column and show it when selected. */
  showCheck?: boolean;
  /** Use `menuitem` / `menuitemcheckbox` / `menuitemradio` inside menus. @default 'option' */
  role?: 'option' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
}

/** One row inside any listbox or menu — icon, label, description, shortcut, check and its states. */
export const Option = (props: OptionProps) => {
  const merged = mergeProps({ role: 'option' } satisfies OptionProps, props);
  const [local, rest] = splitProps(merged, [
    'icon',
    'label',
    'description',
    'shortcut',
    'selected',
    'active',
    'danger',
    'disabled',
    'showCheck',
    'role',
    'class',
    'children',
  ]);
  const checkable = () => local.role === 'menuitemcheckbox' || local.role === 'menuitemradio';
  return (
    <div
      role={local.role}
      aria-selected={local.role === 'option' ? !!local.selected : undefined}
      aria-checked={checkable() ? !!local.selected : undefined}
      aria-disabled={local.disabled || undefined}
      class={cx('vui-option', local.active && 'vui-option--active', local.danger && 'vui-option--danger', local.class)}
      {...rest}
    >
      <Show when={local.showCheck}>
        <span class="vui-option__check">
          <Show when={local.selected}>
            <Glyph name="check" />
          </Show>
        </span>
      </Show>
      {renderIcon(local.icon)}
      <span class="vui-option__label">
        <span>{local.label ?? local.children}</span>
        <Show when={local.description}>
          <span class="vui-option__desc">{local.description}</span>
        </Show>
      </span>
      <Show when={local.shortcut}>
        <span class="vui-option__kbd">{local.shortcut}</span>
      </Show>
    </div>
  );
};
