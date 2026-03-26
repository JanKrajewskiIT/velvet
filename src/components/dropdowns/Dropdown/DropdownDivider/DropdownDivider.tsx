import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DropdownDivider.module.css';

const DropdownDivider = (props: Props<DivCoreNativeProps>) => {
  return <div {...props} class={classNames(styles.divider, props.class)} role={props.role ?? 'separator'} />;
};

export default DropdownDivider;
