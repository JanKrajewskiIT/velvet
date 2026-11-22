import { type JSX } from '@solidjs/web';

import { cx } from '../../utils/cx';
import { partitionProps } from '../../utils/props';
import styles from './ControlInput.module.css';
import { type TextVariant, typographyClass } from './typography';

export interface ControlInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  /** Foundation role for native editable text. @default 'body' */
  textVariant?: TextVariant;
}

export const ControlInput = (props: ControlInputProps) => {
  const [local, rest] = partitionProps(props, ['class', 'textVariant']);
  return <input {...rest} class={cx(styles.input, typographyClass(local.textVariant ?? 'body'), local.class)} />;
};
