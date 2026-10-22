import { createEffect, type JSX, mergeProps, splitProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { cx } from '../../utils/cx';
import { joinIdRefs } from '../../utils/joinIdRefs';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';
import { typographyClass } from '../primitives/typography';
import { callHandler } from './callHandler';
import { createValidation, type Validator } from './createValidation';
import styles from './Textarea.module.css';

const FALLBACK_LINE_HEIGHT_PX = 20;

export interface TextareaProps extends Omit<
  JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size' | 'value' | 'class' | 'style'
> {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  /** Minimum visible rows. @default 3 */
  rows?: number;
  /** Grow height with content between `rows` and `maxRows`, then scroll. @default true */
  autoResize?: boolean;
  /** Height cap when `autoResize`. @default 10 */
  maxRows?: number;
  /** Manual resize handle. @default 'none' when `autoResize`, else 'vertical' */
  resize?: 'none' | 'vertical' | 'both';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Controlled value. */
  value?: string;
  defaultValue?: string;
  validate?: Validator;
  reserveHint?: boolean;
  /** Live "n / maxLength" counter. Requires `maxLength`. */
  showCount?: boolean;
  /** Styles the field shell. */
  class?: string;
  style?: JSX.CSSProperties;
}

/** Multi-line text field with the same label/hint/error/validate/counter API as Input. */
export const Textarea = (props: TextareaProps) => {
  const merged = mergeProps(
    { rows: 3, autoResize: true, maxRows: 10, size: 'md', defaultValue: '' } satisfies TextareaProps,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'label',
    'hint',
    'error',
    'optional',
    'required',
    'rows',
    'autoResize',
    'maxRows',
    'resize',
    'size',
    'readOnly',
    'disabled',
    'validate',
    'reserveHint',
    'showCount',
    'maxLength',
    'id',
    'class',
    'style',
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
  const resize = () => local.resize ?? (local.autoResize ? 'none' : 'vertical');
  let area!: HTMLTextAreaElement;

  const fit = () => {
    const style = getComputedStyle(area);
    const lineHeight = parseFloat(style.lineHeight) || FALLBACK_LINE_HEIGHT_PX;
    const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const cap = local.maxRows * lineHeight + padding;
    area.style.height = 'auto';
    area.style.height = `${Math.min(Math.max(area.scrollHeight, local.rows * lineHeight + padding), cap)}px`;
    area.style.overflowY = area.scrollHeight > cap ? 'auto' : 'hidden';
  };
  createEffect(() => {
    text();
    if (local.autoResize) fit();
  });

  return (
    <Field
      label={local.label}
      hint={local.hint}
      error={local.error || validation.message()}
      optional={local.optional}
      required={local.required}
      id={local.id}
      reserveHint={local.reserveHint || !!local.validate || !!counterMax()}
      count={counterMax() ? text().length : undefined}
      maxCount={counterMax()}
    >
      {(control) => (
        <Control
          multiline
          size={local.size}
          invalid={control.invalid}
          disabled={local.disabled}
          readOnly={local.readOnly}
          class={local.class}
        >
          <textarea
            {...rest}
            ref={(element) => {
              area = element;
            }}
            id={control.id}
            rows={local.rows}
            class={cx(styles.controlPartInput, 'vui-textarea', typographyClass('body'))}
            style={{ resize: resize(), 'min-height': 0, ...local.style }}
            disabled={local.disabled}
            readOnly={local.readOnly}
            required={local.required}
            maxLength={local.maxLength}
            value={text()}
            aria-invalid={control.invalid || local['aria-invalid']}
            aria-describedby={joinIdRefs(local['aria-describedby'], control.describedBy)}
            onBlur={(e) => {
              validation.blur();
              callHandler(local.onBlur, e);
            }}
            onInput={(e) => {
              setText(e.currentTarget.value);
              callHandler(local.onInput, e);
            }}
          />
        </Control>
      )}
    </Field>
  );
};
