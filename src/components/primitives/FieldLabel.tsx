import { Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { ElementTag, HtmlProps } from '../../utils/polymorphic';
import styles from './FieldLabel.module.css';
import { Text } from './Text';

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
    <Text
      {...rest}
      as={tag()}
      variant="label"
      tone="inherit"
      class={cx(styles.label, local.class)}
      for={tag() === 'label' ? local.htmlFor : undefined}
    >
      {local.children}
      <Show when={local.required}>
        <span class={styles.labelPartReq} aria-hidden="true">
          *
        </span>
      </Show>
      <Show when={local.optional}>
        <Text as="span" variant="body-sm" tone="inherit" class={styles.labelPartOpt}>
          {local.optionalLabel ?? translate('velvet.primitives.field.optional')}
        </Text>
      </Show>
    </Text>
  );
};
