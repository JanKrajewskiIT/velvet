import { createMemo, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Chevron } from '../primitives/Chevron';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { Menu, type MenuTriggerProps } from './Menu';
import styles from './MenuChip.module.css';
import type { MenuItem } from './menuItem';

export interface MenuChipOption {
  value: string;
  label: string;
  icon?: string;
}

export interface MenuChipProps {
  /** Dimension name, e.g. "Status". */
  label: string;
  options: Array<string | MenuChipOption>;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Adds an "Any" item that clears. @default true */
  allowClear?: boolean;
  /** @default localized "Any" */
  clearLabel?: string;
  icon?: string;
  class?: string;
}

const normalize = (option: string | MenuChipOption): MenuChipOption =>
  typeof option === 'string' ? { value: option, label: option } : option;

/** Filter chip that opens a single-choice menu: "Status: Open ▾". Tinted when a value is set. Use in filter bars; for always-visible options use ChipGroup. */
export const MenuChip = (props: MenuChipProps) => {
  const p = mergeProps({ allowClear: true, defaultValue: null } satisfies Partial<MenuChipProps>, props);
  const translate = useTranslate();
  const clearLabel = () => p.clearLabel ?? translate('velvet.menus.menuChip.clearLabel');
  const [current, setCurrent] = createControllable<string | null>({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: (next) => p.onValueChange?.(next),
  });
  const options = createMemo(() => p.options.map(normalize));
  const selected = () => options().find((option) => option.value === current());

  const items = createMemo((): MenuItem[] => [
    ...(p.allowClear
      ? [{ label: clearLabel(), checked: current() == null, onSelect: () => setCurrent(null) }, { divider: true }]
      : []),
    ...options().map((option) => ({
      label: option.label,
      icon: option.icon,
      checked: current() === option.value,
      onSelect: () => setCurrent(option.value),
    })),
  ]);

  const chip = (trigger: MenuTriggerProps) => (
    <button
      {...trigger}
      type="button"
      class={cx(typographyClass('button-sm'), styles.chip, styles.chipVariantMenu, selected() && styles.chipVariantOn)}
    >
      <Show when={p.icon}>{(icon) => <Glyph name={icon()} />}</Show>
      <Text as="span" variant="label" tone="inherit" class={styles.chipPartKey}>
        {p.label}
        {selected() ? ':' : ''}
      </Text>
      <Show when={selected()}>
        {(option) => (
          <Text as="span" variant="label" tone="inherit">
            {option().label}
          </Text>
        )}
      </Show>
      <Chevron class={styles.chipPartCaret} />
    </button>
  );

  return <Menu items={items()} class={p.class} trigger={chip} />;
};
