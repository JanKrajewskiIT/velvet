import { FiChevronDown } from 'solid-icons/fi';
import { createMemo, createUniqueId, For, Show, splitProps } from 'solid-js';

import DropdownOption, {
  type DropdownOptionProps,
} from '~/components/dropdowns/Dropdown/DropdownOption/DropdownOption';
import DropdownSurface from '~/components/dropdowns/Dropdown/DropdownSurface/DropdownSurface';
import Text from '~/components/typography/Text/Text';
import useDropdownPanel from '~/hooks/useDropdownPanel';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';
import { getContrastTextColor } from '~/utils/color';

import chipStyles from '../../feedback/Chip/Chip.module.css';
import styles from './StatusMenuChip.module.css';

type StatusMenuChipVariant = 'info' | 'warning' | 'success' | 'error' | 'primary' | 'primaryOutline' | 'subtle';

export interface StatusMenuChipOption {
  value: string;
  label: string;
  variant?: StatusMenuChipVariant;
  color?: string;
  tone?: DropdownOptionProps['tone'];
  disabled?: boolean;
}

interface StatusMenuChipProps extends Omit<ButtonCoreNativeProps, 'children' | 'value'> {
  value: string;
  options: readonly StatusMenuChipOption[];
  menuLabel: string;
  triggerLabel?: string;
  placeholderLabel?: string;
  size?: 'sm' | 'md';
  filled?: boolean;
  align?: 'left' | 'right';
  onChange: (value: string) => void;
}

const StatusMenuChip = (props: Props<StatusMenuChipProps>) => {
  const menuId = createUniqueId();
  const [local, rest] = splitProps(props, [
    'value',
    'options',
    'menuLabel',
    'triggerLabel',
    'placeholderLabel',
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
  const displayLabel = createMemo(() => selectedOption()?.label ?? local.placeholderLabel ?? local.value);
  const isCustomColor = createMemo(() => Boolean(selectedOption()?.color));
  const isFilled = createMemo(() => local.filled ?? true);

  const triggerClass = createMemo(() =>
    classNames(
      chipStyles.chip,
      chipStyles.interactive,
      local.size === 'sm' && chipStyles.sm,
      isCustomColor() && chipStyles.customColor,
      !isCustomColor() && chipStyles[selectedOption()?.variant ?? 'primary'],
      !isCustomColor() && isFilled() && chipStyles.filled,
      styles.trigger
    )
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

  const handleSelect = (option: StatusMenuChipOption) => {
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
        aria-label={local.triggerLabel ?? displayLabel()}
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

export type { StatusMenuChipProps };
export default StatusMenuChip;
