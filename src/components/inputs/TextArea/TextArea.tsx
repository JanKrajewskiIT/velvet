import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';
import getInputSizeClass from '~/utils/getInputSizeClass';

import type { InputSize } from '../Input/Input';
import styles from './TextArea.module.css';

interface TextAreaOwnProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: InputSize;
  invalid?: boolean;
}

const TextArea = (props: Props<TextAreaOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'invalid', 'readOnly']);
  const sizeClass = () => getInputSizeClass(styles, local.size);

  return (
    <textarea
      {...rest}
      readOnly={local.readOnly}
      aria-invalid={local.invalid || undefined}
      class={classNames(
        styles.root,
        sizeClass(),
        local.invalid && styles.invalid,
        local.readOnly && styles.readOnly,
        rest.disabled && styles.disabled,
        local.class
      )}
    />
  );
};

export default TextArea;
