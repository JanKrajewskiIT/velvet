import { For, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ConcentricPulseLoader.module.css';

type ConcentricPulseLoaderMessages = LoaderMessages;

export type ConcentricPulseLoaderProps = LoaderBaseProps;

const circles = ['90px', '60px', '30px'];

const ConcentricPulseLoader = (props: Props<ConcentricPulseLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'concentricPulseLoader.loading',
  });

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.loader, local.class)}
    >
      <For each={circles}>
        {(size) => (
          <span
            class={styles.circle}
            style={{
              '--concentric-size': size,
            }}
          />
        )}
      </For>
    </div>
  );
};

export type { ConcentricPulseLoaderMessages };
export default ConcentricPulseLoader;
