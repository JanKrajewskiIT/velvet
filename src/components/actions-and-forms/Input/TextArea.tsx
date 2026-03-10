import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Input.module.css';

const TextArea = (
  props: Props<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>>
) => {
  const [local, rest] = splitProps(props, ['class']);
  return (
    <textarea {...rest} class={`${styles.textarea} ${local.class ?? ''}`} />
  );
};

export default TextArea;
