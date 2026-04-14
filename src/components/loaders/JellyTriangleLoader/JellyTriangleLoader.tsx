import { createUniqueId, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './JellyTriangleLoader.module.css';

type JellyTriangleLoaderMessages = LoaderMessages;

export type JellyTriangleLoaderProps = LoaderBaseProps;

const JellyTriangleLoader = (props: Props<JellyTriangleLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'jellyTriangleLoader.loading',
  });
  const filterId = `jelly-triangle-ooze-${createUniqueId()}`;

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.loader, local.class)}
      style={{ ...rest.style, '--jelly-filter': `url(#${filterId})` }}
    >
      <div class={styles.dot} />
      <div class={styles.traveler} />
      <svg class={styles.filterDefs} width="0" height="0" aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="7.3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="ooze"
            />
            <feBlend in="SourceGraphic" in2="ooze" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export type { JellyTriangleLoaderMessages };
export default JellyTriangleLoader;
