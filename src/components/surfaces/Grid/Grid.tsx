import { type JSX, splitProps } from 'solid-js';

import { resolveSpacingToken, type SpacingScale } from '~/components/surfaces/shared/spacing';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Grid.module.css';

interface GridOwnProps extends DivCoreNativeProps {
  children: JSX.Element;
  columns?: number;
  minColumnWidth?: string;
  gap?: SpacingScale;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
}

export type GridProps = Props<GridOwnProps>;

const alignToClass: Record<NonNullable<GridOwnProps['alignItems']>, string | undefined> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
};

const justifyToClass: Record<NonNullable<GridOwnProps['justifyItems']>, string | undefined> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  stretch: styles.justifyStretch,
};

const Grid = (props: Props<GridOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'children',
    'columns',
    'minColumnWidth',
    'gap',
    'alignItems',
    'justifyItems',
    'style',
    'class',
  ]);

  const templateColumns = () => {
    if (local.minColumnWidth) {
      return `repeat(auto-fit, minmax(${local.minColumnWidth}, 1fr))`;
    }

    return `repeat(${String(local.columns ?? 12)}, minmax(0, 1fr))`;
  };

  const style = (): JSX.CSSProperties => {
    const base = typeof local.style === 'object' ? (local.style ?? {}) : {};
    return {
      ...base,
      '--grid-gap': resolveSpacingToken(local.gap),
      '--grid-template-columns': templateColumns(),
    };
  };

  return (
    <div
      {...rest}
      style={style()}
      class={classNames(
        styles.grid,
        alignToClass[local.alignItems ?? 'stretch'],
        justifyToClass[local.justifyItems ?? 'stretch'],
        local.class,
      )}
    >
      {local.children}
    </div>
  );
};

export default Grid;
