import { For, type JSX, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './EqualizerLoader.module.css';

type EqualizerLoaderMessages = LoaderMessages;

export type EqualizerLoaderProps = LoaderBaseProps;

const barDelays = ['0s', '0.3s', '0.45s'];

const EqualizerLoader = (props: Props<EqualizerLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'equalizerLoader.loading',
  });

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.loader, local.class)}
    >
      <For each={barDelays}>
        {(delay) => (
          <span
            class={styles.bar}
            style={
              {
                '--equalizer-delay': delay,
              } as JSX.CSSProperties
            }
          />
        )}
      </For>
    </div>
  );
};

export type { EqualizerLoaderMessages };
export default EqualizerLoader;
