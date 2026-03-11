import { For, type JSX } from 'solid-js';

import type Props from '~/models/Props';

import styles from './SegmentedControl.module.css';

interface SegmentedControlOption {
  value: string;
  label: string | JSX.Element;
}

interface SegmentedControlOwnProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

const SegmentedControl = (props: Props<SegmentedControlOwnProps>) => {
  const size = () => props.size ?? 'md';

  const handleSelect = (value: string) => {
    if (!props.disabled) props.onChange(value);
  };

  return (
    <div
      class={`${styles.container} ${styles[size()]} ${props.disabled ? styles.disabled : ''} ${props.class ?? ''}`}
      role="radiogroup"
    >
      <For each={props.options}>
        {(option) => (
          <button
            type="button"
            role="radio"
            class={`${styles.option} ${props.value === option.value ? styles.active : ''}`}
            aria-checked={props.value === option.value}
            disabled={props.disabled}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </button>
        )}
      </For>
    </div>
  );
};

export default SegmentedControl;
