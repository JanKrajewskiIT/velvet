import { JSX, mergeProps, splitProps } from 'solid-js';

import styles from './Skeleton.module.css';

export interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = (props: SkeletonProps) => {
  const merged = mergeProps({ variant: 'text', animation: 'wave' }, props);
  const [local, rest] = splitProps(merged, [
    'variant',
    'width',
    'height',
    'animation',
    'class',
    'style',
  ]);

  const baseStyle = () => {
    const s: Record<string, string | number> = {};
    if (typeof local.style === 'object' && local.style) {
      for (const [key, val] of Object.entries(
        local.style as Record<string, string | number | undefined>
      )) {
        if (val !== undefined) {
          s[key] = val;
        }
      }
    }
    if (local.width)
      s.width =
        typeof local.width === 'number' ? `${local.width}px` : local.width;
    if (local.height)
      s.height =
        typeof local.height === 'number' ? `${local.height}px` : local.height;
    return s as JSX.CSSProperties;
  };

  return (
    <div
      class={`${styles.skeleton} ${styles[local.variant]} ${styles[local.animation]} ${local.class || ''}`}
      style={baseStyle()}
      {...rest}
    />
  );
};
