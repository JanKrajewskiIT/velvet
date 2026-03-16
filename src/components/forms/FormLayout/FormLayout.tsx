import type { JSX } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './FormLayout.module.css';

interface FormLayoutProps {
  children: JSX.Element;
}

const FormLayout = (props: Props<FormLayoutProps>) => {
  return <div class={classNames(styles.form, props.class)}>{props.children}</div>;
};

export default FormLayout;
