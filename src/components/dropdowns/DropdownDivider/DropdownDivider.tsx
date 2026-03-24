import type { JSX } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DropdownDivider.module.css';

type DropdownDividerProps = JSX.HTMLAttributes<HTMLDivElement>;

const DropdownDivider = (props: Props<DropdownDividerProps>) => {
  return <div {...props} class={classNames(styles.divider, props.class)} role={props.role ?? 'separator'} />;
};

export default DropdownDivider;
