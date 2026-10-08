import { type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type IconName, VelvetIcons } from './VelvetIcons';

const DEFAULT_STROKE_WIDTH = 1.75;
const DEFAULT_SIZE = '1.15em';

export interface IconProps extends Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'style' | 'color' | 'children'> {
  /** Velvet icon name, e.g. `"arrow-right"`. See `VelvetIcons` for the full list. */
  name: IconName;
  /** Pixel size or any CSS length. @default '1.15em' */
  size?: number | string;
  color?: string;
  /** Use 1.5 at ≥32px, 2 at ≤14px. @default 1.75 */
  strokeWidth?: number;
  /** Accessible label; omit for decorative icons. */
  label?: string;
  style?: JSX.CSSProperties;
}

/** Velvet Icons glyph as inline SVG. Inherits `currentColor`; 24px grid. For plain HTML use `<i class="vui-icon icon-NAME">`. */
export const Icon = (props: IconProps) => {
  const merged = mergeProps(
    { size: DEFAULT_SIZE, strokeWidth: DEFAULT_STROKE_WIDTH } satisfies Partial<IconProps>,
    props,
  );
  const [local, rest] = splitProps(merged, ['name', 'size', 'color', 'strokeWidth', 'label', 'class', 'style']);
  return (
    <svg
      {...rest}
      viewBox="0 0 24 24"
      width={local.size}
      height={local.size}
      fill="none"
      stroke="currentColor"
      stroke-width={local.strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
      class={cx('vui-svg-icon', local.class)}
      style={{ flex: 'none', color: local.color, 'vertical-align': '-0.18em', ...local.style }}
      aria-hidden={local.label ? undefined : 'true'}
      aria-label={local.label}
      role={local.label ? 'img' : undefined}
      // eslint-disable-next-line solid/no-innerhtml -- markup comes from the static, library-owned VelvetIcons map
      innerHTML={VelvetIcons[local.name]}
    />
  );
};
