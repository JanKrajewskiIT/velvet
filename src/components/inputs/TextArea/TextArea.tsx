import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { ComponentSize, TextAreaCoreNativeProps } from '~/models/Props';
import { resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';

import FieldBase from '../FieldBase/FieldBase';
import styles from './TextArea.module.css';

interface TextAreaOwnProps extends TextAreaCoreNativeProps {
  size?: ComponentSize;
  invalid?: boolean;
}

const TextArea = (props: Props<TextAreaOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'invalid', 'readOnly', 'aria-invalid']);

  return (
    <FieldBase
      as="textarea"
      {...rest}
      size={local.size}
      invalid={local.invalid}
      readOnly={local.readOnly}
      disabled={rest.disabled}
      focusStyle="visible"
      aria-invalid={resolveAriaInvalid(local.invalid, local['aria-invalid'] as boolean | 'true' | 'false' | undefined)}
      class={classNames(styles.root, local.class)}
    />
  );
};

export default TextArea;
export type { TextAreaOwnProps };
