import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph, renderIcon } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './Chip.module.css';

const CHECKABLE_ROLES: readonly (string | undefined)[] = ['radio', 'checkbox', 'option'];

export interface ChipProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** Pressed state. Omit for a plain action chip (no `aria-pressed`). */
  selected?: boolean;
  /** Leading glyph name or node — hidden while the check shows. */
  icon?: JSX.Element;
  /** Trailing count pill. */
  count?: number | string;
  /** Spring-in check on select. @default true */
  check?: boolean;
  /** Label colour — leading swatch that fills with a check when selected; tints border and ground. Any CSS colour. */
  color?: string;
  /** Dashed outline — the "create new" chip at the end of a set. */
  dashed?: boolean;
  /** sm 28 · md 32. @default 'md' */
  size?: 'sm' | 'md';
  /** `radio` / `checkbox` / `option` write `aria-checked` instead of `aria-pressed`. */
  role?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['role'];
  style?: JSX.CSSProperties;
}

/**
 * Selectable pill — one option of a filter / tag set. ChipGroup renders it.
 * For a removable token use Tag; for a menu trigger use MenuChip.
 */
export const Chip = (props: ChipProps) => {
  const merged = mergeProps({ dashed: false, size: 'md', check: true } satisfies ChipProps, props);
  const [local, rest] = splitProps(merged, [
    'selected',
    'icon',
    'count',
    'color',
    'dashed',
    'size',
    'check',
    'class',
    'style',
    'children',
  ]);
  const on = () => !!local.selected;
  const showsCheck = () => local.check && on() && !local.color;
  const selectionState = () => {
    if (local.selected === undefined) return {};
    return CHECKABLE_ROLES.includes(rest.role) ? { 'aria-checked': on() } : { 'aria-pressed': on() };
  };
  return (
    <button
      type="button"
      {...rest}
      {...selectionState()}
      class={cx(
        typographyClass(local.size === 'sm' ? 'label-sm' : 'button-sm'),
        styles.chip,
        local.size === 'sm' && styles.chipVariantSm,
        on() && styles.chipVariantOn,
        local.color && styles.chipVariantColor,
        local.dashed && styles.chipVariantDashed,
        local.class,
      )}
      style={local.color ? { ...local.style, '--chip-c': local.color } : local.style}
    >
      <Show
        when={local.color}
        fallback={
          <Show when={local.check}>
            <span class={styles.chipPartCheck} aria-hidden="true">
              <Glyph name="check" />
            </span>
          </Show>
        }
      >
        <span class={styles.chipPartSwatch} aria-hidden="true">
          <Show when={on()}>
            <Glyph name="check" />
          </Show>
        </span>
      </Show>
      <Show when={!showsCheck()}>{renderIcon(local.icon)}</Show>
      {local.children}
      <Show when={local.count != null}>
        <Text as="span" variant="kbd" tone="inherit" class={styles.chipPartCount}>
          {local.count}
        </Text>
      </Show>
    </button>
  );
};
