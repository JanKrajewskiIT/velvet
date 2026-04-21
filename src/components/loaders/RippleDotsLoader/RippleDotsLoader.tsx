import { For, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './RippleDotsLoader.module.css';

type RippleDotsLoaderMessages = LoaderMessages;

export type RippleDotsLoaderProps = LoaderBaseProps;

const delays = ['-0.3s', '-0.1s', '0.1s', '0.3s', '0.5s'];

const RippleDotsLoader = (props: Props<RippleDotsLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'rippleDotsLoader.loading',
  });

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.loader, local.class)}
    >
      <For each={delays}>
        {(delay) => (
          <span
            class={styles.dot}
            style={{
              '--ripple-delay': delay,
            }}
          />
        )}
      </For>
    </div>
  );
};

export type { RippleDotsLoaderMessages };
export default RippleDotsLoader;
