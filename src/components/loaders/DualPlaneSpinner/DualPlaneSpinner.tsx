import { splitProps } from 'solid-js';

import type { LoaderBaseProps, LoaderMessages } from '~/hooks/useLoaderA11y';
import useLoaderA11y from '~/hooks/useLoaderA11y';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DualPlaneSpinner.module.css';

type DualPlaneSpinnerMessages = LoaderMessages;

export type DualPlaneSpinnerProps = LoaderBaseProps;

const DualPlaneSpinner = (props: Props<DualPlaneSpinnerProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'messages']);
  const loaderA11y = useLoaderA11y({
    ariaHidden: () => rest['aria-hidden'],
    ariaLabel: () => rest['aria-label'],
    label: () => local.label,
    messages: () => local.messages,
    role: () => rest.role,
    translationKey: 'dualPlaneSpinner.loading',
  });

  return (
    <div
      {...rest}
      role={loaderA11y.role()}
      aria-label={loaderA11y.ariaLabel()}
      class={classNames(styles.spinner, local.class)}
    />
  );
};

export type { DualPlaneSpinnerMessages };
export default DualPlaneSpinner;
