import { type JSX, splitProps } from 'solid-js';

import { resolveSpacingToken, type SpacingScale } from '~/components/surfaces/shared/spacing';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Stack.module.css';

interface StackOwnProps extends DivCoreNativeProps {
  children: JSX.Element;
  direction?: 'vertical' | 'horizontal';
  gap?: SpacingScale;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
}

export type StackProps = Props<StackOwnProps>;

const alignToClass: Record<NonNullable<StackOwnProps['align']>, string | undefined> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
  baseline: styles.alignBaseline,
};

const justifyToClass: Record<NonNullable<StackOwnProps['justify']>, string | undefined> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
  around: styles.justifyAround,
  evenly: styles.justifyEvenly,
};

const directionClassByValue: Record<NonNullable<StackOwnProps['direction']>, string | undefined> = {
  vertical: styles.vertical,
  horizontal: styles.horizontal,
};

const Stack = (props: Props<StackOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'children',
    'direction',
    'gap',
    'align',
    'justify',
    'wrap',
    'style',
    'class',
  ]);

  const directionClass = () => directionClassByValue[local.direction ?? 'vertical'];
  const alignClass = () => alignToClass[local.align ?? 'stretch'];
  const justifyClass = () => justifyToClass[local.justify ?? 'start'];

  const style = (): JSX.CSSProperties => {
    const base = typeof local.style === 'object' ? (local.style ?? {}) : {};
    return {
      ...base,
      '--stack-gap': resolveSpacingToken(local.gap),
    };
  };

  return (
    <div
      {...rest}
      style={style()}
      class={classNames(
        styles.stack,
        directionClass(),
        alignClass(),
        justifyClass(),
        local.wrap && styles.wrap,
        local.class,
      )}
    >
      {local.children}
    </div>
  );
};

export default Stack;
