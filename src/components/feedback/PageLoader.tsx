import { mergeProps, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Loader, type LoaderVariant } from './Loader';

export interface PageLoaderProps extends HtmlProps<HTMLDivElement> {
  /** Fixed over the whole viewport; otherwise absolute inside its positioned parent. @default true */
  fullScreen?: boolean;
  /** @default 'ripple-dots' */
  variant?: LoaderVariant;
  /** @default localized "Loading" */
  label?: string;
}

/** Page veil with a centred Loader. */
export const PageLoader = (props: PageLoaderProps) => {
  const merged = mergeProps({ fullScreen: true, variant: 'ripple-dots' } satisfies PageLoaderProps, props);
  const [local, rest] = splitProps(merged, ['fullScreen', 'variant', 'label', 'class']);
  const translate = useTranslate();
  return (
    <div
      {...rest}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={local.label ?? translate('velvet.common.loading')}
      class={cx('vui-page-loader', local.fullScreen && 'vui-page-loader--full', local.class)}
    >
      <Loader variant={local.variant} decorative />
    </div>
  );
};
