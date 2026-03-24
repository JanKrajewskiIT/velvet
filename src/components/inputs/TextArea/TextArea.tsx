import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import FieldBase from '../FieldBase/FieldBase';
import type { InputSize } from '../Input/Input';
import styles from './TextArea.module.css';

interface TextAreaOwnProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: InputSize;
  invalid?: boolean;
}

const TextArea = (props: Props<TextAreaOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'invalid', 'readOnly']);

  return (
    <FieldBase
      as="textarea"
      {...rest}
      size={local.size}
      invalid={local.invalid}
      readOnly={local.readOnly}
      disabled={rest.disabled}
      focusStyle="visible"
      aria-invalid={local.invalid || undefined}
      class={classNames(styles.root, local.class)}
    />
  );
};

export default TextArea;
