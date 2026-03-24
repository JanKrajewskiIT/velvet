import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Stack from '../../surfaces/Stack/Stack';
import styles from './FormLayout.module.css';

interface FormLayoutOwnProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
}

const FormLayout = (props: Props<FormLayoutOwnProps>) => {
  const [local, rest] = splitProps(props, ['children', 'class']);

  return (
    <Stack {...rest} gap="md" class={classNames(styles.form, local.class)}>
      {local.children}
    </Stack>
  );
};

export default FormLayout;
