import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  onCleanup,
  Show,
  splitProps,
} from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { assignRef } from '../../utils/assignRef';
import { cx } from '../../utils/cx';
import { decimalPlaces, numberRange, parseDecimal } from '../../utils/decimalValue';
import { joinIdRefs } from '../../utils/joinIdRefs';
import { clamp } from '../../utils/math';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import { Field } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { callHandler } from './callHandler';
import { createFormValidation } from './createFormValidation';
import { FormValue } from './FormValue';
import styles from './NumberInput.module.css';

const HOLD_DELAY_MS = 450;
const HOLD_REPEAT_MS = 60;
const SHIFT_MULTIPLIER = 10;

export interface NumberInputProps extends Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'min' | 'max' | 'step' | 'prefix' | 'class' | 'type'
> {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  /** Controlled value. */
  value?: number;
  /** @default 0 */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Decimal places follow the step (0.5 → 1 dp). @default 1 */
  step?: number;
  /** Unit after the value — "seats", "kg". */
  suffix?: JSX.Element;
  /** @default localized "Decrease" */
  decreaseLabel?: string;
  /** @default localized "Increase" */
  increaseLabel?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Styles the field shell. */
  class?: string;
}

/** Stepper number field: − / + buttons (hold to repeat), clamped min/max, ↑↓ step (Shift ×10), Home/End jump to bounds, typed value committed on blur/Enter. */
export const NumberInput = (props: NumberInputProps) => {
  const merged = mergeProps(
    { defaultValue: 0, min: -Infinity, max: Infinity, step: 1, size: 'md' } satisfies NumberInputProps,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'label',
    'hint',
    'error',
    'optional',
    'value',
    'defaultValue',
    'onValueChange',
    'min',
    'max',
    'step',
    'suffix',
    'decreaseLabel',
    'increaseLabel',
    'size',
    'disabled',
    'readOnly',
    'id',
    'class',
    'onBlur',
    'onInput',
    'onKeyDown',
    'name',
    'form',
    'required',
    'aria-describedby',
    'aria-invalid',
  ]);
  const translate = useTranslate();
  const autoId = createUniqueId();
  const id = () => local.id ?? autoId;
  const [current, setCurrent] = createControllable({
    value: () => local.value,
    defaultValue: local.defaultValue,
    onChange: (next) => local.onValueChange?.(next),
  });
  /** What the user is typing; `undefined` while the field shows the committed value. */
  const [draft, setDraft] = createSignal<string>();
  const validation = createFormValidation();
  const bounds = createMemo(() => numberRange(local.min, local.max, local.step));
  const places = () => decimalPlaces(bounds().step);
  const invalidDraft = () => draft() !== undefined && parseDecimal(draft()) === undefined;
  const message = () =>
    invalidDraft() || !Number.isFinite(current()) || current() < bounds().min || current() > bounds().max
      ? translate('velvet.forms.numberInput.invalidNumber')
      : undefined;
  let input: HTMLInputElement | undefined;
  const atMin = () => current() <= local.min;
  const atMax = () => current() >= local.max;

  const commit = (n: number) => {
    if (local.disabled || local.readOnly || !Number.isFinite(n)) return;
    setCurrent(clamp(places() <= 100 ? Number(n.toFixed(places())) : n, bounds().min, bounds().max));
    setDraft(undefined);
  };
  const commitDraft = () => {
    if (draft() === undefined) return;
    const parsed = parseDecimal(draft());
    if (parsed !== undefined) commit(parsed);
  };
  const bump = (direction: 1 | -1, multiplier = 1) => commit((current() || 0) + direction * bounds().step * multiplier);

  let holdTimer: ReturnType<typeof setTimeout> | undefined;
  let repeatTimer: ReturnType<typeof setInterval> | undefined;
  const stopHold = () => {
    clearTimeout(holdTimer);
    clearInterval(repeatTimer);
  };
  onCleanup(stopHold);
  createEffect(() => {
    if (local.disabled || local.readOnly) setDraft(undefined);
    if (local.disabled || local.readOnly || atMin() || atMax()) stopHold();
  });
  const stepHandlers = (direction: 1 | -1) => ({
    onPointerDown: (e: PointerEvent) => {
      if (e.button !== 0 || local.disabled || local.readOnly) return;
      e.preventDefault();
      stopHold();
      bump(direction);
      holdTimer = setTimeout(() => {
        repeatTimer = setInterval(() => bump(direction), HOLD_REPEAT_MS);
      }, HOLD_DELAY_MS);
    },
    onPointerUp: stopHold,
    onPointerLeave: stopHold,
    onPointerCancel: stopHold,
    onKeyDown: (e: KeyboardEvent) => {
      if (local.disabled || local.readOnly || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      bump(direction);
    },
  });

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    callHandler(local.onKeyDown, e);
    if (e.defaultPrevented || local.disabled || local.readOnly) return;
    const multiplier = e.shiftKey ? SHIFT_MULTIPLIER : 1;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      bump(1, multiplier);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      bump(-1, multiplier);
    } else if (e.key === 'Home' && Number.isFinite(local.min)) {
      e.preventDefault();
      commit(local.min);
    } else if (e.key === 'End' && Number.isFinite(local.max)) {
      e.preventDefault();
      commit(local.max);
    } else if (e.key === 'Enter') {
      commitDraft();
    }
  };

  return (
    <Field
      label={local.label}
      hint={local.hint}
      error={local.error || message()}
      optional={local.optional}
      required={local.required}
      id={id()}
    >
      {(control) => (
        <Control
          size={local.size}
          invalid={control.invalid}
          disabled={local.disabled}
          readOnly={local.readOnly}
          class={cx(styles.number, local.class)}
        >
          <button
            type="button"
            tabIndex={-1}
            class={styles.numberPartStep}
            aria-label={local.decreaseLabel ?? translate('velvet.forms.numberInput.decreaseLabel')}
            disabled={local.disabled || local.readOnly || atMin()}
            {...stepHandlers(-1)}
          >
            <Glyph name="minus" />
          </button>
          <ControlInput
            {...rest}
            ref={(element) => {
              input = element;
              assignRef(rest.ref, element);
            }}
            id={control.id}
            type="text"
            role="spinbutton"
            inputMode={places() ? 'decimal' : 'numeric'}
            aria-valuenow={Number.isFinite(current()) ? current() : undefined}
            aria-valuemin={Number.isFinite(local.min) ? local.min : undefined}
            aria-valuemax={Number.isFinite(local.max) ? local.max : undefined}
            aria-invalid={control.invalid || validation.invalid() || local['aria-invalid']}
            aria-describedby={joinIdRefs(local['aria-describedby'], validation.describedBy(control.describedBy))}
            class={styles.numberPartInput}
            value={draft() ?? String(current())}
            disabled={local.disabled}
            readOnly={local.readOnly}
            onInput={(e) => {
              if (local.disabled || local.readOnly) return;
              setDraft(e.currentTarget.value);
              callHandler(local.onInput, e);
            }}
            onBlur={(e) => {
              if (draft() !== undefined) commitDraft();
              callHandler(local.onBlur, e);
            }}
            onKeyDown={onKeyDown}
          />
          <FormValue
            name={local.name}
            form={local.form}
            required={local.required}
            disabled={local.disabled}
            value={Number.isFinite(current()) ? String(current()) : ''}
            validation={validation}
            invalidMessage={message()}
            focusInvalid={() => input?.focus()}
            onReset={() => {
              setCurrent(local.defaultValue);
              setDraft(undefined);
              stopHold();
            }}
          />
          <Show when={local.suffix}>
            <Text
              as="span"
              variant="body"
              tone="inherit"
              class={cx(styles.controlPartAffix, styles.controlPartAffixVariantEnd)}
              style={{ 'padding-left': 0 }}
            >
              {local.suffix}
            </Text>
          </Show>
          <button
            type="button"
            tabIndex={-1}
            class={styles.numberPartStep}
            aria-label={local.increaseLabel ?? translate('velvet.forms.numberInput.increaseLabel')}
            disabled={local.disabled || local.readOnly || atMax()}
            {...stepHandlers(1)}
          >
            <Glyph name="plus" />
          </button>
        </Control>
      )}
    </Field>
  );
};
