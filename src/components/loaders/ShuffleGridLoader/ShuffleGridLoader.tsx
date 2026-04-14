import { For, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ShuffleGridLoader.module.css';

type ShuffleGridLoaderMessages = LoaderMessages;

export type ShuffleGridLoaderProps = LoaderBaseProps;

const boxes = Array.from({ length: 9 }, (_, index) => index + 1);

const ShuffleGridLoader = (props: Props<ShuffleGridLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'shuffleGridLoader.loading',
  });

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.loader, local.class)}
    >
      <For each={boxes}>{() => <div class={styles.box} />}</For>
    </div>
  );
};

export type { ShuffleGridLoaderMessages };
export default ShuffleGridLoader;
