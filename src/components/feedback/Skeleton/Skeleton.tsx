import { type JSX, mergeProps, splitProps } from 'solid-js';

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

const Skeleton = (props: Props<SkeletonOwnProps>) => {
  const merged = mergeProps({ variant: 'text', animation: 'wave' }, props);
  const [local, rest] = splitProps(merged, ['variant', 'width', 'height', 'animation', 'class', 'style']);

  const baseStyle = () => {
    const s: Record<string, string | number> = {};
    if (typeof local.style === 'object') {
      for (const [key, val] of Object.entries(local.style as Record<string, string | number | undefined>)) {
        if (val !== undefined) {
          s[key] = val;
        }
      }
    }
    if (local.width) s.width = typeof local.width === 'number' ? `${local.width}px` : local.width;
    if (local.height) s.height = typeof local.height === 'number' ? `${local.height}px` : local.height;
    return s as JSX.CSSProperties;
  };

  const variantClass = () => {
    if (local.variant === 'circular') return styles.circular;
    if (local.variant === 'rectangular') return styles.rectangular;
    return styles.text;
  };

  const animationClass = () => {
    if (local.animation === 'pulse') return styles.pulse;
    if (local.animation === 'wave') return styles.wave;
    return undefined;
  };

  return (
    <div
      class={classNames(styles.skeleton, variantClass(), animationClass(), local.class)}
      style={baseStyle()}
      {...rest}
    />
  );
};

export default Skeleton;
