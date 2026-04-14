import { For, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './EllipsisLoader.module.css';

type EllipsisLoaderMessages = LoaderMessages;

export type EllipsisLoaderProps = LoaderBaseProps;

const dotIndexes = [0, 1, 2, 3];

const EllipsisLoader = (props: Props<EllipsisLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'ellipsisLoader.loading',
  });

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.loader, local.class)}
    >
      <For each={dotIndexes}>{(dot) => <div class={styles.dot} data-dot={dot} />}</For>
    </div>
  );
};

export type { EllipsisLoaderMessages };
export default EllipsisLoader;
