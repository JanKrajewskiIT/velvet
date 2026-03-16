import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import SliderField from '../SliderField/SliderField';
import styles from './RangeSlider.module.css';

export interface SliderRangeValue {
  min: number;
  max: number;
}

interface RangeSliderOwnProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  value: SliderRangeValue;
  onChange: (value: SliderRangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
}

const RangeSlider = (props: Props<RangeSliderOwnProps>) => {
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

  const minLimit = () => local.min ?? 0;
  const maxLimit = () => local.max ?? 100;
  const step = () => local.step ?? 1;

  const leftPercent = () => ((local.value.min - minLimit()) / (maxLimit() - minLimit())) * 100;
  const rightPercent = () => ((local.value.max - minLimit()) / (maxLimit() - minLimit())) * 100;

  const handleMinInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const next = Number(e.currentTarget.value);
    local.onChange({
      min: Math.min(next, local.value.max),
      max: local.value.max,
    });
  };

  const handleMaxInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const next = Number(e.currentTarget.value);
    local.onChange({
      min: local.value.min,
      max: Math.max(next, local.value.min),
    });
  };

  return (
    <SliderField
      class={local.class}
      label={local.label}
      value={local.showValue ? `${String(local.value.min)} - ${String(local.value.max)}` : undefined}
    >
      <div class={styles.sliderRoot}>
        <div class={styles.track} />
        <div
          class={styles.range}
          style={{ '--range-left': `${leftPercent()}%`, '--range-width': `${rightPercent() - leftPercent()}%` }}
        />
        <input
          {...rest}
          type="range"
          class={classNames(styles.sliderInput, styles.minThumb, local.disabled && styles.disabled)}
          min={minLimit()}
          max={maxLimit()}
          step={step()}
          value={local.value.min}
          disabled={local.disabled}
          onInput={handleMinInput}
          aria-label={`${local.label ?? 'Range'} minimum`}
        />
        <input
          {...rest}
          type="range"
          class={classNames(styles.sliderInput, styles.maxThumb, local.disabled && styles.disabled)}
          min={minLimit()}
          max={maxLimit()}
          step={step()}
          value={local.value.max}
          disabled={local.disabled}
          onInput={handleMaxInput}
          aria-label={`${local.label ?? 'Range'} maximum`}
        />
      </div>
    </SliderField>
  );
};

export default RangeSlider;
