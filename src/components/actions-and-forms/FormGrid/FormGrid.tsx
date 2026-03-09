import type { JSX } from 'solid-js';

import type Props from '../../../models/Props';
import styles from './FormGrid.module.css';

interface FormGridProps {
  children: JSX.Element;
}

const FormGrid = (props: Props<FormGridProps>) => {
  return (
    <div class={`${styles.grid} ${props.class ?? ''}`}>{props.children}</div>
  );
};

export default FormGrid;
