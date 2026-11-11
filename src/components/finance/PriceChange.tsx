import { splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { Delta, type DeltaProps } from '../data/Delta';
import styles from './PriceChange.module.css';

export interface PriceChangeProps extends Omit<DeltaProps, 'format' | 'locale'> {
  format?: DeltaProps['format'] | 'bp';
}

/** @deprecated Use Delta. For basis points, pass unit=" bp". */
export const PriceChange = (props: PriceChangeProps) => {
  const [local, rest] = splitProps(props, ['format', 'unit', 'class']);
  return (
    <Delta
      {...rest}
      class={cx(styles.root, local.class)}
      format={local.format === 'bp' ? 'number' : local.format}
      unit={local.unit ?? (local.format === 'bp' ? ' bp' : undefined)}
    />
  );
};
