import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, createSignal, createUniqueId, For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { callHandler } from './callHandler';
import { formatNational, nationalLength, onlyDigits, PHONE_COUNTRIES, type PhoneCountry } from './phoneCountries';

/** Digits tolerated beyond the national length, so a pasted prefix stays visible instead of being cut off silently. */
const EXTRA_DIGITS = 2;

export interface PhoneValueMeta {
  country: string;
  national: string;
  /** The national number has exactly the digits its country mask expects. */
  valid: boolean;
}

export interface PhoneInputProps extends Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'class' | 'type' | 'name' | 'prefix'
> {
  /** @default localized "Phone" */
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  /** @default PHONE_COUNTRIES, with country names in the active locale */
  countries?: readonly PhoneCountry[];
  /** @default 'PL' */
  defaultCountry?: string;
  /** Controlled ISO country code. */
  country?: string;
  onCountryChange?: (code: string) => void;
  /** National digits (controlled). */
  value?: string;
  defaultValue?: string;
  /** Called with the E.164 number (`+48600100200`, empty when no digits) and details. */
  onValueChange?: (e164: string, meta: PhoneValueMeta) => void;
  /** Show a length error after blur. @default true */
  validateOnBlur?: boolean;
  /** Message of the length error. @default localized "Enter a valid {country} number ({count} digits)" */
  invalidMessage?: (country: PhoneCountry) => string;
  /** Accessible name of the country button; the country and dial code are appended. @default localized "Country" */
  countryLabel?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Submits E.164 in a hidden input. */
  name?: string;
  /** Styles the field shell. */
  class?: string;
}

