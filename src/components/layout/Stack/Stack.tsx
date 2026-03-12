import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Stack.module.css';

type StackGap = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

interface StackOwnProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
  direction?: 'vertical' | 'horizontal';
  gap?: StackGap;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
}

export type StackProps = Props<StackOwnProps>;

const Stack = (props: Props<StackOwnProps>) => {
  const [local, rest] = splitProps(props, ['children', 'direction', 'gap', 'align', 'justify', 'wrap', 'class']);

  const gapClass = () => styles[`gap${local.gap ?? 'md'}`];
  const directionClass = () => styles[local.direction ?? 'vertical'];
  const alignClass = () => styles[`align${local.align ?? 'stretch'}`];
  const justifyClass = () => styles[`justify${local.justify ?? 'start'}`];

  return (
    <div
      {...rest}
      class={classNames(
        styles.stack,
        directionClass(),
        gapClass(),
        alignClass(),
        justifyClass(),
        local.wrap && styles.wrap,
        local.class
      )}
    >
      {local.children}
    </div>
  );
};

export default Stack;
