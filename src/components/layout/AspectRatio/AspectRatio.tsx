import type { ParentProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './AspectRatio.module.css';

interface AspectRatioProps {
  ratio?: number;
}

const AspectRatio = (props: ParentProps<Props<AspectRatioProps>>) => {
  return (
    <div class={`${styles.wrapper} ${props.class ?? ''}`} style={{ 'aspect-ratio': String(props.ratio ?? 16 / 9) }}>
      {props.children}
    </div>
  );
};

export default AspectRatio;
