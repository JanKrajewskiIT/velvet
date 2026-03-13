import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { InputSize } from './Input';
import styles from './Input.module.css';

interface TextAreaOwnProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: InputSize;
  invalid?: boolean;
}

const TextArea = (props: Props<TextAreaOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'invalid', 'readOnly']);
  const sizeClass = () => {
    if (local.size === 'sm') return styles.sizeSm;
    if (local.size === 'lg') return styles.sizeLg;
    return styles.sizeMd;
  };

  return (
    <textarea
      {...rest}
      readOnly={local.readOnly}
      aria-invalid={local.invalid || undefined}
      class={classNames(
        styles.textarea,
        sizeClass(),
        local.invalid && styles.invalid,
        local.readOnly && styles.readOnly,
        local.class
      )}
    />
  );
};

export default TextArea;
