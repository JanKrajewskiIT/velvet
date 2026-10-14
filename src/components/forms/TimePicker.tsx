import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, createUniqueId, type JSX, mergeProps, on, Show } from 'solid-js';

import { createActiveOptionScroll } from '../../hooks/createActiveOptionScroll';
import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { pad } from '../../utils/date';
import { Control } from '../primitives/Control';
import { FieldLabel } from '../primitives/FieldLabel';
import { callbackAlias } from './callbackAlias';
import { createFormValidation } from './createFormValidation';
import type { FormControlProps } from './formControl';
import { FormValue } from './FormValue';
import { exampleTime, formatMinutes, formatTime, minutesOfTime, parseTime } from './time';
import { TimePickerMenu } from './TimePickerMenu';

export interface TimePickerProps extends FormControlProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  /** "HH:MM" 24h. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (time: string | null) => void;
  /** Alias of `onValueChange`. */
  onChange?: (time: string | null) => void;
  /** List step in minutes. @default 15 */
  step?: number;
  /** @default '00:00' */
  min?: string;
  /** @default '23:59' */
  max?: string;
  /** Display as 9:30 AM. @default false */
  hour12?: boolean;
  placeholder?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
}

/** Time field: type freely ("930", "9:30", "9.30pm") or pick from a step list. Value is always "HH:MM" 24h. */
export const TimePicker = (props: TimePickerProps) => {
  const p = mergeProps(
    { step: 15, min: '00:00', max: '23:59', hour12: false, size: 'md' } satisfies Partial<TimePickerProps>,
    props,
  );
  const i18n = useI18n();
  const translate = useTranslate();
  const validation = createFormValidation();
  const autoId = createUniqueId();
  const id = () => p.id ?? autoId;
  const listId = () => `${id()}-list`;
  const hintId = () => `${id()}-hint`;
  const example = () => exampleTime(p.hour12, i18n.locale());

  const [current, setCurrent] = createControllable<string | null>({
    value: () => p.value,
    defaultValue: p.defaultValue ?? null,
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const [open, setOpen] = createSignal(false);
  const [highlighted, setActive] = createSignal(-1);
  const [typed, setTyped] = createSignal<string | null>(null);
  const [invalidText, setInvalidText] = createSignal<'format' | 'range' | undefined>();
  const [wrap, setWrap] = createSignal<HTMLElement>();
  const floating = createFloating(open, wrap, { matchWidth: true });
  let input!: HTMLInputElement;

  const text = () => typed() ?? formatTime(current(), p.hour12, i18n.locale());
  const message = () => {
    if (p.error) return p.error;
    if (invalidText() === 'range') return translate('velvet.forms.timePicker.outsideRange', { min: p.min, max: p.max });
    return invalidText() ? translate('velvet.forms.timePicker.invalidTime', { example: example() }) : null;
  };
  const bounds = createMemo(() => ({ min: parseTime(p.min), max: parseTime(p.max) }));
  const isAllowed = (time: string) => {
    const { min, max } = bounds();
    return !!min && !!max && time >= min && time <= max;
  };
  const options = createMemo(() => {
    const step = Number.isFinite(p.step) ? Math.max(1, Math.min(1440, Math.trunc(p.step))) : 15;
    const result: string[] = [];
    const { min, max } = bounds();
    if (!min || !max || min > max) return result;
    for (let minutes = minutesOfTime(min); minutes <= minutesOfTime(max); minutes += step)
      result.push(formatMinutes(minutes, false));
    return result;
  });
  const indexAtOrAfter = (time: string) => options().findIndex((option) => option >= time);
  const active = () => (options().length ? Math.min(Math.max(0, highlighted()), options().length - 1) : -1);

  const set = (time: string | null) => {
    if (p.disabled) return;
    if (time && !isAllowed(time)) {
      setInvalidText('range');
      return;
    }
    setInvalidText(undefined);
    setTyped(null);
    setCurrent(time);
  };
  const commit = (input: string) => {
    if (!input.trim()) {
      set(null);
      return;
    }
    const parsed = parseTime(input);
    if (parsed) set(parsed);
    else setInvalidText('format');
  };

  createDismiss(
    open,
    (reason) => {
      setOpen(false);
      if (reason === 'outside') commit(text());
      else setTyped(null);
    },
    wrap,
    { refocus: false },
  );
  createEffect(on(current, () => setTyped(null), { defer: true }));
  createEffect(() => {
    if (p.disabled) {
      setOpen(false);
      setTyped(null);
    }
  });
  createEffect(
    on(open, (isOpen) => {
      if (!isOpen) return;
      const time = current();
      const index = indexAtOrAfter(time ?? `${pad(new Date().getHours())}:00`);
      setActive(index < 0 ? 0 : index);
    }),
  );
  createActiveOptionScroll(open, () => (active() >= 0 ? `${listId()}-${active()}` : undefined));

  const onKeyDown = (e: KeyboardEvent) => {
    if (p.disabled) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open()) setOpen(true);
        else setActive(Math.min(options().length - 1, active() + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive(Math.max(0, active() - 1));
        break;
      case 'Enter': {
        e.preventDefault();
        const highlighted = options()[active()];
        if (open() && highlighted && parseTime(text()) === current()) set(highlighted);
        else commit(text());
        setOpen(false);
        break;
      }
      case 'Tab':
        setOpen(false);
        commit(text());
        break;
    }
  };
  const onInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const value = e.currentTarget.value;
    setTyped(value);
    setInvalidText(undefined);
    const parsed = parseTime(value);
    const index = parsed ? indexAtOrAfter(parsed) : -1;
    if (index >= 0) setActive(index);
  };

  return (
    <div class="vui-field">
      <Show when={p.label}>
        <FieldLabel id={`${id()}-label`} htmlFor={id()} optional={p.optional} required={p.required}>
          {p.label}
        </FieldLabel>
      </Show>
      <div ref={setWrap} class="vui-select">
        <Control size={p.size} invalid={!!message() || validation.invalid()} disabled={p.disabled} iconLeft="clock">
          <input
            ref={(element) => {
              input = element;
            }}
            id={id()}
            role="combobox"
            aria-expanded={open()}
            aria-controls={listId()}
            aria-activedescendant={open() && active() >= 0 ? `${listId()}-${active()}` : undefined}
            aria-describedby={validation.describedBy(message() || p.hint ? hintId() : undefined)}
            aria-invalid={!!message() || validation.invalid() || undefined}
            aria-label={p['aria-label']}
            aria-labelledby={p['aria-labelledby']}
            aria-required={p.required || undefined}
            class="vui-control__input vui-time__input"
            value={text()}
            placeholder={p.placeholder ?? example()}
            disabled={p.disabled}
            autocomplete="off"
            inputMode="numeric"
            onInput={onInput}
            onFocus={() => !p.disabled && setOpen(true)}
            onClick={() => !p.disabled && setOpen(true)}
            onKeyDown={onKeyDown}
          />
        </Control>
        <FormValue
          validation={validation}
          name={p.name}
          form={p.form}
          required={p.required}
          disabled={p.disabled}
          value={current() ?? ''}
          focusInvalid={() => input.focus()}
          onReset={() => {
            setCurrent(p.defaultValue ?? null);
            setTyped(null);
            setInvalidText(undefined);
            setOpen(false);
            input.value = text();
          }}
        />
        <Show when={open()}>
          <TimePickerMenu
            ref={floating.ref}
            style={floating.style()}
            id={listId()}
            label={p['aria-label'] ?? translate('velvet.forms.timePicker.optionsLabel')}
            labelledBy={p['aria-labelledby'] ?? (p.label ? `${id()}-label` : undefined)}
            options={options()}
            value={current()}
            active={active()}
            hour12={p.hour12}
            locale={i18n.locale()}
            onHover={setActive}
            onSelect={(time) => {
              set(time);
              setOpen(false);
            }}
          />
        </Show>
      </div>
      <Show when={message() || p.hint}>
        <span id={hintId()} class={cx('vui-hint', !!message() && 'vui-hint--error')}>
          {message() || p.hint}
        </span>
      </Show>
    </div>
  );
};
