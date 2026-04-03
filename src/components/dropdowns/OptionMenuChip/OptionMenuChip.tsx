import { FiChevronDown } from 'solid-icons/fi';
import { createMemo, createUniqueId, For, Show, splitProps } from 'solid-js';

import DropdownOption, {
  type DropdownOptionProps,
} from '~/components/dropdowns/Dropdown/DropdownOption/DropdownOption';
import DropdownSurface from '~/components/dropdowns/Dropdown/DropdownSurface/DropdownSurface';
import Text from '~/components/typography/Text/Text';
import useDropdownPanel from '~/hooks/useDropdownPanel';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';
import { getContrastTextColor } from '~/utils/color';

import styles from './OptionMenuChip.module.css';
import chipBaseStyles from './OptionMenuChipBase.module.css';
import chipVariantStyles from './OptionMenuChipChip.module.css';

type OptionMenuChipVariant = 'info' | 'warning' | 'success' | 'error' | 'primary' | 'primaryOutline' | 'subtle';

export interface OptionMenuChipOption {
  value: string;
  label: string;
  variant?: OptionMenuChipVariant;
  color?: string;
  tone?: DropdownOptionProps['tone'];
  disabled?: boolean;
}

interface OptionMenuChipProps extends Omit<ButtonCoreNativeProps, 'children' | 'value'> {
  value: string;
  options: readonly OptionMenuChipOption[];
  menuLabel: string;
  size?: 'sm' | 'md';
  filled?: boolean;
  align?: 'left' | 'right';
  onChange: (value: string) => void;
}

const optionMenuVariantClassByValue: Record<OptionMenuChipVariant, string | undefined> = {
  info: chipVariantStyles.info,
  warning: chipVariantStyles.warning,
  success: chipVariantStyles.success,
  error: chipVariantStyles.error,
  primary: chipVariantStyles.primary,
  primaryOutline: chipVariantStyles.primaryOutline,
  subtle: chipVariantStyles.subtle,
};

const optionMenuFilledVariantClassByValue: Record<OptionMenuChipVariant, string | undefined> = {
  info: chipVariantStyles.filledInfo,
  warning: chipVariantStyles.filledWarning,
  success: chipVariantStyles.filledSuccess,
  error: chipVariantStyles.filledError,
  primary: undefined,
  primaryOutline: chipVariantStyles.filledPrimaryOutline,
  subtle: chipVariantStyles.filledSubtle,
};

const OptionMenuChip = (props: Props<OptionMenuChipProps>) => {
  const { ts } = useI18n();
  const menuId = createUniqueId();
  const [local, rest] = splitProps(props, [
    'value',
    'options',
    'menuLabel',
    'size',
    'filled',
    'align',
    'onChange',
    'disabled',
    'class',
  ]);

  let wrapperRef: HTMLDivElement | undefined;
  let triggerRef: HTMLButtonElement | undefined;
  let panelRef: HTMLDivElement | undefined;

  const dropdown = useDropdownPanel({
    rootRef: () => wrapperRef,
    triggerRef: () => triggerRef,
    panelRef: () => panelRef,
    focusTriggerOnTab: true,
    isInteractive: () => !local.disabled,
  });

  const selectedOption = createMemo(() => local.options.find((option) => option.value === local.value));
  const displayLabel = createMemo(() => selectedOption()?.label ?? ts('common.selectEllipsis'));
  const isCustomColor = createMemo(() => Boolean(selectedOption()?.color));
  const isFilled = createMemo(() => local.filled ?? true);
  const selectedVariant = createMemo<OptionMenuChipVariant>(() => selectedOption()?.variant ?? 'primary');

  const triggerClass = createMemo(() =>
    classNames(
      chipBaseStyles.chip,
      chipBaseStyles.interactive,
      local.size === 'sm' && chipBaseStyles.sm,
      isCustomColor() && chipBaseStyles.customColor,
      !isCustomColor() && optionMenuVariantClassByValue[selectedVariant()],
      !isCustomColor() && isFilled() && chipBaseStyles.filled,
      !isCustomColor() && isFilled() && optionMenuFilledVariantClassByValue[selectedVariant()],
      styles.trigger,
    ),
  );

  const inlineStyles = createMemo(() => {
    const color = selectedOption()?.color;
    if (!color) return undefined;

    return {
      '--chip-border-color': color,
      '--chip-text-color': isFilled() ? getContrastTextColor(color) : color,
      '--chip-background-color': isFilled() ? color : 'transparent',
    };
  });

  const toggle = () => {
    if (local.disabled) return;
    dropdown.toggle();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (local.disabled) return;
    dropdown.openFromKeyboard(event, { ignoreWhenOpen: true });
  };

  const handleSelect = (option: OptionMenuChipOption) => {
    if (option.disabled || option.value === local.value) return;
    local.onChange(option.value);
    dropdown.close();
  };

  return (
    <div ref={wrapperRef} class={classNames(styles.wrapper, local.class)}>
      <button
        {...rest}
        ref={triggerRef}
        type="button"
        class={triggerClass()}
        style={inlineStyles()}
        disabled={local.disabled}
        aria-label={ts('dropdown.openMenu')}
        aria-haspopup="menu"
        aria-expanded={dropdown.open()}
        aria-controls={dropdown.open() ? menuId : undefined}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
      >
        <Text as="span" variant="labelMd" tone="inherit" class={styles.triggerText}>
          {displayLabel()}
        </Text>
        <span class={classNames(styles.chevron, dropdown.open() && styles.chevronOpen)} aria-hidden="true">
          <FiChevronDown />
        </span>
      </button>
      <Show when={dropdown.open()}>
        <DropdownSurface
          ref={panelRef}
          id={menuId}
          class={styles.menu}
          align={local.align ?? 'left'}
          origin="topLeft"
          role="menu"
          aria-label={local.menuLabel}
          tabIndex={-1}
          scrollable={false}
          onKeyDown={dropdown.handlePanelKeyDown}
        >
          <For each={local.options}>
            {(option) => {
              const selected = () => option.value === local.value;
              return (
                <DropdownOption
                  role="menuitemradio"
                  aria-checked={selected()}
                  selected={selected()}
                  disabled={selected() || option.disabled}
                  label={option.label}
                  tone={option.tone ?? (selected() ? 'primary' : 'default')}
                  onClick={() => handleSelect(option)}
                />
              );
            }}
          </For>
        </DropdownSurface>
      </Show>
    </div>
  );
};

export type { OptionMenuChipProps };
export default OptionMenuChip;
