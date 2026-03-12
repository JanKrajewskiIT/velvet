import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Grid.module.css';

type GridGap = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

interface GridOwnProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
  columns?: number;
  minColumnWidth?: string;
  gap?: GridGap;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
}

export type GridProps = Props<GridOwnProps>;

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

  const style = (): string | JSX.CSSProperties => {
    if (typeof local.style === 'string') {
      return `${local.style};grid-template-columns:${templateColumns()};`;
    }

    return {
      ...(local.style ?? {}),
      'grid-template-columns': templateColumns(),
    };
  };

  return (
    <div
      {...rest}
      style={style()}
      class={classNames(
        styles.grid,
        styles[`gap${local.gap ?? 'md'}`],
        styles[`align${local.alignItems ?? 'stretch'}`],
        styles[`justify${local.justifyItems ?? 'stretch'}`],
        local.class
      )}
    >
      {local.children}
    </div>
  );
};

export default Grid;
