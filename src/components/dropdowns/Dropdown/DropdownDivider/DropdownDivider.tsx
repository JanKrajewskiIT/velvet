import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DropdownDivider.module.css';

const DropdownDivider = (props: Props<DivCoreNativeProps>) => {
  const [local, rest] = splitProps(props, ['class', 'role']);
  return <div {...rest} class={classNames(styles.divider, local.class)} role={local.role ?? 'separator'} />;
};

export default DropdownDivider;
