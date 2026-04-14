import { splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './BikeLoader.module.css';

type BikeLoaderMessages = LoaderMessages;

export type BikeLoaderProps = LoaderBaseProps;

const BikeLoader = (props: Props<BikeLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'bikeLoader.loading',
  });

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.wrapper, local.class)}
    >
      <svg class={styles.loader} viewBox="0 0 48 30" width="48" height="30" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">
          <g transform="translate(9.5,19)">
            <circle class={styles.tire} r="9" stroke-dasharray="56.549 56.549" />
            <g class={styles.spokesSpin} stroke-dasharray="31.416 31.416" stroke-dashoffset="-23.562">
              <circle class={styles.spokes} r="5" />
              <circle class={styles.spokes} r="5" transform="rotate(180,0,0)" />
            </g>
          </g>
          <g transform="translate(24,19)">
            <g
              class={styles.pedalsSpin}
              stroke-dasharray="25.133 25.133"
              stroke-dashoffset="-21.991"
              transform="rotate(67.5,0,0)"
            >
              <circle class={styles.pedals} r="4" />
              <circle class={styles.pedals} r="4" transform="rotate(180,0,0)" />
            </g>
          </g>
          <g transform="translate(38.5,19)">
            <circle class={styles.tire} r="9" stroke-dasharray="56.549 56.549" />
            <g class={styles.spokesSpin} stroke-dasharray="31.416 31.416" stroke-dashoffset="-23.562">
              <circle class={styles.spokes} r="5" />
              <circle class={styles.spokes} r="5" transform="rotate(180,0,0)" />
            </g>
          </g>
          <polyline class={styles.seat} points="14 3,18 3" stroke-dasharray="5 5" />
          <polyline class={styles.body} points="16 3,24 19,9.5 19,18 8,34 7,24 19" stroke-dasharray="79 79" />
          <path class={styles.handlebars} d="m30,2h6s1,0,1,1-1,1-1,1" stroke-dasharray="10 10" />
          <polyline class={styles.front} points="32.5 2,38.5 19" stroke-dasharray="19 19" />
        </g>
      </svg>
    </div>
  );
};

export type { BikeLoaderMessages };
export default BikeLoader;
