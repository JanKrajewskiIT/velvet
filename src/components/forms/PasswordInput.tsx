import type { I18nKey } from '@jankrajewskiit/i18n';
import { createSignal, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { joinIdRefs } from '../../utils/joinIdRefs';
import type { Tone } from '../../utils/tone';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import { Field } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { Meter } from '../primitives/Meter';
import { callHandler } from './callHandler';
import styles from './PasswordInput.module.css';
import { PASSWORD_MAX_SCORE, passwordScore } from './passwordScore';

const STRENGTH_LABEL_KEYS: readonly I18nKey[] = [
  'velvet.forms.passwordInput.strength.tooWeak',
  'velvet.forms.passwordInput.strength.weak',
  'velvet.forms.passwordInput.strength.fair',
  'velvet.forms.passwordInput.strength.good',
  'velvet.forms.passwordInput.strength.strong',
];
const GOOD_SCORE = 3;
const FAIR_SCORE = 2;

const strengthTone = (score: number): Tone => {
  if (score >= GOOD_SCORE) return 'success';
  return score === FAIR_SCORE ? 'warning' : 'danger';
};

export interface PasswordInputProps extends Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'class'
> {
  /** @default localized "Password" */
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  /** Show the strength meter — use on "create / change password" only, never on sign-in. */
  showStrength?: boolean;
  /** Strength text for scores 0–4, shown before the hint. @default localized "Too weak", "Weak", "Fair", "Good", "Strong" */
  strengthLabels?: readonly string[];
  /** @default localized "Show password" */
  showLabel?: string;
  /** @default localized "Hide password" */
  hideLabel?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Controlled value. */
  value?: string;
  defaultValue?: string;
  /** Styles the field shell. */
  class?: string;
}

/** Password field with show/hide toggle and optional live strength meter (4 segments + label). */
export const PasswordInput = (props: PasswordInputProps) => {
  const merged = mergeProps(
    {
      showStrength: false,
      size: 'md',
      defaultValue: '',
      autocomplete: 'new-password',
      spellcheck: false,
    } satisfies PasswordInputProps,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'label',
    'hint',
    'error',
    'optional',
    'required',
    'showStrength',
    'strengthLabels',
    'showLabel',
    'hideLabel',
    'size',
    'disabled',
    'id',
    'class',
    'value',
    'defaultValue',
    'onInput',
    'aria-describedby',
    'aria-invalid',
  ]);
  const translate = useTranslate();
  const [revealed, setRevealed] = createSignal(false);
  const [text, setText] = createControllable({ value: () => local.value, defaultValue: local.defaultValue });
  const score = () => (local.showStrength ? passwordScore(text()) : -1);
  const strengthLabel = (): string | undefined => {
    if (local.strengthLabels) return local.strengthLabels[score()];
    const key = STRENGTH_LABEL_KEYS[score()];
    return key && translate(key);
  };
  const strengthHint = (): JSX.Element => {
    const label = strengthLabel();
    const hint = local.hint;
    if (!hint) return label;
    return typeof hint === 'string' ? `${label} · ${hint}` : [label, ' · ', hint];
  };

  return (
    <Field
      label={local.label ?? translate('velvet.forms.passwordInput.label')}
      hint={score() >= 0 && !local.error ? strengthHint() : local.hint}
      error={local.error}
      optional={local.optional}
      required={local.required}
      id={local.id}
      reserveHint={local.showStrength}
    >
      {(control) => (
        <>
          <Control
            size={local.size}
            invalid={control.invalid}
            disabled={local.disabled}
            class={local.class}
            iconLeft="lock"
            end={
              <button
                type="button"
                class={styles.controlPartBtn}
                aria-label={
                  revealed()
                    ? (local.hideLabel ?? translate('velvet.forms.passwordInput.hideLabel'))
                    : (local.showLabel ?? translate('velvet.forms.passwordInput.showLabel'))
                }
                aria-pressed={revealed()}
                disabled={local.disabled}
                onClick={() => setRevealed(!revealed())}
              >
                <Glyph name={revealed() ? 'eye-off' : 'eye'} />
              </button>
            }
          >
            <ControlInput
              {...rest}
              id={control.id}
              type={revealed() ? 'text' : 'password'}
              disabled={local.disabled}
              required={local.required}
              value={text()}
              aria-invalid={control.invalid || local['aria-invalid']}
              aria-describedby={joinIdRefs(local['aria-describedby'], control.describedBy)}
              onInput={(e) => {
                setText(e.currentTarget.value);
                callHandler(local.onInput, e);
              }}
            />
          </Control>
          <Show when={local.showStrength}>
            <Meter
              steps={PASSWORD_MAX_SCORE}
              value={score() === 0 && text() ? 1 : Math.max(0, score())}
              max={PASSWORD_MAX_SCORE}
              size="sm"
              tone={strengthTone(score())}
            />
          </Show>
        </>
      )}
    </Field>
  );
};
