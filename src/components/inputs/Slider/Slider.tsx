import { type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Slider.module.css';

interface SliderOwnProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
}

const Slider = (props: Props<SliderOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'value',
    'onChange',
    'min',
    'max',
    'step',
    'label',
    'showValue',
    'class',
    'disabled',
  ]);

  const min = () => local.min ?? 0;
  const max = () => local.max ?? 100;
  const step = () => local.step ?? 1;

  const percentage = () => ((local.value - min()) / (max() - min())) * 100;

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    local.onChange(Number(e.currentTarget.value));
  };

  return (
    <div class={`${styles.wrapper} ${local.class ?? ''}`}>
      <Show when={local.label || local.showValue}>
        <div class={styles.header}>
          <Show when={local.label}>
            <label class={styles.label}>{local.label}</label>
          </Show>
          <Show when={local.showValue}>
            <span class={styles.value}>{local.value}</span>
          </Show>
        </div>
      </Show>
      <input
        {...rest}
        type="range"
        class={`${styles.slider} ${local.disabled ? styles.disabled : ''}`}
        min={min()}
        max={max()}
        step={step()}
        value={local.value}
        disabled={local.disabled}
        onInput={handleInput}
        style={{ '--fill-percent': `${percentage()}%` }}
      />
    </div>
  );
};

export default Slider;
