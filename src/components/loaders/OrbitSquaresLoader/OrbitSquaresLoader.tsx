import { For, type JSX, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './OrbitSquaresLoader.module.css';

type OrbitSquaresLoaderMessages = LoaderMessages;

export type OrbitSquaresLoaderProps = LoaderBaseProps;

const squareDelays = [0, -1.4286, -2.8571, -4.2857, -5.7143, -7.1429, -8.5714];

const OrbitSquaresLoader = (props: Props<OrbitSquaresLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'orbitSquaresLoader.loading',
  });

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.loader, local.class)}
    >
      <For each={squareDelays}>
        {(delay) => (
          <div
            class={styles.square}
            style={
              {
                '--square-delay': `${delay}s`,
              } as JSX.CSSProperties
            }
          />
        )}
      </For>
    </div>
  );
};

export type { OrbitSquaresLoaderMessages };
export default OrbitSquaresLoader;
