import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { callHandler } from '../../utils/callHandler';
import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { Glyph, renderIcon } from './Glyph';
import styles from './Option.module.css';
import { Text } from './Text';
import { typographyClass } from './typography';

export interface OptionProps extends HtmlProps<HTMLElement> {
  /** @default 'div' */
  as?: ElementTag;
  type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'];
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
  /** Show a check at the end of a selected option. */
  checkEnd?: boolean;
  leading?: JSX.Element;
  trailing?: JSX.Element;
  /** Menu item roles inside menus; `radio` inside a radiogroup. @default 'option' */
  role?: 'option' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'radio';
}

/** One row inside any listbox or menu — icon, label, description, shortcut, check and its states. */
export const Option = (props: OptionProps) => {
  const merged = mergeProps({ as: 'div', role: 'option' } satisfies OptionProps, props);
  const [local, rest] = splitProps(merged, [
    'as',
    'type',
    'icon',
    'label',
    'description',
    'shortcut',
    'selected',
    'active',
    'danger',
    'disabled',
    'showCheck',
    'checkEnd',
    'leading',
    'trailing',
    'role',
    'onClick',
    'class',
    'children',
  ]);
  const checkable = () => local.role === 'menuitemcheckbox' || local.role === 'menuitemradio' || local.role === 'radio';
  return (
    <Polymorphic
      {...rest}
      tag={local.as}
      type={local.as === 'button' ? (local.type ?? 'button') : local.type}
      disabled={local.as === 'button' ? local.disabled : undefined}
      role={local.role}
      aria-selected={local.role === 'option' ? !!local.selected : undefined}
      aria-checked={checkable() ? !!local.selected : undefined}
      aria-disabled={local.disabled || undefined}
      onClick={(event: MouseEvent & { currentTarget: HTMLElement; target: Element }) => {
        if (local.disabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        callHandler(local.onClick, event);
      }}
      class={cx(
        typographyClass('body'),
        styles.option,
        local.active && styles.optionVariantActive,
        local.danger && styles.optionVariantDanger,
        local.class,
      )}
    >
      <Show when={local.showCheck}>
        <span class={styles.optionPartCheck}>
          <Show when={local.selected}>
            <Glyph name="check" />
          </Show>
        </span>
      </Show>
      {local.leading}
      {renderIcon(local.icon)}
      <span class={styles.optionPartLabel}>
        <Text as="span" variant={local.role === 'radio' && local.selected ? 'label' : 'body'} tone="inherit">
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
      {local.trailing}
      <Show when={local.checkEnd && local.selected}>
        <Glyph name="check" class={styles.optionPartCheckEnd} />
      </Show>
    </Polymorphic>
  );
};
