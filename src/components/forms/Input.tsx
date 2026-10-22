import { type JSX, mergeProps, splitProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { cx } from '../../utils/cx';
import { joinIdRefs } from '../../utils/joinIdRefs';
import { Polymorphic } from '../../utils/polymorphic';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';
import { typographyClass } from '../primitives/typography';
import { callHandler } from './callHandler';
import { createValidation, type Validator } from './createValidation';
import styles from './Input.module.css';

type TextField = HTMLInputElement | HTMLTextAreaElement;
type InputFocusEvent = FocusEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement };
type InputInputEvent = InputEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement };

const fieldValue = (e: Event): string => (e.currentTarget as TextField).value;

export interface InputProps extends Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'prefix' | 'value' | 'class'
> {
  label?: JSX.Element;
  hint?: JSX.Element;
  /** Controlled error message (overrides `validate`). */
  error?: JSX.Element;
  optional?: boolean;
  /** Glyph name or node. */
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  /** Text inside the field, before the value — "$", "velvet.app/". */
  prefix?: JSX.Element;
  /** Text inside the field, after the value — "USD / mo", "kg". */
  suffix?: JSX.Element;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Renders a `<textarea>` instead. @deprecated Use Textarea. */
  multiline?: boolean;
  /** Visible rows of the `multiline` textarea. */
  rows?: number;
  /** Controlled value. */
  value?: string;
  defaultValue?: string;
  /** Return an error string or nothing. Runs on blur, then on every change once touched. */
  validate?: Validator;
  /** Always reserve the message lane (use in forms that validate on submit). */
  reserveHint?: boolean;
  /** Live "n / maxLength" counter, right of the hint. Requires `maxLength`. */
  showCount?: boolean;
  /** Styles the field shell. */
  class?: string;
}

/** Text field with label, hint, icons, prefix/suffix and validation. The message lane is fixed-height when `validate`, `reserveHint` or `showCount` is set, so errors never reflow the form. */
export const Input = (props: InputProps) => {
  const merged = mergeProps({ size: 'md', defaultValue: '', multiline: false } satisfies InputProps, props);
  const [local, rest] = splitProps(merged, [
    'label',
    'hint',
    'error',
    'optional',
    'required',
    'iconLeft',
    'iconRight',
    'prefix',
    'suffix',
    'size',
    'multiline',
    'rows',
    'readOnly',
    'disabled',
    'validate',
    'reserveHint',
    'showCount',
    'maxLength',
    'id',
    'class',
    'value',
    'defaultValue',
    'onBlur',
    'onInput',
    'aria-describedby',
    'aria-invalid',
  ]);
  const [text, setText] = createControllable({ value: () => local.value, defaultValue: local.defaultValue });
  const validation = createValidation(() => local.validate, text);
  const counterMax = () => (local.showCount && local.maxLength ? Number(local.maxLength) : undefined);

  return (
    <Field
      label={local.label}
      hint={local.hint}
      error={local.error || validation.message()}
      optional={local.optional}
      required={local.required}
      id={local.id}
      reserveHint={local.reserveHint || !!local.validate}
      count={text().length}
      maxCount={counterMax()}
    >
      {(control) => (
        <Control
          size={local.size}
          // eslint-disable-next-line @typescript-eslint/no-deprecated -- Input implements its own deprecated multiline prop
          multiline={local.multiline}
          invalid={control.invalid}
          disabled={local.disabled}
          readOnly={local.readOnly}
          iconLeft={local.iconLeft}
          iconRight={local.iconRight}
          prefix={local.prefix}
          suffix={local.suffix}
          class={local.class}
        >
          <Polymorphic
            {...(rest as JSX.HTMLAttributes<HTMLElement>)}
            // eslint-disable-next-line @typescript-eslint/no-deprecated -- Input implements its own deprecated multiline prop
            tag={local.multiline ? 'textarea' : 'input'}
            id={control.id}
            class={cx(styles.controlPartInput, typographyClass('body'))}
            // eslint-disable-next-line @typescript-eslint/no-deprecated -- Input implements its own deprecated multiline prop
            rows={local.multiline ? local.rows : undefined}
            disabled={local.disabled}
            readOnly={local.readOnly}
            required={local.required}
            maxLength={local.maxLength}
            value={text()}
            aria-invalid={control.invalid || local['aria-invalid']}
            aria-describedby={joinIdRefs(local['aria-describedby'], control.describedBy)}
            onBlur={(e: FocusEvent) => {
              validation.blur();
              callHandler(local.onBlur, e as InputFocusEvent);
            }}
            onInput={(e: InputEvent) => {
              setText(fieldValue(e));
              callHandler(local.onInput, e as InputInputEvent);
            }}
          />
        </Control>
      )}
    </Field>
  );
};
