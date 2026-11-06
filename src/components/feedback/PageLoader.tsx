import { mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import { Loader, type LoaderVariant } from './Loader';
import styles from './PageLoader.module.css';

export interface PageLoaderProps extends HtmlProps<HTMLDivElement> {
  /** Fixed over the whole viewport; otherwise absolute inside its positioned parent. @default true */
  fullScreen?: boolean;
  /** @default 'ripple-dots' */
  variant?: LoaderVariant;
  /** @default localized "Loading" */
  label?: string;
  /** Hide from assistive technology when a page-level live region owns announcements. */
  decorative?: boolean;
}

/** Page veil with a centred Loader. */
export const PageLoader = (props: PageLoaderProps) => {
  const merged = mergeProps({ fullScreen: true, variant: 'ripple-dots' } satisfies PageLoaderProps, props);
  const [local, rest] = splitProps(merged, ['fullScreen', 'variant', 'label', 'decorative', 'class']);
  const translate = useTranslate();
  return (
    <div
      {...rest}
      role={local.decorative ? undefined : 'status'}
      aria-live={local.decorative ? undefined : 'polite'}
      aria-atomic={local.decorative ? undefined : true}
      aria-hidden={local.decorative || rest['aria-hidden']}
      class={cx(styles.pageLoader, local.fullScreen && styles.pageLoaderVariantFull, local.class)}
    >
      <Loader variant={local.variant} decorative />
      <Show when={!local.decorative}>
        <VisuallyHidden>{local.label ?? translate('velvet.common.loading')}</VisuallyHidden>
      </Show>
    </div>
  );
};
