import { createMemo, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import RippleDotsLoader from '../RippleDotsLoader/RippleDotsLoader';
import styles from './PageLoader.module.css';

type PageLoaderMessages = LoaderMessages;

export interface PageLoaderProps extends LoaderBaseProps {
  fullScreen?: boolean;
}

const PageLoader = (props: Props<PageLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages', 'fullScreen']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'pageLoader.loading',
  });
  const fullScreen = createMemo(() => local.fullScreen ?? true);

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-busy={loaderA11y.isAriaHidden() ? undefined : 'true'}
      aria-live={loaderA11y.isAriaHidden() ? undefined : 'polite'}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.loader, fullScreen() ? styles.fullScreen : styles.contained, local.class)}
    >
      <RippleDotsLoader aria-hidden="true" />
    </div>
  );
};

export type { PageLoaderMessages };
export default PageLoader;
