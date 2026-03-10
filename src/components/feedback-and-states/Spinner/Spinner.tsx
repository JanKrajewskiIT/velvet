import type Props from '~/models/Props';

import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const Spinner = (props: Props<SpinnerProps>) => {
  return (
    <div
      role="status"
      aria-label={props.label ?? 'Loading'}
      class={`${styles.spinner} ${styles[props.size ?? 'lg']} ${props.class ?? ''}`}
    />
  );
};

export default Spinner;
