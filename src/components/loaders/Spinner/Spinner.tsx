import { createMemo, splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import type { ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Spinner.module.css';

type SpinnerMessages = LoaderMessages;

export interface SpinnerProps extends LoaderBaseProps {
  size?: ComponentSize;
}

const sizeClassByValue: Record<NonNullable<SpinnerProps['size']>, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const Spinner = (props: Props<SpinnerProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'spinner.loading',
  });
  const sizeClass = createMemo(() => sizeClassByValue[local.size ?? 'lg']);

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.spinner, sizeClass(), local.class)}
    />
  );
};

export type { SpinnerMessages };
export default Spinner;
