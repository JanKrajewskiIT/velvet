import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DropdownSurface.module.css';

export interface DropdownSurfaceProps extends JSX.HTMLAttributes<HTMLDivElement> {
  scrollable?: boolean;
  panel?: boolean;
  align?: 'left' | 'right' | 'fullWidth';
  origin?: 'top' | 'topLeft';
}

const DropdownSurface = (props: Props<DropdownSurfaceProps>) => {
  const [local, rest] = splitProps(props, ['class', 'scrollable', 'panel', 'align', 'origin']);

  const alignClass = () => {
    if (local.align === 'right') return styles.panelRight;
    if (local.align === 'fullWidth') return styles.panelFullWidth;
    return styles.panelLeft;
  };

  const originClass = () => {
    if (local.origin === 'topLeft') return styles.originTopLeft;
    return styles.originTop;
  };

  return (
    <div
      {...rest}
      class={classNames(
        styles.surface,
        local.panel !== false && styles.panel,
        local.panel !== false && alignClass(),
        local.panel !== false && originClass(),
        local.scrollable !== false && styles.scrollable,
        local.class
      )}
    />
  );
};

export default DropdownSurface;
