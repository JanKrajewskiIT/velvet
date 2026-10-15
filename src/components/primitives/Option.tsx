import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Glyph, renderIcon } from './Glyph';
import styles from './Option.module.css';
import { Text } from './Text';
import { typographyClass } from './typography';

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
      class={cx(
        typographyClass('body'),
        styles.option,
        local.active && styles.optionVariantActive,
        local.danger && styles.optionVariantDanger,
        local.class,
      )}
      {...rest}
    >
      <Show when={local.showCheck}>
        <span class={styles.optionPartCheck}>
          <Show when={local.selected}>
            <Glyph name="check" />
          </Show>
        </span>
      </Show>
      {renderIcon(local.icon)}
      <span class={styles.optionPartLabel}>
        <Text as="span" variant="body" tone="inherit">
          {local.label ?? local.children}
        </Text>
        <Show when={local.description}>
          <Text as="span" variant="caption" tone="inherit" class={styles.optionPartDesc}>
            {local.description}
          </Text>
        </Show>
      </span>
      <Show when={local.shortcut}>
        <Text as="span" variant="kbd" tone="inherit" class={styles.optionPartKbd}>
          {local.shortcut}
        </Text>
      </Show>
    </div>
  );
};
