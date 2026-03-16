import { For, type JSX } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ColorPicker.module.css';

interface ColorPickerProps {
  colors: string[];
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker = (props: Props<ColorPickerProps>) => {
  const hasSelectedColor = () => props.colors.includes(props.value);

  const handleKeyDown = (event: KeyboardEvent, currentIndex: number) => {
    if (props.colors.length === 0) return;

    const lastIndex = props.colors.length - 1;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = Math.min(lastIndex, currentIndex + 1);
      const nextColor = props.colors[nextIndex];
      if (nextColor !== undefined) props.onChange(nextColor);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const nextIndex = Math.max(0, currentIndex - 1);
      const nextColor = props.colors[nextIndex];
      if (nextColor !== undefined) props.onChange(nextColor);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      const firstColor = props.colors[0];
      if (firstColor !== undefined) props.onChange(firstColor);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      const lastColor = props.colors[lastIndex];
      if (lastColor !== undefined) props.onChange(lastColor);
    }
  };

  return (
    <div class={classNames(styles.colorPicker, props.class)} role="radiogroup">
      <For each={props.colors}>
        {(c, index) => (
          <button
            type="button"
            role="radio"
            aria-checked={props.value === c}
            tabIndex={props.value === c || (!hasSelectedColor() && index() === 0) ? 0 : -1}
            class={classNames(styles.colorOption, props.value === c && styles.colorOptionSelected)}
            style={{ '--swatch-color': c } as JSX.CSSProperties}
            onClick={() => props.onChange(c)}
            onKeyDown={(event) => handleKeyDown(event, index())}
            aria-label={c}
          />
        )}
      </For>
    </div>
  );
};

export default ColorPicker;
