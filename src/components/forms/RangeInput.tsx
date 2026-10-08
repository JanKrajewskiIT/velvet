import { createUniqueId, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { FieldHint, FieldLabel } from '../primitives/Field';
import { RangeBound } from './RangeBound';
import { isInverted, type RangeBoundKey, type RangeValue } from './rangeValue';
import { Select } from './Select';
import type { SelectOption } from './selectOption';

export interface RangeInputProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  required?: boolean;
  /** Controlled value. */
  value?: RangeValue;
  /** @default {} */
  defaultValue?: RangeValue;
  onValueChange?: (value: RangeValue) => void;
  /** Clamp for both bounds. @default 0 */
  min?: number;
  max?: number;
  /** Text affix inside each bound, e.g. "€" or "m²". Use instead of `unitOptions` for a fixed unit. */
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  /** Placeholder and accessible name of the lower bound. @default localized "From" */
  fromLabel?: string;
  /** Placeholder and accessible name of the upper bound. @default localized "To" */
  toLabel?: string;
  /** @default localized "The lower bound is greater than the upper bound" */
  invertedError?: string;
  /** Inline unit select, e.g. currencies. */
  unitOptions?: ReadonlyArray<string | SelectOption>;
  unit?: string;
  defaultUnit?: string;
  onUnitChange?: (unit: string) => void;
  /** @default localized "Currency" */
  unitLabel?: string;
  /** Inline period select, e.g. Hourly / Monthly / Yearly. */
  periodOptions?: ReadonlyArray<string | SelectOption>;
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (period: string) => void;
  /** @default localized "Period" */
  periodLabel?: string;
  /** Number grouping locale, e.g. 'pl'. */
  locale?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  class?: string;
}

/** From–to numeric field — salary, budget, price filter. Both bounds share one label and error lane; either may stay empty (open range). Optional unit and period selects turn it into a money range. */
export const RangeInput = (props: RangeInputProps) => {
  const p = mergeProps({ defaultValue: {}, min: 0, size: 'md' } satisfies Partial<RangeInputProps>, props);
  const translate = useTranslate();
  const fromLabel = () => p.fromLabel ?? translate('velvet.forms.rangeInput.fromLabel');
  const toLabel = () => p.toLabel ?? translate('velvet.forms.rangeInput.toLabel');
  const unitLabel = () => p.unitLabel ?? translate('velvet.forms.rangeInput.unitLabel');
  const periodLabel = () => p.periodLabel ?? translate('velvet.forms.rangeInput.periodLabel');
  const autoId = createUniqueId();
  const id = () => p.id ?? autoId;
  const hintId = () => `${id()}-hint`;

  const [range, setRange] = createControllable<RangeValue>({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: (next) => p.onValueChange?.(next),
  });
  const [unit, setUnit] = createControllable({
    value: () => p.unit,
    defaultValue: p.defaultUnit ?? '',
    onChange: (next) => p.onUnitChange?.(next),
  });
  const [period, setPeriod] = createControllable({
    value: () => p.period,
    defaultValue: p.defaultPeriod ?? '',
    onChange: (next) => p.onPeriodChange?.(next),
  });

  const message = () =>
    p.error ||
    (isInverted(range()) ? (p.invertedError ?? translate('velvet.forms.rangeInput.invertedError')) : undefined);
  const groupLabel = () => (typeof p.label === 'string' ? p.label : undefined);
  const commit = (key: RangeBoundKey) => (bound: number | null) => setRange({ ...range(), [key]: bound });
  const shared = () => ({
    locale: p.locale,
    min: p.min,
    max: p.max,
    size: p.size,
    disabled: p.disabled,
    invalid: !!message(),
    prefix: p.prefix,
    suffix: p.suffix,
    describedBy: message() || p.hint ? hintId() : undefined,
  });

  return (
    <div class={cx('vui-field', 'vui-range', p.class)}>
      <Show when={p.label}>
        <FieldLabel htmlFor={`${id()}-min`} optional={p.optional} required={p.required}>
          {p.label}
        </FieldLabel>
      </Show>
      <div class="vui-range__row" role="group" aria-label={groupLabel()}>
        <div class="vui-range__bounds">
          <RangeBound
            {...shared()}
            id={`${id()}-min`}
            value={range().min}
            onCommit={commit('min')}
            placeholder={fromLabel()}
            ariaLabel={p.label ? undefined : fromLabel()}
          />
          <span class="vui-range__sep" aria-hidden="true">
            –
          </span>
          <RangeBound
            {...shared()}
            value={range().max}
            onCommit={commit('max')}
            placeholder={toLabel()}
            ariaLabel={groupLabel() ? `${groupLabel()}, ${toLabel()}` : toLabel()}
          />
        </div>
        <Show when={p.unitOptions}>
          {(options) => (
            <Select
              class="vui-range__select"
              size={p.size}
              disabled={p.disabled}
              options={options()}
              value={unit()}
              placeholder={unitLabel()}
              aria-label={unitLabel()}
              onValueChange={setUnit}
            />
          )}
        </Show>
        <Show when={p.periodOptions}>
          {(options) => (
            <Select
              class="vui-range__select vui-range__select--wide"
              size={p.size}
              disabled={p.disabled}
              options={options()}
              value={period()}
              placeholder={periodLabel()}
              aria-label={periodLabel()}
              onValueChange={setPeriod}
            />
          )}
        </Show>
      </div>
      <Show when={message() || p.hint}>
        <FieldHint id={hintId()} error={!!message()}>
          {message() || p.hint}
        </FieldHint>
      </Show>
    </div>
  );
};
