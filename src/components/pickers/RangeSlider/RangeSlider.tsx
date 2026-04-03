import { createMemo, For, type JSX, Show, splitProps } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { AriaFieldProps } from '~/models/Props';
import type { SliderCoreNativeProps } from '~/models/Props';
import { resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';

import styles from './RangeSlider.module.css';

export interface SliderRangeValue {
  min: number;
  max: number;
}

export interface RangeSliderProps extends Omit<SliderCoreNativeProps, 'onChange' | 'value'>, AriaFieldProps {
  id?: string;
  value: SliderRangeValue;
  onChange: (value: SliderRangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: Array<{ value: number; label?: string }>;
}

const RangeSlider = (props: Props<RangeSliderProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, [
    'value',
    'onChange',
    'min',
    'max',
    'step',
    'marks',
    'id',
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
    'aria-errormessage',
    'class',
    'disabled',
    'name',
  ]);
  const minLimit = () => local.min ?? 0;
  const maxLimit = () => local.max ?? 100;
  const step = () => {
    if (local.step === undefined || local.step <= 0) return 1;
    return local.step;
  };

  const clamp = (value: number) => Math.min(maxLimit(), Math.max(minLimit(), value));

  const snap = (value: number) => {
    const stepValue = step();
    const raw = Math.round((value - minLimit()) / stepValue) * stepValue + minLimit();
    return clamp(raw);
  };

  const normalized = createMemo(() => {
    const nextMin = clamp(local.value.min);
    const nextMax = clamp(local.value.max);

    return {
      min: Math.min(nextMin, nextMax),
      max: Math.max(nextMin, nextMax),
    };
  });

  const span = createMemo(() => maxLimit() - minLimit());

  const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

  const leftPercent = createMemo(() => {
    if (span() <= 0) return 0;
    return clampPercent(((normalized().min - minLimit()) / span()) * 100);
  });

  const rightPercent = createMemo(() => {
    if (span() <= 0) return 0;
    return clampPercent(((normalized().max - minLimit()) / span()) * 100);
  });

  const leftRatio = createMemo(() => leftPercent() / 100);
  const rightRatio = createMemo(() => rightPercent() / 100);

  const rangeWidth = createMemo(() => Math.max(0, rightPercent() - leftPercent()));

  const marks = createMemo(() => {
    if (span() <= 0) return [] as Array<{ value: number; label?: string; percent: number }>;

    return (local.marks ?? [])
      .map((mark) => ({ ...mark, value: clamp(mark.value) }))
      .map((mark) => ({
        ...mark,
        percent: clampPercent(((mark.value - minLimit()) / span()) * 100),
      }))
      .sort((a, b) => a.value - b.value);
  });

  const updateMin: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    const next = snap(Number(event.currentTarget.value));
    const current = normalized();
    const nextValue = {
      min: Math.min(next, current.max),
      max: current.max,
    };

    local.onChange(nextValue);
  };

  const updateMax: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    const next = snap(Number(event.currentTarget.value));
    const current = normalized();
    const nextValue = {
      min: current.min,
      max: Math.max(next, current.min),
    };

    local.onChange(nextValue);
  };

  const minThumbAboveMax = createMemo(() => normalized().min >= normalized().max);

  const updateFromTrackPress: JSX.EventHandler<HTMLDivElement, PointerEvent> = (event) => {
    if (local.disabled) return;
    if (event.button !== 0) return;
    if (event.target instanceof HTMLInputElement) return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;

    const ratio = clampPercent(((event.clientX - rect.left) / rect.width) * 100) / 100;
    const rawValue = minLimit() + ratio * (maxLimit() - minLimit());
    const next = snap(rawValue);
    const current = normalized();

    const distanceToMin = Math.abs(next - current.min);
    const distanceToMax = Math.abs(next - current.max);

    if (distanceToMin < distanceToMax) {
      local.onChange({ min: Math.min(next, current.max), max: current.max });
      return;
    }

    if (distanceToMax < distanceToMin) {
      local.onChange({ min: current.min, max: Math.max(next, current.min) });
      return;
    }

    const midpoint = (current.min + current.max) / 2;

    if (next <= midpoint) {
      local.onChange({ min: Math.min(next, current.max), max: current.max });
      return;
    }

    local.onChange({ min: current.min, max: Math.max(next, current.min) });
  };

  return (
    <div
      id={local.id}
      class={classNames(styles.root, local.class, local.disabled && styles.disabled)}
      role="group"
      aria-labelledby={local['aria-labelledby']}
      aria-describedby={local['aria-describedby']}
    >
      <div class={styles.railWrap} onPointerDown={updateFromTrackPress}>
        <div class={styles.rail} />
        <div
          class={styles.range}
          style={{ '--range-left': `${leftPercent()}%`, '--range-width': `${rangeWidth()}%` } as JSX.CSSProperties}
        />
        <Text
          as="span"
          variant="labelMd"
          tone="inverse"
          class={styles.valueLabel}
          style={
            {
              '--range-label-left': `calc((100% - var(--range-thumb-size)) * ${leftRatio()} + (var(--range-thumb-size) / 2))`,
            } as JSX.CSSProperties
          }
        >
          {normalized().min}
        </Text>
        <Text
          as="span"
          variant="labelMd"
          tone="inverse"
          class={styles.valueLabel}
          style={
            {
              '--range-label-left': `calc((100% - var(--range-thumb-size)) * ${rightRatio()} + (var(--range-thumb-size) / 2))`,
            } as JSX.CSSProperties
          }
        >
          {normalized().max}
        </Text>
        <input
          {...rest}
          type="range"
          name={local.name ? `${local.name}Min` : undefined}
          class={classNames(styles.input, styles.minInput, minThumbAboveMax() && styles.onTop)}
          min={minLimit()}
          max={maxLimit()}
          step={step()}
          value={normalized().min}
          disabled={local.disabled}
          onInput={updateMin}
          aria-invalid={resolveAriaInvalid(undefined, local['aria-invalid'])}
          aria-errormessage={local['aria-errormessage']}
          aria-label={ts('rangeSlider.minimum')}
        />
        <input
          {...rest}
          type="range"
          name={local.name ? `${local.name}Max` : undefined}
          class={classNames(styles.input, styles.maxInput)}
          min={minLimit()}
          max={maxLimit()}
          step={step()}
          value={normalized().max}
          disabled={local.disabled}
          onInput={updateMax}
          aria-invalid={resolveAriaInvalid(undefined, local['aria-invalid'])}
          aria-errormessage={local['aria-errormessage']}
          aria-label={ts('rangeSlider.maximum')}
        />
      </div>
      <Show when={marks().length > 0}>
        <div class={styles.marks}>
          <For each={marks()}>
            {(mark) => (
              <div
                class={classNames(
                  styles.mark,
                  mark.value >= normalized().min && mark.value <= normalized().max && styles.markActive,
                )}
                style={{ '--range-mark-left': `${mark.percent}%` } as JSX.CSSProperties}
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

export default RangeSlider;
