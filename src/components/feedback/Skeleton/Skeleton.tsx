import { createMemo, type JSX, mergeProps, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Skeleton.module.css';

interface SkeletonOwnProps extends DivCoreNativeProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const variantClassByValue: Record<NonNullable<SkeletonOwnProps['variant']>, string | undefined> = {
  text: styles.text,
  circular: styles.circular,
  rectangular: styles.rectangular,
};

const animationClassByValue: Record<NonNullable<SkeletonOwnProps['animation']>, string | undefined> = {
  pulse: styles.pulse,
  wave: styles.wave,
  none: undefined,
};

const toCssLength = (value: string | number | undefined): string | undefined => {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
};

const Skeleton = (props: Props<SkeletonOwnProps>) => {
  const merged = mergeProps({ variant: 'text' as const, animation: 'wave' as const }, props);
  const [local, rest] = splitProps(merged, ['variant', 'width', 'height', 'animation', 'class']);

  const sizeStyle = createMemo<JSX.CSSProperties>(() => {
    const width = toCssLength(local.width);
    const height = toCssLength(local.height);
    return {
      ...(width !== undefined && { '--skeleton-width': width }),
      ...(height !== undefined && { '--skeleton-height': height }),
    };
  });

  return (
    <div
      {...rest}
      class={classNames(
        styles.skeleton,
        variantClassByValue[local.variant],
        animationClassByValue[local.animation],
        local.class,
      )}
      style={sizeStyle()}
    />
  );
};

export default Skeleton;
