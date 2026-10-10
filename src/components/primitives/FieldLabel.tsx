import { Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';

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
