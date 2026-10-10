import { createUniqueId, type JSX, mergeProps, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { LOADER_BODIES, LOADER_CLASS_SUFFIX, type LoaderShape } from './loaderBodies';

export type LoaderVariant = keyof typeof LOADER_CLASS_SUFFIX;

export const LOADER_VARIANTS: readonly LoaderVariant[] = Object.freeze(
  Object.keys(LOADER_CLASS_SUFFIX) as LoaderVariant[],
);

export interface LoaderProps extends HtmlProps<HTMLDivElement> {
  /** @default 'ripple-dots' */
  variant?: LoaderVariant;
  /** `shape-trail` only. @default 'circle' */
  shape?: LoaderShape;
  /** Uniform scale multiplier (CSS zoom) — native sizes are the legacy px sizes. @default 1 */
  scale?: number;
  /** `current` inherits the text colour. @default 'brand' */
  tone?: 'brand' | 'current';
  /** Accessible label (`role="status"`). @default localized "Loading" */
  label?: string;
  /** Hide from assistive tech (when a parent already announces loading). */
  decorative?: boolean;
}

/** Decorative brand loaders for page / hero / empty-wait moments; for inline and button waits use Spinner. Animation stops under reduced motion. */
export const Loader = (props: LoaderProps) => {
  const merged = mergeProps(
    { variant: 'ripple-dots', shape: 'circle', scale: 1, tone: 'brand', decorative: false } satisfies LoaderProps,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'variant',
    'shape',
    'scale',
    'tone',
    'label',
    'decorative',
    'class',
    'style',
  ]);
  const translate = useTranslate();
  const filterId = `vui-jelly-${createUniqueId()}`;

  const style = (): JSX.CSSProperties => ({
    ...(local.scale !== 1 && { zoom: local.scale }),
    ...(local.tone === 'current' && { '--ld-c': 'currentColor' }),
    ...(local.variant === 'jelly-triangle' && { '--jf': `url(#${filterId})` }),
    ...local.style,
  });

  return (
    <div
      {...rest}
      role={local.decorative ? undefined : 'status'}
      aria-label={local.decorative ? undefined : (local.label ?? translate('velvet.common.loading'))}
      aria-hidden={local.decorative || undefined}
      class={cx(
        'vui-ld',
        `vui-ld-${LOADER_CLASS_SUFFIX[local.variant]}`,
        local.variant === 'shape-trail' && local.shape === 'triangle' && 'vui-ld-trail--triangle',
        local.class,
      )}
      style={style()}
    >
      {LOADER_BODIES[local.variant]({ filterId, shape: local.shape })}
    </div>
  );
};
