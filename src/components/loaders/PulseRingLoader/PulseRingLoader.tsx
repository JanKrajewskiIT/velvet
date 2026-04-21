import { For, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './PulseRingLoader.module.css';

type PulseRingLoaderMessages = LoaderMessages;

export type PulseRingLoaderProps = LoaderBaseProps;

const delayFactors = [0, -0.875, -0.75, -0.625, -0.5, -0.375, -0.25, -0.125];

const dots = Array.from({ length: 8 }, (_, index) => ({
  angle: `${index * 45}deg`,
  delayFactor: `${delayFactors[index]}`,
}));

const PulseRingLoader = (props: Props<PulseRingLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'pulseRingLoader.loading',
  });

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.loader, local.class)}
    >
      <For each={dots}>
        {(dot) => (
          <span
            class={styles.dot}
            style={{
              '--dot-angle': dot.angle,
              '--dot-delay-factor': dot.delayFactor,
            }}
          />
        )}
      </For>
    </div>
  );
};

export type { PulseRingLoaderMessages };
export default PulseRingLoader;
