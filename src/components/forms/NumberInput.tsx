import {
  createEffect,
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
import { cx } from '../../utils/cx';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { callHandler } from './callHandler';

const HOLD_DELAY_MS = 450;
const HOLD_REPEAT_MS = 60;
const SHIFT_MULTIPLIER = 10;
const NON_NUMERIC = /[^\d.,-]/gu;

const decimalPlaces = (step: number): number => String(step).split('.')[1]?.length ?? 0;
const parseNumber = (text: string): number => parseFloat(text.replace(',', '.'));

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
    'id',
    'class',
    'onBlur',
    'onInput',
    'onKeyDown',
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
  const places = () => decimalPlaces(local.step);
  const atMin = () => current() <= local.min;
  const atMax = () => current() >= local.max;

  const clamp = (n: number) => Math.min(local.max, Math.max(local.min, Number(n.toFixed(places()))));
  const commit = (n: number) => {
    setCurrent(clamp(n));
    setDraft(undefined);
  };
  const commitDraft = () => {
    const parsed = parseNumber(draft() ?? '');
    commit(Number.isNaN(parsed) ? current() : parsed);
  };
  const bump = (direction: 1 | -1, multiplier = 1) => commit((current() || 0) + direction * local.step * multiplier);

  let holdTimer: ReturnType<typeof setTimeout> | undefined;
  let repeatTimer: ReturnType<typeof setInterval> | undefined;
  const stopHold = () => {
    clearTimeout(holdTimer);
    clearInterval(repeatTimer);
  };
  onCleanup(stopHold);
  createEffect(() => {
    if (atMin() || atMax()) stopHold();
  });
  const stepHandlers = (direction: 1 | -1) => ({
    onPointerDown: (e: PointerEvent) => {
      if (e.button !== 0 || local.disabled) return;
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
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      bump(direction);
    },
  });

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    callHandler(local.onKeyDown, e);
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
    <Field label={local.label} hint={local.hint} error={local.error} optional={local.optional} id={id()}>
      {(control) => (
        <Control
          size={local.size}
          invalid={control.invalid}
          disabled={local.disabled}
          class={cx('vui-number', local.class)}
        >
          <button
            type="button"
            tabIndex={-1}
            class="vui-number__step"
            aria-label={local.decreaseLabel ?? translate('velvet.forms.numberInput.decreaseLabel')}
            disabled={local.disabled || atMin()}
            {...stepHandlers(-1)}
          >
            <Glyph name="minus" />
          </button>
          <input
            {...rest}
            id={control.id}
            type="text"
            role="spinbutton"
            inputMode={places() ? 'decimal' : 'numeric'}
            aria-valuenow={current()}
            aria-valuemin={Number.isFinite(local.min) ? local.min : undefined}
            aria-valuemax={Number.isFinite(local.max) ? local.max : undefined}
            aria-invalid={control.invalid || undefined}
            aria-describedby={control.describedBy}
            class="vui-control__input vui-number__input"
            value={draft() ?? String(current())}
            disabled={local.disabled}
            onInput={(e) => {
              const typed = e.currentTarget.value.replace(NON_NUMERIC, '');
              e.currentTarget.value = typed;
              setDraft(typed);
              callHandler(local.onInput, e);
            }}
            onBlur={(e) => {
              if (draft() !== undefined) commitDraft();
              callHandler(local.onBlur, e);
            }}
            onKeyDown={onKeyDown}
          />
          <Show when={local.suffix}>
            <span class="vui-control__affix vui-control__affix--end" style={{ 'padding-left': 0 }}>
              {local.suffix}
            </span>
          </Show>
          <button
            type="button"
            tabIndex={-1}
            class="vui-number__step"
            aria-label={local.increaseLabel ?? translate('velvet.forms.numberInput.increaseLabel')}
            disabled={local.disabled || atMax()}
            {...stepHandlers(1)}
          >
            <Glyph name="plus" />
          </button>
        </Control>
      )}
    </Field>
  );
};
