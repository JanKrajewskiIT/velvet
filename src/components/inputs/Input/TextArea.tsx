import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { InputSize } from './Input';
import styles from './Input.module.css';

interface TextAreaOwnProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: InputSize;
}

const TextArea = (props: Props<TextAreaOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size']);
  const sizeClass = () => {
    if (local.size === 'sm') return styles.sizeSm;
    if (local.size === 'lg') return styles.sizeLg;
    return styles.sizeMd;
  };

  return <textarea {...rest} class={classNames(styles.textarea, sizeClass(), local.class)} />;
};

export default TextArea;
