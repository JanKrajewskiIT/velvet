import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import Surface from '../../../surfaces/Surface/Surface';
import styles from './DropdownSurface.module.css';

export interface DropdownSurfaceProps extends DivCoreNativeProps {
  scrollable?: boolean;
  panel?: boolean;
  align?: 'left' | 'right' | 'fullWidth';
  origin?: 'top' | 'topLeft';
  ref?: JSX.HTMLAttributes<HTMLDivElement>['ref'];
}

const DropdownSurface = (props: Props<DropdownSurfaceProps>) => {
  const [local, rest] = splitProps(props, ['class', 'scrollable', 'panel', 'align', 'origin', 'ref']);

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
    <Surface
      {...rest}
      ref={local.ref}
      radius="md"
      elevation="popover"
      blur
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
