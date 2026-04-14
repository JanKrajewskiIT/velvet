import { createMemo, Match, splitProps, Switch } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ShapeTrailLoader.module.css';

type ShapeTrailLoaderMessages = LoaderMessages;

export type ShapeTrailLoaderShape = 'circle' | 'triangle' | 'square';

export interface ShapeTrailLoaderProps extends LoaderBaseProps {
  shape?: ShapeTrailLoaderShape;
}

const viewBoxByShape: Record<ShapeTrailLoaderShape, string> = {
  circle: '0 0 80 80',
  triangle: '0 0 86 80',
  square: '0 0 80 80',
};

const shapeClassByValue: Record<ShapeTrailLoaderShape, string | undefined> = {
  circle: undefined,
  triangle: styles.triangle,
  square: undefined,
};

const ShapeTrailLoader = (props: Props<ShapeTrailLoaderProps>) => {
  const [local, rest] = splitProps(props, ['class', 'shape', 'label', 'messages']);
  const shape = createMemo<ShapeTrailLoaderShape>(() => local.shape ?? 'circle');
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'shapeTrailLoader.loading',
  });

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.loader, shapeClassByValue[shape()], local.class)}
    >
      <svg viewBox={viewBoxByShape[shape()]} aria-hidden="true">
        <Switch>
          <Match when={shape() === 'triangle'}>
            <polygon points="43 8 79 72 7 72" />
          </Match>
          <Match when={shape() === 'square'}>
            <rect x="8" y="8" width="64" height="64" />
          </Match>
          <Match when={shape() === 'circle'}>
            <circle cx="40" cy="40" r="32" />
          </Match>
        </Switch>
      </svg>
    </div>
  );
};

export type { ShapeTrailLoaderMessages };
export default ShapeTrailLoader;
