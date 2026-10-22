import { useI18n } from '@jankrajewskiit/i18n';
import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  Show,
  splitProps,
} from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { joinIdRefs } from '../../utils/joinIdRefs';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import { Field } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { callHandler } from './callHandler';
import { createFormValidation } from './createFormValidation';
import { createPhoneCountryPopup } from './createPhoneCountryPopup';
import { FormValue } from './FormValue';
import { formatNational, nationalLength, onlyDigits, PHONE_COUNTRIES, type PhoneCountry } from './phoneCountries';
import { PhoneCountryList } from './PhoneCountryList';
import styles from './PhoneInput.module.css';

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
    'readOnly',
    'id',
    'name',
    'form',
    'required',
    'class',
    'onBlur',
    'onInput',
    'aria-describedby',
    'aria-invalid',
  ]);
  const autoId = createUniqueId();
  const i18n = useI18n();
  const translate = useTranslate();
  const validation = createFormValidation();
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
  const [touched, setTouched] = createSignal(false);
  const [root, setRoot] = createSignal<HTMLElement>();
  let input!: HTMLInputElement;
  const editable = () => !local.disabled && !local.readOnly;

  const e164 = (digits: string, target: PhoneCountry) => (digits ? `+${target.dial}${digits}` : '');
  const emit = (digits: string, target: PhoneCountry) =>
    local.onValueChange?.(e164(digits, target), {
      country: target.code,
      national: digits,
      valid: digits.length === nationalLength(target),
    });
  const setDigits = (raw: string) => {
    if (!editable()) return;
    const digits = raw.slice(0, nationalLength(country()) + EXTRA_DIGITS);
    setDigitState(digits);
    emit(digits, country());
  };
  const pickCountry = (next: PhoneCountry) => {
    if (!editable() || !open()) return;
    setCountryCode(next.code);
    emit(digitState(), next);
    setOpen(false);
    input.focus({ preventScroll: true });
  };
  const lengthError = () => {
    const digits = digitState();
    const wrongLength = digits.length > 0 && digits.length !== nationalLength(country());
    return local.validateOnBlur && touched() && wrongLength ? invalidMessage(country()) : undefined;
  };

  const { open, setOpen, active, setActive, openList, onKeyDown, floating } = createPhoneCountryPopup({
    countries: () => local.countries,
    selected: () => country().code,
    countryName,
    root,
    onPick: pickCountry,
  });
  createEffect(() => {
    if (!editable()) setOpen(false);
  });
  return (
    <Field
      label={local.label ?? translate('velvet.forms.phoneInput.label')}
      hint={local.hint}
      error={local.error || lengthError()}
      optional={local.optional}
      required={local.required}
      id={id()}
    >
      {(control) => (
        <div ref={setRoot} class={cx(styles.select, styles.phone)}>
          <Control
            size={local.size}
            invalid={control.invalid || validation.invalid()}
            disabled={local.disabled}
            readOnly={local.readOnly}
            class={local.class}
          >
            <button
              type="button"
              class={cx(styles.phonePartCountry, typographyClass('body'))}
              role="combobox"
              disabled={!editable()}
              aria-label={`${countryLabel()}: ${countryName(country())} +${country().dial}`}
              aria-haspopup="listbox"
              aria-expanded={open()}
              aria-controls={listId()}
              aria-activedescendant={open() && active() >= 0 ? optionId(active()) : undefined}
              onClick={() => {
                if (!editable()) return;
                if (open()) setOpen(false);
                else openList();
              }}
              onKeyDown={(event) => {
                if (editable()) onKeyDown(event);
              }}
            >
              <Text as="span" variant="kbd" tone="inherit" class={styles.phonePartCode}>
                {country().code}
              </Text>
              <Text as="span" variant="body" tone="inherit" class={styles.phonePartDial}>
                +{country().dial}
              </Text>
              <Glyph name="chevron-down" />
            </button>
            <ControlInput
              {...rest}
              ref={(element) => {
                input = element;
              }}
              id={control.id}
              type="tel"
              form={local.form}
              inputMode="tel"
              autocomplete="tel-national"
              disabled={local.disabled}
              readOnly={local.readOnly}
              placeholder={country().mask.replace(/#/gu, '0')}
              value={formatNational(digitState(), country().mask)}
              aria-required={local.required || undefined}
              aria-invalid={control.invalid || validation.invalid() || local['aria-invalid']}
              aria-describedby={joinIdRefs(local['aria-describedby'], validation.describedBy(control.describedBy))}
              onInput={(e) => {
                if (!editable()) return;
                setDigits(onlyDigits(e.currentTarget.value));
                e.currentTarget.value = formatNational(digitState(), country().mask);
                callHandler(local.onInput, e);
              }}
              onBlur={(e) => {
                setTouched(true);
                callHandler(local.onBlur, e);
              }}
            />
          </Control>
          <FormValue
            name={local.name}
            form={local.form}
            required={local.required}
            disabled={local.disabled}
            value={e164(digitState(), country())}
            validation={validation}
            focusInvalid={() => input.focus()}
            onReset={() => {
              setCountryCode(local.defaultCountry);
              setDigitState(onlyDigits(local.defaultValue));
              setTouched(false);
              setOpen(false);
              input.value = formatNational(digitState(), country().mask);
              emit(digitState(), country());
            }}
          />
          <Show when={open()}>
            <PhoneCountryList
              ref={floating.ref}
              style={floating.style()}
              id={listId()}
              label={countryLabel()}
              countries={local.countries}
              selected={country().code}
              active={active()}
              countryName={countryName}
              onHover={setActive}
              onPick={pickCountry}
            />
          </Show>
        </div>
      )}
    </Field>
  );
};
