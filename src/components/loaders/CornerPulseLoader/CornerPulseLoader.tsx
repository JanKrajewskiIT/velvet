import { For, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './CornerPulseLoader.module.css';

type CornerPulseLoaderMessages = LoaderMessages;

export type CornerPulseLoaderProps = LoaderBaseProps;

const circles = [0, 1, 2, 3];

const CornerPulseLoader = (props: Props<CornerPulseLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'cornerPulseLoader.loading',
  });

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.loader, local.class)}
    >
      <For each={circles}>{() => <span class={styles.circle} />}</For>
    </div>
  );
};

export type { CornerPulseLoaderMessages };
export default CornerPulseLoader;
