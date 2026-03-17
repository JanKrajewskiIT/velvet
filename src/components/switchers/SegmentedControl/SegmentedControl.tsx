import { createMemo, For, type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './SegmentedControl.module.css';

export interface SegmentedControlOption {
  value: string;
  label: string | JSX.Element;
  ariaLabel?: string;
  disabled?: boolean;
}

interface SegmentedControlOwnProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  optionClass?: string;
  activeOptionClass?: string;
}

const SegmentedControl = (props: Props<SegmentedControlOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'options',
    'value',
    'onChange',
    'size',
    'disabled',
    'optionClass',
    'activeOptionClass',
    'class',
  ]);

  const optionRefs: (HTMLButtonElement | undefined)[] = [];

  const size = () => local.size ?? 'md';

  const selectedIndex = createMemo(() => {
    return local.options.findIndex((option) => option.value === local.value);
  });

  const fallbackIndex = createMemo(() => {
    return local.options.findIndex((option) => !option.disabled);
  });

  const tabStopIndex = createMemo(() => {
    const selected = selectedIndex();
    if (selected >= 0 && !local.options[selected]?.disabled) return selected;
    return fallbackIndex();
  });

  const isOptionDisabled = (option: SegmentedControlOption) => Boolean(local.disabled || option.disabled);

  const handleSelect = (value: string, disabled?: boolean) => {
    if (local.disabled || disabled) return;
    local.onChange(value);
  };

  const findNextEnabledIndex = (startIndex: number, step: 1 | -1) => {
    const optionsCount = local.options.length;
    for (let offset = 1; offset <= optionsCount; offset += 1) {
      const candidate = (startIndex + step * offset + optionsCount) % optionsCount;
      if (!local.options[candidate]?.disabled) return candidate;
    }

    return startIndex;
  };

  const focusAndSelect = (index: number) => {
    optionRefs[index]?.focus();
    const option = local.options[index];
    if (!option) return;
    handleSelect(option.value, option.disabled);
  };

  const handleKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (event) => {
    if (local.disabled) return;

    const currentIndex = Number(event.currentTarget.dataset.index);
    if (Number.isNaN(currentIndex)) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusAndSelect(findNextEnabledIndex(currentIndex, 1));
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusAndSelect(findNextEnabledIndex(currentIndex, -1));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      focusAndSelect(findNextEnabledIndex(-1, 1));
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusAndSelect(findNextEnabledIndex(0, -1));
    }
  };

  return (
    <div
      {...rest}
      class={classNames(styles.container, styles[size()], local.disabled && styles.disabled, local.class)}
      role="radiogroup"
    >
      <For each={local.options}>
        {(option, index) => (
          <button
            class={classNames(
              styles.option,
              local.optionClass,
              local.value === option.value && styles.active,
              local.value === option.value && local.activeOptionClass
            )}
            type="button"
            role="radio"
            aria-checked={local.value === option.value}
            aria-label={option.ariaLabel}
            aria-disabled={isOptionDisabled(option)}
            disabled={isOptionDisabled(option)}
            tabIndex={tabStopIndex() === index() ? 0 : -1}
            data-index={index()}
            ref={(element) => {
              optionRefs[index()] = element;
            }}
            onKeyDown={handleKeyDown}
            onClick={() => handleSelect(option.value, option.disabled)}
          >
            {option.label}
          </button>
        )}
      </For>
    </div>
  );
};

export default SegmentedControl;
