import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import styles from './Input.module.css';

type TextAreaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = (props: TextAreaProps) => {
  const [local, rest] = splitProps(props, ['class']);
  return (
    <textarea {...rest} class={`${styles.textarea} ${local.class ?? ''}`} />
  );
};

export default TextArea;
