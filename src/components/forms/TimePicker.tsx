import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, createUniqueId, For, type JSX, mergeProps, on, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { pad } from '../../utils/date';
import { Control } from '../primitives/Control';
import { FieldLabel } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { callbackAlias } from './callbackAlias';
import { exampleTime, formatMinutes, formatTime, minutesOfTime, parseTime } from './time';

export interface TimePickerProps {
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
  const [active, setActive] = createSignal(-1);
  const [typed, setTyped] = createSignal<string | null>(null);
  const [invalidText, setInvalidText] = createSignal(false);
  const [wrap, setWrap] = createSignal<HTMLElement>();
  let list: HTMLUListElement | undefined;

  const text = () => typed() ?? formatTime(current(), p.hour12, i18n.locale());
  const message = () =>
    p.error || (invalidText() ? translate('velvet.forms.timePicker.invalidTime', { example: example() }) : null);
  const options = createMemo(() => {
    const step = Math.max(1, p.step);
    const result: string[] = [];
    for (let minutes = minutesOfTime(p.min); minutes <= minutesOfTime(p.max); minutes += step)
      result.push(formatMinutes(minutes, false));
    return result;
  });
  const indexAtOrAfter = (time: string) => options().findIndex((option) => option >= time);

  const set = (time: string | null) => {
    setInvalidText(false);
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
    else setInvalidText(true);
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
  createEffect(
    on(open, (isOpen) => {
      if (!isOpen) return;
      const time = current();
      const index = indexAtOrAfter(time ?? `${pad(new Date().getHours())}:00`);
      setActive(index < 0 ? 0 : index);
    }),
  );
  createEffect(() => {
    const row = list?.children[active()];
    if (!open() || !list || !(row instanceof HTMLElement)) return;
    list.scrollTop = row.offsetTop - list.clientHeight / 2 + row.offsetHeight / 2;
  });

  const onKeyDown = (e: KeyboardEvent) => {
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
    setInvalidText(false);
    const parsed = parseTime(value);
    const index = parsed ? indexAtOrAfter(parsed) : -1;
    if (index >= 0) setActive(index);
  };

  return (
    <div class="vui-field">
      <Show when={p.label}>
        <FieldLabel htmlFor={id()} optional={p.optional}>
          {p.label}
        </FieldLabel>
      </Show>
      <div ref={setWrap} class="vui-select">
        <Control size={p.size} invalid={!!message()} disabled={p.disabled} iconLeft="clock">
          <input
            id={id()}
            role="combobox"
            aria-expanded={open()}
            aria-controls={listId()}
            aria-activedescendant={open() && active() >= 0 ? `${listId()}-${active()}` : undefined}
            aria-describedby={message() || p.hint ? hintId() : undefined}
            aria-invalid={!!message() || undefined}
            class="vui-control__input vui-time__input"
            value={text()}
            placeholder={p.placeholder ?? example()}
            disabled={p.disabled}
            autocomplete="off"
            inputMode="numeric"
            onInput={onInput}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onKeyDown={onKeyDown}
          />
        </Control>
        <Show when={open()}>
          <ul ref={list} id={listId()} role="listbox" class="vui-select__menu vui-time__menu">
            <For each={options()}>
              {(option, index) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard handled by the input via aria-activedescendant
                <li
                  id={`${listId()}-${index()}`}
                  role="option"
                  aria-selected={option === current()}
                  class={cx('vui-select__option', index() === active() && 'vui-select__option--active')}
                  onMouseEnter={() => setActive(index())}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    set(option);
                    setOpen(false);
                  }}
                >
                  <span class="vui-select__label" style={{ 'font-variant-numeric': 'tabular-nums' }}>
                    {formatTime(option, p.hour12, i18n.locale())}
                  </span>
                  <Show when={option === current()}>
                    <Glyph name="check" class="vui-select__check" />
                  </Show>
                </li>
              )}
            </For>
          </ul>
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
