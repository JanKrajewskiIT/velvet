import { createMemo, createSignal, createUniqueId, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { numberRange } from '../../utils/decimalValue';
import { FieldHint } from '../primitives/FieldHint';
import { FieldLabel } from '../primitives/FieldLabel';
import { Text } from '../primitives/Text';
import { createFormValidation } from './createFormValidation';
import type { FormControlProps } from './formControl';
import { FormValue } from './FormValue';
import { RangeBound } from './RangeBound';
import styles from './RangeInput.module.css';
import { isInverted, type RangeBoundKey, type RangeValue } from './rangeValue';
import { Select } from './Select';
import type { SelectOption } from './selectOption';

export interface RangeInputProps extends FormControlProps {
  unitName?: string;
  periodName?: string;
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
  const validation = createFormValidation();
  const [invalidBounds, setInvalidBounds] = createSignal({ min: false, max: false });
  const [resetKey, setResetKey] = createSignal(0);
  const limits = createMemo(() => numberRange(p.min, p.max));
  let firstInput: HTMLInputElement | undefined;

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
  const invalidNumber = () =>
    invalidBounds().min ||
    invalidBounds().max ||
    [range().min, range().max].some(
      (value) => value != null && (!Number.isFinite(value) || value < limits().min || value > limits().max),
    );

  const message = () =>
    p.error ||
    (invalidNumber() ? translate('velvet.forms.numberInput.invalidNumber') : undefined) ||
    (isInverted(range()) ? (p.invertedError ?? translate('velvet.forms.rangeInput.invertedError')) : undefined);
  const groupLabel = () => (typeof p.label === 'string' ? p.label : undefined);
  const commit = (key: RangeBoundKey) => (bound: number | null) => setRange({ ...range(), [key]: bound });
  const shared = () => ({
    locale: p.locale,
    min: limits().min,
    max: limits().max,
    size: p.size,
    disabled: p.disabled,
    invalid: !!message() || validation.invalid(),
    prefix: p.prefix,
    suffix: p.suffix,
    describedBy: validation.describedBy(message() || p.hint ? hintId() : undefined),
    resetKey: resetKey(),
  });

  return (
    <div class={cx(styles.field, 'vui-range', p.class)}>
      <Show when={p.label}>
        <FieldLabel id={`${id()}-label`} htmlFor={`${id()}-min`} optional={p.optional} required={p.required}>
          {p.label}
        </FieldLabel>
      </Show>
      <div
        class={styles.rangePartRow}
        role="group"
        aria-label={p['aria-label'] ?? groupLabel()}
        aria-labelledby={p['aria-labelledby'] ?? (p.label ? `${id()}-label` : undefined)}
      >
        <div class={styles.rangePartBounds}>
          <RangeBound
            {...shared()}
            ref={(element) => {
              firstInput = element;
            }}
            onValidityChange={(invalid) => setInvalidBounds((current) => ({ ...current, min: invalid }))}
            id={`${id()}-min`}
            value={range().min}
            onCommit={commit('min')}
            placeholder={fromLabel()}
            ariaLabel={p.label ? undefined : fromLabel()}
          />
          <Text as="span" variant="body" tone="inherit" class={styles.rangePartSep} aria-hidden="true">
            –
          </Text>
          <RangeBound
            {...shared()}
            onValidityChange={(invalid) => setInvalidBounds((current) => ({ ...current, max: invalid }))}
            value={range().max}
            onCommit={commit('max')}
            placeholder={toLabel()}
            ariaLabel={groupLabel() ? `${groupLabel()}, ${toLabel()}` : toLabel()}
          />
        </div>
        <Show when={p.unitOptions}>
          {(options) => (
            <Select
              class={styles.rangePartSelect}
              name={p.unitName}
              form={p.form}
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
              class={cx(styles.rangePartSelect, styles.rangePartSelectVariantWide)}
              name={p.periodName}
              form={p.form}
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
      <FormValue
        name={p.name}
        form={p.form}
        required={p.required}
        disabled={p.disabled}
        validation={validation}
        value={[range().min == null ? '' : String(range().min), range().max == null ? '' : String(range().max)]}
        invalidMessage={
          invalidNumber()
            ? translate('velvet.forms.numberInput.invalidNumber')
            : isInverted(range())
              ? (p.invertedError ?? translate('velvet.forms.rangeInput.invertedError'))
              : undefined
        }
        focusInvalid={() => firstInput?.focus()}
        onReset={() => {
          setRange(p.defaultValue);
          setUnit(p.defaultUnit ?? '');
          setPeriod(p.defaultPeriod ?? '');
          setResetKey((key) => key + 1);
        }}
      />
      <Show when={message() || p.hint}>
        <FieldHint id={hintId()} error={!!message()}>
          {message() || p.hint}
        </FieldHint>
      </Show>
    </div>
  );
};
