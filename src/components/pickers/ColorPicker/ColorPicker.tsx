import { createMemo, For, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { AriaFieldProps } from '~/models/Props';
import { resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';

import styles from './ColorPicker.module.css';

interface ColorPickerProps extends AriaFieldProps {
  id?: string;
  colors: string[];
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

const ColorPicker = (props: Props<ColorPickerProps>) => {
  const [local, rest] = splitProps(props, [
    'id',
    'colors',
    'value',
    'onChange',
    'disabled',
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
    'class',
  ]);

  const optionRefs: (HTMLButtonElement | undefined)[] = [];

  const selectedIndex = createMemo(() => local.colors.findIndex((color) => color === local.value));
  const hasSelectedColor = createMemo(() => selectedIndex() >= 0);
  const tabStopIndex = createMemo(() => {
    const selected = selectedIndex();
    return selected >= 0 ? selected : 0;
  });

  const focusAndSelect = (index: number) => {
    const color = local.colors[index];
    if (color === undefined || local.disabled) return;
    optionRefs[index]?.focus();
    local.onChange(color);
  };

  const handleKeyDown = (event: KeyboardEvent, currentIndex: number) => {
    if (local.colors.length === 0 || local.disabled) return;

    const lastIndex = local.colors.length - 1;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = Math.min(lastIndex, currentIndex + 1);
      focusAndSelect(nextIndex);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const nextIndex = Math.max(0, currentIndex - 1);
      focusAndSelect(nextIndex);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      focusAndSelect(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusAndSelect(lastIndex);
    }
  };

  return (
    <div
      {...rest}
      id={local.id}
      class={classNames(styles.colorPicker, local.disabled && styles.disabled, local.class)}
      role="radiogroup"
      aria-labelledby={local['aria-labelledby']}
      aria-describedby={local['aria-describedby']}
      aria-invalid={resolveAriaInvalid(undefined, local['aria-invalid'])}
      aria-errormessage={props['aria-errormessage']}
    >
      <For each={local.colors}>
        {(c, index) => (
          <button
            type="button"
            role="radio"
            aria-checked={local.value === c}
            aria-disabled={local.disabled}
            disabled={local.disabled}
            tabIndex={tabStopIndex() === index() || (!hasSelectedColor() && index() === 0) ? 0 : -1}
            class={classNames(styles.colorOption, local.value === c && styles.colorOptionSelected)}
            style={{ '--swatch-color': c }}
            ref={(element) => {
              optionRefs[index()] = element;
            }}
            onClick={() => local.onChange(c)}
            onKeyDown={(event) => handleKeyDown(event, index())}
            aria-label={c}
          />
        )}
      </For>
    </div>
  );
};

export default ColorPicker;
