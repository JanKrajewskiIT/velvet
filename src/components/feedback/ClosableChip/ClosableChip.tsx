import { IoCloseOutline } from 'solid-icons/io';
import { type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Chip from '../Chip/Chip';
import styles from './ClosableChip.module.css';

interface ClosableChipOwnProps {
  children: JSX.Element;
  onRemove?: () => void;
  removeLabel?: string;
}

const ClosableChip = (props: Props<ClosableChipOwnProps>) => {
  const [local] = splitProps(props, ['children', 'onRemove', 'removeLabel', 'class']);

  return (
    <Chip variant="subtle" size="sm" class={classNames(styles.chip, local.class)}>
      {local.children}
      <Show when={local.onRemove}>
        <button
          type="button"
          class={styles.removeButton}
          aria-label={local.removeLabel ?? 'Remove'}
          onClick={(event) => {
            event.stopPropagation();
            local.onRemove?.();
          }}
        >
          <IoCloseOutline />
        </button>
      </Show>
    </Chip>
  );
};

export default ClosableChip;
