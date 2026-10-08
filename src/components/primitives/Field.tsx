import { createUniqueId, type JSX, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';

/** Ids and state a Field hands to its control — spread onto the input. */
export interface FieldControlProps {
  id: string;
  invalid: boolean;
  describedBy?: string;
  required?: boolean;
}

export interface FieldLabelProps extends HtmlProps<HTMLElement> {
  /** Renders `label` when `htmlFor` is set, otherwise `span` (pair a span with `aria-labelledby`). */
  as?: Extract<ElementTag, 'label' | 'span' | 'div'>;
  htmlFor?: string;
  optional?: boolean;
  required?: boolean;
  /** Text of the optional marker. @default localized "Optional" */
  optionalLabel?: string;
}

export const FieldLabel = (props: FieldLabelProps) => {
  const [local, rest] = splitProps(props, [
    'as',
    'htmlFor',
    'optional',
    'required',
    'optionalLabel',
    'class',
    'children',
  ]);
  const translate = useTranslate();
  const tag = () => local.as ?? (local.htmlFor ? 'label' : 'span');
  return (
    <Polymorphic
      tag={tag()}
      class={cx('vui-label', local.class)}
      for={tag() === 'label' ? local.htmlFor : undefined}
      {...rest}
    >
      {local.children}
      <Show when={local.required}>
        <span class="vui-label__req" aria-hidden="true">
          *
        </span>
      </Show>
      <Show when={local.optional}>
        <span class="vui-label__opt">{local.optionalLabel ?? translate('velvet.primitives.field.optional')}</span>
      </Show>
    </Polymorphic>
  );
};

export interface FieldHintProps extends HtmlProps<HTMLSpanElement> {
  error?: boolean;
  /** Fixed-height lane that announces changes politely. */
  lane?: boolean;
}

export const FieldHint = (props: FieldHintProps) => {
  const [local, rest] = splitProps(props, ['error', 'lane', 'class', 'children']);
  return (
    <span
      class={cx('vui-hint', local.error && 'vui-hint--error', local.lane && 'vui-hint--lane', local.class)}
      aria-live={local.lane ? 'polite' : undefined}
      {...rest}
    >
      {local.children}
    </span>
  );
};

export interface FieldProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  /** Replaces the hint and turns the control invalid. */
  error?: JSX.Element;
  optional?: boolean;
  required?: boolean;
  optionalLabel?: string;
  id?: string;
  /** Current length for the counter; shown when `maxCount` is set. */
  count?: number;
  maxCount?: number;
  /** Keep the hint lane height so validation messages do not shift layout. */
  reserveHint?: boolean;
  class?: string;
  children?: JSX.Element | ((control: FieldControlProps) => JSX.Element);
}

/** Label + control + hint/error stack with ids and aria wired. Pass a function child to receive the control props. */
export const Field = (props: FieldProps) => {
  const autoId = createUniqueId();
  const id = () => props.id ?? autoId;
  const hintId = () => `${id()}-hint`;
  const hasCounter = () => props.maxCount != null;
  const lane = () => props.reserveHint === true || hasCounter();
  const hasMessage = () => !!(props.error || props.hint);

  const control = (): FieldControlProps => ({
    id: id(),
    invalid: !!props.error,
    describedBy: hasMessage() || hasCounter() ? hintId() : undefined,
    required: props.required,
  });
  const body = () => (typeof props.children === 'function' ? props.children(control()) : props.children);

  return (
    <div class={cx('vui-field', props.class)}>
      <Show when={props.label}>
        <FieldLabel
          htmlFor={id()}
          optional={props.optional}
          required={props.required}
          optionalLabel={props.optionalLabel}
        >
          {props.label}
        </FieldLabel>
      </Show>
      {body()}
      <Show when={hasMessage() || lane()}>
        <div class={cx('vui-field__foot', lane() && 'vui-hint--lane')}>
          <FieldHint id={hintId()} error={!!props.error} lane={lane()}>
            {props.error || props.hint}
          </FieldHint>
          <Show when={hasCounter()}>
            <span
              class={cx(
                'vui-hint',
                'vui-field__count',
                (props.count ?? 0) >= (props.maxCount ?? 0) && 'vui-field__count--max',
              )}
            >
              {props.count ?? 0}/{props.maxCount}
            </span>
          </Show>
        </div>
      </Show>
    </div>
  );
};
