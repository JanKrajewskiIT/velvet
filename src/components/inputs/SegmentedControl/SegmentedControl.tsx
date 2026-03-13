import { For, type JSX } from 'solid-js';

import type Props from '~/models/Props';

import styles from './SegmentedControl.module.css';

interface SegmentedControlOption {
  value: string;
  label: string | JSX.Element;
  ariaLabel?: string;
}

interface SegmentedControlOwnProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  optionClass?: string;
  activeOptionClass?: string;
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
            class={`${styles.option} ${props.optionClass ?? ''} ${props.value === option.value ? styles.active : ''} ${props.value === option.value ? (props.activeOptionClass ?? '') : ''}`}
            aria-checked={props.value === option.value}
            aria-label={option.ariaLabel}
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
