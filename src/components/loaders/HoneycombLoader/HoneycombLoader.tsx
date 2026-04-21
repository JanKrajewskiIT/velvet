import { For, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './HoneycombLoader.module.css';

type HoneycombLoaderMessages = LoaderMessages;

export type HoneycombLoaderProps = LoaderBaseProps;

type GelPoint = {
  x: number;
  y: number;
  delay: number;
};

const gelPoints: GelPoint[] = [
  { x: -15, y: -15, delay: 0 },
  { x: -47, y: -15, delay: 0.2 },
  { x: -31, y: -43, delay: 0.2 },
  { x: 1, y: -43, delay: 0.2 },
  { x: 17, y: -15, delay: 0.2 },
  { x: -31, y: 13, delay: 0.2 },
  { x: 1, y: 13, delay: 0.2 },
  { x: -63, y: -43, delay: 0.4 },
  { x: 33, y: -43, delay: 0.4 },
  { x: -15, y: 41, delay: 0.4 },
  { x: -63, y: 13, delay: 0.4 },
  { x: 33, y: 13, delay: 0.4 },
  { x: -15, y: -71, delay: 0.4 },
  { x: -47, y: -71, delay: 0.4 },
  { x: 17, y: -71, delay: 0.4 },
  { x: -47, y: 41, delay: 0.4 },
  { x: 17, y: 41, delay: 0.4 },
  { x: -79, y: -15, delay: 0.4 },
  { x: 49, y: -15, delay: 0.4 },
  { x: -63, y: -99, delay: 0.6 },
  { x: 33, y: -99, delay: 0.6 },
  { x: 1, y: -99, delay: 0.6 },
  { x: -31, y: -99, delay: 0.6 },
  { x: -63, y: 69, delay: 0.6 },
  { x: 33, y: 69, delay: 0.6 },
  { x: 1, y: 69, delay: 0.6 },
  { x: -31, y: 69, delay: 0.6 },
  { x: -95, y: -43, delay: 0.6 },
  { x: -95, y: 13, delay: 0.6 },
  { x: 49, y: 41, delay: 0.6 },
  { x: -79, y: -71, delay: 0.6 },
  { x: -111, y: -15, delay: 0.6 },
  { x: 65, y: -43, delay: 0.6 },
  { x: 65, y: 13, delay: 0.6 },
  { x: -79, y: 41, delay: 0.6 },
  { x: 49, y: -71, delay: 0.6 },
  { x: 81, y: -15, delay: 0.6 },
];

const HoneycombLoader = (props: Props<HoneycombLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'honeycombLoader.loading',
  });

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.loader, local.class)}
    >
      <div class={styles.socket}>
        <For each={gelPoints}>
          {(point) => (
            <div
              class={styles.gel}
              style={{
                '--gel-x': `${point.x}px`,
                '--gel-y': `${point.y}px`,
                '--gel-delay': `${point.delay}s`,
              }}
            >
              <div class={classNames(styles.hexBrick, styles.h1)} />
              <div class={classNames(styles.hexBrick, styles.h2)} />
              <div class={classNames(styles.hexBrick, styles.h3)} />
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export type { HoneycombLoaderMessages };
export default HoneycombLoader;
