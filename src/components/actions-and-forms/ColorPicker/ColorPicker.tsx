import { For } from 'solid-js';

import type Props from '~/models/Props';

import styles from './ColorPicker.module.css';

interface ColorPickerProps {
  colors: string[];
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker = (props: Props<ColorPickerProps>) => {
  return (
    <div class={`${styles.colorPicker} ${props.class ?? ''}`} role="radiogroup">
      <For each={props.colors}>
        {(c) => (
          <button
            type="button"
            role="radio"
            aria-checked={props.value === c}
            class={`${styles.colorOption} ${props.value === c ? styles.colorOptionSelected : ''}`}
            style={{ 'background-color': c }}
            onClick={() => props.onChange(c)}
            aria-label={c}
          />
        )}
      </For>
    </div>
  );
};

export default ColorPicker;
