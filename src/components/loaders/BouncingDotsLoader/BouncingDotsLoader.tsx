import { For, type JSX, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './BouncingDotsLoader.module.css';

type BouncingDotsLoaderMessages = LoaderMessages;

export type BouncingDotsLoaderProps = LoaderBaseProps;

type DotConfig = {
  left: string;
  delay: number;
};

const dots: DotConfig[] = [
  { left: '15%', delay: 0 },
  { left: '45%', delay: 0.2 },
  { left: '75%', delay: 0.3 },
];

const BouncingDotsLoader = (props: Props<BouncingDotsLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'bouncingDotsLoader.loading',
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
          <>
            <div
              class={styles.dot}
              style={
                {
                  '--dot-left': dot.left,
                  '--dot-delay': `${dot.delay}s`,
                } as JSX.CSSProperties
              }
            />
            <div
              class={styles.shadow}
              style={
                {
                  '--dot-left': dot.left,
                  '--dot-delay': `${dot.delay}s`,
                } as JSX.CSSProperties
              }
            />
          </>
        )}
      </For>
    </div>
  );
};

export type { BouncingDotsLoaderMessages };
export default BouncingDotsLoader;
