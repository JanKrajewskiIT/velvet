import { createMemo, mergeProps, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './Watermark.module.css';
import { buildWatermarkTile } from './watermarkTile';

export interface WatermarkProps extends HtmlProps<HTMLDivElement> {
  /** @default localized "Confidential" */
  text?: string;
  /** Multi-line stamp, e.g. `['anna@velvet.io', '2026-10-06']` — overrides `text`. */
  lines?: readonly string[];
  /** Degrees. @default -24 */
  rotate?: number;
  /** [x, y] px between stamps. @default [96, 72] */
  gap?: readonly [number, number];
  /** @default 14 */
  fontSize?: number;
  /** @default 600 */
  fontWeight?: number;
  /** 0.05–0.12 keeps content readable. @default 0.08 */
  opacity?: number;
}

/**
 * Repeating diagonal text over its children — "Confidential", "Draft", the viewer's email on shared documents.
 * Painted with `--fg-primary` through a CSS mask, so it follows the theme. Never intercepts clicks or selection.
 * Deterrent only — not access control.
 */
export const Watermark = (props: WatermarkProps) => {
  const merged = mergeProps(
    { rotate: -24, gap: [96, 72], fontSize: 14, fontWeight: 600, opacity: 0.08 } satisfies WatermarkProps,
    props,
  );
  const translate = useTranslate();
  const [local, rest] = splitProps(merged, [
    'text',
    'lines',
    'rotate',
    'gap',
    'fontSize',
    'fontWeight',
    'opacity',
    'class',
    'children',
  ]);
  const tile = createMemo(() =>
    buildWatermarkTile({
      lines: local.lines ?? [local.text ?? translate('velvet.display.watermark.text')],
      rotate: local.rotate,
      gap: local.gap,
      fontSize: local.fontSize,
      fontWeight: local.fontWeight,
    }),
  );
  return (
    <div {...rest} class={cx(styles.watermark, local.class)}>
      {local.children}
      <div
        class={styles.watermarkPartLayer}
        aria-hidden="true"
        style={{
          '-webkit-mask-image': tile().image,
          'mask-image': tile().image,
          '-webkit-mask-size': tile().size,
          'mask-size': tile().size,
          opacity: local.opacity,
        }}
      />
    </div>
  );
};
