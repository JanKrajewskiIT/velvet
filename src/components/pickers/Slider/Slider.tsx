import { createMemo, For, type JSX, Show, splitProps } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import type { AriaFieldProps } from '~/models/Props';
import type { SliderCoreNativeProps } from '~/models/Props';
import { resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';

import styles from './Slider.module.css';

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderProps extends Omit<SliderCoreNativeProps, 'onChange' | 'value'>, AriaFieldProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: SliderMark[];
}

const Slider = (props: Props<SliderProps>) => {
  const [local, rest] = splitProps(props, [
    'id',
    'name',
    'value',
    'onChange',
    'min',
    'max',
    'step',
    'marks',
    'class',
    'disabled',
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
    'aria-errormessage',
  ]);

  const min = () => local.min ?? 0;
  const max = () => local.max ?? 100;
  const step = () => {
    if (local.step === undefined || local.step <= 0) return 1;
    return local.step;
  };

  const clamp = (value: number) => Math.min(max(), Math.max(min(), value));

  const snap = (value: number) => {
    const stepValue = step();
    const raw = Math.round((value - min()) / stepValue) * stepValue + min();
    return clamp(raw);
  };

  const normalizedValue = createMemo(() => snap(local.value));

  const percentage = createMemo(() => {
    const span = max() - min();
    if (span <= 0) return 0;
    return Math.min(100, Math.max(0, ((normalizedValue() - min()) / span) * 100));
  });

  const thumbRatio = createMemo(() => percentage() / 100);

  const marks = createMemo(() => {
    const span = max() - min();
    if (span <= 0) return [] as Array<SliderMark & { percent: number }>;

    return (local.marks ?? [])
      .map((mark) => ({ ...mark, value: clamp(mark.value) }))
      .map((mark) => ({
        ...mark,
        percent: Math.min(100, Math.max(0, ((mark.value - min()) / span) * 100)),
      }))
      .sort((a, b) => a.value - b.value);
  });

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    const next = snap(Number(event.currentTarget.value));
    local.onChange(next);
  };

  return (
    <div class={classNames(styles.root, local.class, local.disabled && styles.disabled)}>
      <div class={styles.railWrap}>
        <div class={styles.rail} />
        <div class={styles.track} style={{ '--slider-fill': `${percentage()}%` }} />
        <Text
          as="span"
          variant="labelMd"
          tone="inverse"
          class={styles.valueLabel}
          style={{
            '--slider-value-left': `calc((100% - var(--slider-thumb-size)) * ${thumbRatio()} + (var(--slider-thumb-size) / 2))`,
          }}
        >
          {normalizedValue()}
        </Text>
        <input
          {...rest}
          id={local.id}
          type="range"
          name={local.name}
          class={styles.input}
          min={min()}
          max={max()}
          step={step()}
          value={normalizedValue()}
          disabled={local.disabled}
          aria-labelledby={local['aria-labelledby']}
          aria-describedby={local['aria-describedby']}
          aria-invalid={resolveAriaInvalid(undefined, local['aria-invalid'])}
          aria-errormessage={local['aria-errormessage']}
          onInput={handleInput}
        />
      </div>
      <Show when={marks().length > 0}>
        <div class={styles.marks}>
          <For each={marks()}>
            {(mark) => (
              <div
                class={classNames(styles.mark, mark.value <= normalizedValue() && styles.markActive)}
                style={{ '--slider-mark-left': `${mark.percent}%` }}
              >
                <span class={styles.markTick} />
                <Show when={mark.label}>
                  <Text as="span" variant="caption" tone="muted" class={styles.markLabel}>
                    {mark.label}
                  </Text>
                </Show>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default Slider;
