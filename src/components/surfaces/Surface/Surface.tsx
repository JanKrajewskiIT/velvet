import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Surface.module.css';

type SurfaceTone = 'default' | 'subtle' | 'inverse';
type SurfaceElevation = 'flat' | 'sm' | 'card' | 'popover' | 'dialog' | 'drawer';
type SurfaceRadius = 'sm' | 'md' | 'lg';

interface SurfaceOwnProps extends DivCoreNativeProps {
  as?: keyof JSX.IntrinsicElements;
  children?: JSX.Element;
  tone?: SurfaceTone;
  elevation?: SurfaceElevation;
  radius?: SurfaceRadius;
  border?: boolean;
  blur?: boolean;
  clip?: boolean;
  ref?: JSX.HTMLAttributes<HTMLDivElement>['ref'];
}

const Surface = (props: Props<SurfaceOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'as',
    'children',
    'tone',
    'elevation',
    'radius',
    'border',
    'blur',
    'clip',
    'class',
    'ref',
  ]);

  const toneClass = () => {
    if (local.tone === 'subtle') return styles.toneSubtle;
    if (local.tone === 'inverse') return styles.toneInverse;
    return styles.toneDefault;
  };

  const elevationClass = () => {
    if (local.elevation === 'flat') return styles.elevationFlat;
    if (local.elevation === 'card') return styles.elevationCard;
    if (local.elevation === 'popover') return styles.elevationPopover;
    if (local.elevation === 'dialog') return styles.elevationDialog;
    if (local.elevation === 'drawer') return styles.elevationDrawer;
    return styles.elevationSm;
  };

  const radiusClass = () => {
    if (local.radius === 'sm') return styles.radiusSm;
    if (local.radius === 'md') return styles.radiusMd;
    return styles.radiusLg;
  };

  return (
    <Dynamic
      component={local.as ?? 'div'}
      ref={local.ref as never}
      class={classNames(
        styles.surface,
        toneClass(),
        elevationClass(),
        radiusClass(),
        local.border !== false && styles.border,
        local.blur && styles.blur,
        local.clip && styles.clip,
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </Dynamic>
  );
};

export default Surface;
export type { SurfaceElevation, SurfaceOwnProps, SurfaceRadius, SurfaceTone };
