import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import Grid from '../../surfaces/Grid/Grid';
import styles from './FormGrid.module.css';

interface FormGridOwnProps extends DivCoreNativeProps {
  children: JSX.Element;
}

const FormGrid = (props: Props<FormGridOwnProps>) => {
  const [local, rest] = splitProps(props, ['children', 'class']);

  return (
    <Grid {...rest} minColumnWidth="280px" gap="md" class={classNames(styles.grid, local.class)}>
      {local.children}
    </Grid>
  );
};

export default FormGrid;
