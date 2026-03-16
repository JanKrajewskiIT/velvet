import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DropdownBase.module.css';

interface DropdownSurfaceOwnProps extends JSX.HTMLAttributes<HTMLDivElement> {
  scrollable?: boolean;
}

const DropdownSurface = (props: Props<DropdownSurfaceOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'scrollable']);

  return (
    <div {...rest} class={classNames(styles.surface, local.scrollable !== false && styles.scrollable, local.class)} />
  );
};

export default DropdownSurface;