/** Phone field with country picker (ISO code + dial code) and as-you-type formatting per country mask. Emits E.164. */
export const PhoneInput = (props: PhoneInputProps) => {
  const merged = mergeProps(
    {
      countries: PHONE_COUNTRIES,
      defaultCountry: 'PL',
      defaultValue: '',
      validateOnBlur: true,
      size: 'md',
    } satisfies PhoneInputProps,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'label',
    'hint',
    'error',
    'optional',
    'countries',
    'defaultCountry',
    'country',
    'onCountryChange',
    'value',
    'defaultValue',
    'onValueChange',
    'validateOnBlur',
    'invalidMessage',
    'countryLabel',
    'size',
    'disabled',
    'id',
    'name',
    'class',
    'onBlur',
  ]);
  const autoId = createUniqueId();
  const i18n = useI18n();
  const translate = useTranslate();
  const regionNames = createMemo(() => new Intl.DisplayNames(i18n.locale(), { type: 'region' }));
  const countryName = (item: PhoneCountry) =>
    local.countries === PHONE_COUNTRIES ? (regionNames().of(item.code) ?? item.name) : item.name;
  const countryLabel = () => local.countryLabel ?? translate('velvet.forms.phoneInput.countryLabel');
  const invalidMessage = (target: PhoneCountry) =>
    local.invalidMessage
      ? local.invalidMessage(target)
      : translate('velvet.forms.phoneInput.invalidNumber', {
          country: countryName(target),
          count: nationalLength(target),
        });
  const id = () => local.id ?? autoId;
  const listId = () => `${id()}-list`;
  const optionId = (index: number) => `${listId()}-${index}`;

  const [countryCode, setCountryCode] = createControllable({
    value: () => local.country,
    defaultValue: local.defaultCountry,
    onChange: (code) => local.onCountryChange?.(code),
  });
  const country = (): PhoneCountry =>
    local.countries.find((item) => item.code === countryCode()) ?? local.countries.at(0) ?? PHONE_COUNTRIES[0];
  const [digitState, setDigitState] = createControllable({
    value: () => (local.value === undefined ? undefined : onlyDigits(local.value)),
    defaultValue: onlyDigits(local.defaultValue),
  });
  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal(0);
  const [touched, setTouched] = createSignal(false);
  const [root, setRoot] = createSignal<HTMLElement>();
  let input!: HTMLInputElement;

  const e164 = (digits: string, target: PhoneCountry) => (digits ? `+${target.dial}${digits}` : '');
  const emit = (digits: string, target: PhoneCountry) =>
    local.onValueChange?.(e164(digits, target), {
      country: target.code,
      national: digits,
      valid: digits.length === nationalLength(target),
    });
  const setDigits = (raw: string) => {
    const digits = raw.slice(0, nationalLength(country()) + EXTRA_DIGITS);
    setDigitState(digits);
    emit(digits, country());
  };
  const pickCountry = (next: PhoneCountry) => {
    setCountryCode(next.code);
    emit(digitState(), next);
    setOpen(false);
    input.focus({ preventScroll: true });
  };
  const openList = () => {
    setActive(Math.max(0, local.countries.indexOf(country())));
    setOpen(true);
  };
  const lengthError = () => {
    const digits = digitState();
    const wrongLength = digits.length > 0 && digits.length !== nationalLength(country());
    return local.validateOnBlur && touched() && wrongLength ? invalidMessage(country()) : undefined;
  };

  createDismiss(open, () => setOpen(false), root);

  const onCountryKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (e) => {
    const count = local.countries.length;
    if (!open()) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((index) => (index + 1) % count);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((index) => (index - 1 + count) % count);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const chosen = local.countries[active()];
      if (chosen) pickCountry(chosen);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <Field
      label={local.label ?? translate('velvet.forms.phoneInput.label')}
      hint={local.hint}
      error={local.error || lengthError()}
      optional={local.optional}
      id={id()}
    >
      {(control) => (
        <div ref={setRoot} class="vui-select vui-phone">
          <Control size={local.size} invalid={control.invalid} disabled={local.disabled} class={local.class}>
            {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- the button drives the popup listbox through aria-activedescendant */}
            <button
              type="button"
              class="vui-phone__country"
              disabled={local.disabled}
              aria-label={`${countryLabel()}: ${countryName(country())} +${country().dial}`}
              aria-haspopup="listbox"
              aria-expanded={open()}
              aria-controls={listId()}
              aria-activedescendant={open() ? optionId(active()) : undefined}
              onClick={() => (open() ? setOpen(false) : openList())}
              onKeyDown={onCountryKeyDown}
            >
              <span class="vui-phone__code">{country().code}</span>
              <span class="vui-phone__dial">+{country().dial}</span>
              <Glyph name="chevron-down" />
            </button>
            <input
              {...rest}
              ref={input}
              id={control.id}
              type="tel"
              inputMode="tel"
              autocomplete="tel-national"
              class="vui-control__input"
              disabled={local.disabled}
              placeholder={country().mask.replace(/#/gu, '0')}
              value={formatNational(digitState(), country().mask)}
              aria-invalid={control.invalid || undefined}
              aria-describedby={control.describedBy}
              onInput={(e) => {
                setDigits(onlyDigits(e.currentTarget.value));
                e.currentTarget.value = formatNational(digitState(), country().mask);
              }}
              onBlur={(e) => {
                setTouched(true);
                callHandler(local.onBlur, e);
              }}
            />
          </Control>
          <Show when={local.name}>
            <input type="hidden" name={local.name} value={e164(digitState(), country())} />
          </Show>
          <Show when={open()}>
            <ul id={listId()} role="listbox" aria-label={countryLabel()} class="vui-select__menu">
              <For each={local.countries}>
                {(item, index) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard handled by the country button via aria-activedescendant
                  <li
                    id={optionId(index())}
                    role="option"
                    aria-selected={item.code === country().code}
                    class={cx('vui-select__option', index() === active() && 'vui-select__option--active')}
                    onMouseEnter={() => setActive(index())}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickCountry(item)}
                  >
                    <span class="vui-phone__code">{item.code}</span>
                    <span class="vui-select__label">{countryName(item)}</span>
                    <span class="vui-phone__dial">+{item.dial}</span>
                    <Show when={item.code === country().code}>
                      <Glyph name="check" />
                    </Show>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </div>
      )}
    </Field>
  );
};
